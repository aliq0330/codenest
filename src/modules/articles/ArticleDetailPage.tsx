import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, MessageCircle, Share2, MoreHorizontal, Clock, Eye } from "lucide-react";
import { Avatar, Badge, TagPill, Button } from "@/components/ui";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

const MOCK_ARTICLES: Record<string, {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  cover_url: string | null;
  author: { username: string; display_name: string; avatar_url: string | null; bio: string; followers_count: number };
  tags: string[];
  read_time: number;
  likes_count: number;
  comments_count: number;
  views_count: number;
  published_at: string;
}> = {
  a1: {
    id: "a1",
    title: "The Complete Guide to CSS Grid Masonry Layouts",
    subtitle: "How to achieve Pinterest-style masonry layouts using only CSS Grid — no JavaScript required.",
    content: `## Introduction

CSS Grid has evolved significantly, and one of the most exciting upcoming features is native masonry layout support. While full browser support is still rolling out, we can already achieve beautiful masonry-style layouts today.

## What is Masonry?

A masonry layout arranges elements in a grid where items fill in vertically, similar to how bricks are stacked in a wall. Think Pinterest — items have equal widths but variable heights, packed tightly together.

## The CSS-Only Approach

Here's the magic:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: masonry;
  gap: 1rem;
}
\`\`\`

The \`grid-template-rows: masonry\` property is the key. It tells the browser to pack items using masonry algorithm instead of standard grid placement.

## Browser Support

Currently supported in Firefox with a flag, and rolling out to Chrome/Safari. For production, consider a polyfill or the \`column-count\` fallback:

\`\`\`css
@supports not (grid-template-rows: masonry) {
  .grid {
    columns: 3;
    column-gap: 1rem;
  }
  .grid > * {
    break-inside: avoid;
    margin-bottom: 1rem;
  }
}
\`\`\`

## Performance Considerations

Unlike JavaScript-based masonry (Masonry.js, Packery), CSS-native masonry:
- Zero JavaScript bundle cost
- No layout recalculation on resize
- Works with CSS animations natively
- Respects user's \`prefers-reduced-motion\`

## Conclusion

Native CSS masonry is almost here. Start writing the CSS now and progressively enhance as browser support improves.`,
    cover_url: null,
    author: {
      username: "alexchen",
      display_name: "Alex Chen",
      avatar_url: null,
      bio: "CSS wizard & frontend developer. I write about modern CSS techniques.",
      followers_count: 12400,
    },
    tags: ["css", "grid", "layout", "frontend"],
    read_time: 5,
    likes_count: 847,
    comments_count: 42,
    views_count: 18900,
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  a2: {
    id: "a2",
    title: "React 19: Everything You Need to Know",
    subtitle: "A comprehensive breakdown of React 19's new features, concurrent rendering improvements, and the new compiler.",
    content: `## React 19 is Here

React 19 brings significant changes to how we write React applications. Let's dive into the most important additions.

## The React Compiler

The biggest news: React no longer requires manual memoization. The new compiler automatically handles \`useMemo\`, \`useCallback\`, and \`React.memo\` for you.

Before:
\`\`\`tsx
const Component = ({ items }) => {
  const sorted = useMemo(() => items.sort(), [items]);
  const handleClick = useCallback(() => {}, []);
  return <ExpensiveChild items={sorted} onClick={handleClick} />;
};
\`\`\`

After:
\`\`\`tsx
const Component = ({ items }) => {
  const sorted = items.sort();
  const handleClick = () => {};
  return <ExpensiveChild items={sorted} onClick={handleClick} />;
};
\`\`\`

## Actions API

Forms now have first-class support:

\`\`\`tsx
async function updateUser(formData: FormData) {
  "use server";
  await db.users.update({ name: formData.get("name") });
}

function UserForm() {
  return (
    <form action={updateUser}>
      <input name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
\`\`\`

## useOptimistic

Optimistic UI updates are now trivial:

\`\`\`tsx
const [optimisticLikes, addOptimistic] = useOptimistic(likes);

const handleLike = async () => {
  addOptimistic(optimisticLikes + 1);
  await likePost(id);
};
\`\`\`

## Conclusion

React 19 is a massive quality-of-life improvement. The compiler alone is worth the upgrade.`,
    cover_url: null,
    author: {
      username: "dev_max",
      display_name: "Max Hoffmann",
      avatar_url: null,
      bio: "Full-stack developer. React core contributor.",
      followers_count: 9800,
    },
    tags: ["react", "javascript", "frontend"],
    read_time: 8,
    likes_count: 3200,
    comments_count: 184,
    views_count: 52000,
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
};

function renderMarkdown(text: string) {
  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="mt-8 mb-3 text-xl font-bold text-[#f5f5f5]">{line.slice(3)}</h2>;
      if (line.startsWith("# ")) return <h1 key={i} className="mt-8 mb-4 text-2xl font-bold text-[#f5f5f5]">{line.slice(2)}</h1>;
      if (line.startsWith("```")) return null;
      if (line === "") return <div key={i} className="h-3" />;
      return <p key={i} className="text-[#a3a3a3] leading-7 text-[15px]">{line}</p>;
    });
}

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const article = MOCK_ARTICLES[id ?? "a1"] ?? MOCK_ARTICLES.a1;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="flex-1 text-sm text-[#6b6b6b]">Article</span>
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b6b6b] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <article className="px-4 py-6">
        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {article.tags.map((t) => <TagPill key={t} label={t} />)}
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold leading-tight text-[#f5f5f5]">{article.title}</h1>
        <p className="mb-6 text-base text-[#6b6b6b] leading-relaxed">{article.subtitle}</p>

        {/* Author + meta */}
        <div className="mb-6 flex items-center gap-3 border-y border-[#2e2e2e] py-4">
          <button onClick={() => navigate(`/profile/${article.author.username}`)}>
            <Avatar src={article.author.avatar_url} alt={article.author.display_name} size="md" />
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate(`/profile/${article.author.username}`)}
              className="text-sm font-semibold text-[#f5f5f5] hover:underline"
            >
              {article.author.display_name}
            </button>
            <div className="flex items-center gap-3 text-xs text-[#6b6b6b] mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.read_time} min read
              </span>
              <span>·</span>
              <span>{formatRelativeTime(article.published_at)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatNumber(article.views_count)}
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline">Follow</Button>
        </div>

        {/* Cover image placeholder */}
        <div className="mb-6 h-48 rounded-xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-[#2e2e2e]" />

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {renderMarkdown(article.content)}
        </div>

        {/* Action bar */}
        <div className="mt-8 flex items-center justify-between border-t border-[#2e2e2e] pt-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-red-400 transition-colors">
              <Heart className="h-5 w-5" />
              <span>{formatNumber(article.likes_count)}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#a3a3a3] transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span>{formatNumber(article.comments_count)}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#a3a3a3] transition-colors">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#a3a3a3] transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Author bio card */}
        <div className="mt-6 rounded-xl border border-[#2e2e2e] bg-[#111111] p-4">
          <div className="flex items-start gap-3">
            <Avatar src={article.author.avatar_url} alt={article.author.display_name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <button
                  onClick={() => navigate(`/profile/${article.author.username}`)}
                  className="text-sm font-semibold text-[#f5f5f5] hover:underline"
                >
                  {article.author.display_name}
                </button>
                <Button size="sm" variant="outline">Follow</Button>
              </div>
              <p className="text-xs text-[#6b6b6b] mb-2">@{article.author.username} · {formatNumber(article.author.followers_count)} followers</p>
              <p className="text-sm text-[#a3a3a3]">{article.author.bio}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
