-- CodeNest — Initial Database Schema
-- Supabase Dashboard > SQL Editor'da çalıştırın

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm"; -- fuzzy search

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- auth.users ile 1-1 ilişki, trigger ile otomatik oluşturulur
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text unique not null check (username ~ '^[a-z0-9_]{3,30}$'),
  display_name    text not null check (char_length(display_name) <= 50),
  avatar_url      text,
  cover_url       text,
  bio             text check (char_length(bio) <= 300),
  location        text check (char_length(location) <= 100),
  website         text,
  github_url      text,
  twitter_url     text,
  linkedin_url    text,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  posts_count     integer not null default 0,
  is_verified     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Yeni kullanıcı kaydolduğunda profile otomatik oluştur
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Posts ───────────────────────────────────────────────────────────────────
create type public.post_type as enum ('snippet', 'project', 'article', 'repost', 'quote');

create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  author_id        uuid not null references public.profiles(id) on delete cascade,
  type             public.post_type not null default 'snippet',
  title            text check (char_length(title) <= 200),
  content          text not null default '',
  tags             text[] not null default '{}',
  language         text,
  snippets         jsonb not null default '[]',
  media            jsonb not null default '[]',
  likes_count      integer not null default 0,
  comments_count   integer not null default 0,
  reposts_count    integer not null default 0,
  saves_count      integer not null default 0,
  views_count      integer not null default 0,
  reposted_post_id uuid references public.posts(id) on delete set null,
  quoted_post_id   uuid references public.posts(id) on delete set null,
  article_id       uuid,
  project_id       uuid,
  is_draft         boolean not null default false,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index posts_author_idx  on public.posts(author_id);
create index posts_type_idx    on public.posts(type);
create index posts_tags_idx    on public.posts using gin(tags);
create index posts_created_idx on public.posts(created_at desc);

-- ─── Articles ────────────────────────────────────────────────────────────────
create table public.articles (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.posts(id) on delete cascade,
  title        text not null,
  subtitle     text,
  cover_image  text,
  content_json jsonb not null default '[]',
  reading_time integer not null default 1,
  word_count   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ─── Comments ────────────────────────────────────────────────────────────────
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.posts(id) on delete cascade,
  author_id     uuid not null references public.profiles(id) on delete cascade,
  content       text not null check (char_length(content) <= 2000),
  snippets      jsonb not null default '[]',
  likes_count   integer not null default 0,
  replies_count integer not null default 0,
  parent_id     uuid references public.comments(id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index comments_post_idx    on public.comments(post_id);
create index comments_parent_idx  on public.comments(parent_id);
create index comments_author_idx  on public.comments(author_id);

-- ─── Likes ───────────────────────────────────────────────────────────────────
create table public.likes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint likes_target_check check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null)
  ),
  unique (user_id, post_id),
  unique (user_id, comment_id)
);

-- Post beğeni sayacı güncelleyici
create or replace function public.update_post_likes()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' and new.post_id is not null then
    update public.posts set likes_count = likes_count + 1 where id = new.post_id;
  elsif TG_OP = 'DELETE' and old.post_id is not null then
    update public.posts set likes_count = greatest(0, likes_count - 1) where id = old.post_id;
  end if;
  return null;
end;
$$;

create trigger on_like_post
  after insert or delete on public.likes
  for each row execute function public.update_post_likes();

-- ─── Follows ─────────────────────────────────────────────────────────────────
create table public.follows (
  id           uuid primary key default gen_random_uuid(),
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

create index follows_follower_idx  on public.follows(follower_id);
create index follows_following_idx on public.follows(following_id);

-- Takip sayaçları
create or replace function public.update_follow_counts()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.profiles set following_count = following_count + 1 where id = new.follower_id;
    update public.profiles set followers_count = followers_count + 1 where id = new.following_id;
  elsif TG_OP = 'DELETE' then
    update public.profiles set following_count = greatest(0, following_count - 1) where id = old.follower_id;
    update public.profiles set followers_count = greatest(0, followers_count - 1) where id = old.following_id;
  end if;
  return null;
end;
$$;

create trigger on_follow_change
  after insert or delete on public.follows
  for each row execute function public.update_follow_counts();

-- ─── Collections ─────────────────────────────────────────────────────────────
create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  name        text not null check (char_length(name) <= 100),
  description text check (char_length(description) <= 500),
  cover_image text,
  is_public   boolean not null default true,
  posts_count integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index collections_owner_idx on public.collections(owner_id);

-- ─── Saves ───────────────────────────────────────────────────────────────────
create table public.saves (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  post_id       uuid not null references public.posts(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (user_id, post_id)
);

create index saves_user_idx       on public.saves(user_id);
create index saves_collection_idx on public.saves(collection_id);

-- Kaydetme sayaçları
create or replace function public.update_save_counts()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.posts set saves_count = saves_count + 1 where id = new.post_id;
    if new.collection_id is not null then
      update public.collections set posts_count = posts_count + 1 where id = new.collection_id;
    end if;
  elsif TG_OP = 'DELETE' then
    update public.posts set saves_count = greatest(0, saves_count - 1) where id = old.post_id;
    if old.collection_id is not null then
      update public.collections set posts_count = greatest(0, posts_count - 1) where id = old.collection_id;
    end if;
  end if;
  return null;
end;
$$;

create trigger on_save_change
  after insert or delete on public.saves
  for each row execute function public.update_save_counts();

-- ─── Notifications ───────────────────────────────────────────────────────────
create type public.notification_type as enum (
  'like', 'comment', 'reply', 'follow', 'message', 'repost', 'quote', 'mention'
);

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  actor_id   uuid not null references public.profiles(id) on delete cascade,
  type       public.notification_type not null,
  post_id    uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx    on public.notifications(user_id);
create index notifications_unread_idx  on public.notifications(user_id, is_read) where is_read = false;
create index notifications_created_idx on public.notifications(created_at desc);

-- ─── Conversations & Messages ─────────────────────────────────────────────────
create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  content         text not null check (char_length(content) <= 5000),
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index messages_conv_idx    on public.messages(conversation_id);
create index messages_created_idx on public.messages(created_at desc);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles              enable row level security;
alter table public.posts                 enable row level security;
alter table public.articles              enable row level security;
alter table public.comments              enable row level security;
alter table public.likes                 enable row level security;
alter table public.follows               enable row level security;
alter table public.collections           enable row level security;
alter table public.saves                 enable row level security;
alter table public.notifications         enable row level security;
alter table public.conversations         enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages              enable row level security;

-- Profiles: herkes okuyabilir, sadece sahip yazabilir
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Posts: draft olmayanlar herkese açık
create policy "posts_select" on public.posts for select
  using (is_draft = false or author_id = auth.uid());
create policy "posts_insert" on public.posts for insert
  with check (auth.uid() = author_id);
create policy "posts_update" on public.posts for update
  using (auth.uid() = author_id);
create policy "posts_delete" on public.posts for delete
  using (auth.uid() = author_id);

-- Comments: herkes okuyabilir
create policy "comments_select" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments_update" on public.comments for update using (auth.uid() = author_id);
create policy "comments_delete" on public.comments for delete using (auth.uid() = author_id);

-- Likes: herkes okur, sadece kendi işlemi
create policy "likes_select" on public.likes for select using (true);
create policy "likes_insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on public.likes for delete using (auth.uid() = user_id);

-- Follows: herkes okur
create policy "follows_select" on public.follows for select using (true);
create policy "follows_insert" on public.follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete" on public.follows for delete using (auth.uid() = follower_id);

-- Collections: public olanlar herkese, private sadece sahibe
create policy "collections_select" on public.collections for select
  using (is_public = true or owner_id = auth.uid());
create policy "collections_insert" on public.collections for insert with check (auth.uid() = owner_id);
create policy "collections_update" on public.collections for update using (auth.uid() = owner_id);
create policy "collections_delete" on public.collections for delete using (auth.uid() = owner_id);

-- Saves
create policy "saves_select" on public.saves for select using (auth.uid() = user_id);
create policy "saves_insert" on public.saves for insert with check (auth.uid() = user_id);
create policy "saves_delete" on public.saves for delete using (auth.uid() = user_id);

-- Notifications: sadece sahibi okur
create policy "notifications_select" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update" on public.notifications for update using (auth.uid() = user_id);

-- Messages: sadece katılımcılar
create policy "messages_select" on public.messages for select
  using (exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
  ));
create policy "messages_insert" on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
    )
  );

-- Articles
create policy "articles_select" on public.articles for select using (true);
create policy "articles_insert" on public.articles for insert
  with check (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid()));
create policy "articles_update" on public.articles for update
  using (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid()));

-- ─── Realtime ────────────────────────────────────────────────────────────────
-- Aşağıdaki tablolar için realtime açık
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- ─── Storage Buckets ──────────────────────────────────────────────────────────
-- Supabase Dashboard > Storage > New Bucket ile oluşturun:
-- bucket: "avatars"   — public
-- bucket: "covers"    — public
-- bucket: "post-media"— public
-- bucket: "article-covers" — public
