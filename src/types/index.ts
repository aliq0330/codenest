// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified: boolean;
  is_following?: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Post ────────────────────────────────────────────────────────────────────

export type PostType = "snippet" | "project" | "article" | "repost" | "quote";

export interface Post {
  id: string;
  type: PostType;
  author: User;
  title: string | null;
  content: string;
  tags: string[];
  language: string | null;
  snippets: CodeSnippet[];
  media: MediaItem[];
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  saves_count: number;
  views_count: number;
  is_liked: boolean;
  is_saved: boolean;
  is_reposted: boolean;
  reposted_post: Post | null;
  quoted_post: Post | null;
  article: Article | null;
  project: Project | null;
  is_draft: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Code ────────────────────────────────────────────────────────────────────

export interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  code: string;
  theme?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  is_open?: boolean;
  is_modified?: boolean;
}

export interface ProjectFolder {
  id: string;
  name: string;
  path: string;
  is_open?: boolean;
  children: (ProjectFile | ProjectFolder)[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  folders: ProjectFolder[];
  entry_file: string;
  framework: string | null;
  fork_count: number;
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export type EditorTheme =
  | "codenest-dark"
  | "codenest-light"
  | "obsidian"
  | "night-owl"
  | "dracula"
  | "github-dark"
  | "github-light"
  | "monochrome";

export interface EditorSettings {
  theme: EditorTheme;
  font_size: number;
  tab_size: number;
  line_numbers: boolean;
  word_wrap: boolean;
  auto_complete: boolean;
  bracket_matching: boolean;
  auto_save: boolean;
}

export interface EditorTab {
  id: string;
  file_id: string;
  filename: string;
  language: string;
  is_dirty: boolean;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  post_id: string;
  author: User;
  content: string;
  snippets: CodeSnippet[];
  likes_count: number;
  is_liked: boolean;
  replies: Comment[];
  replies_count: number;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Article ─────────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  cover_image: string | null;
  reading_time: number;
  word_count: number;
}

// ─── Collection ──────────────────────────────────────────────────────────────

export interface Collection {
  id: string;
  owner: User;
  name: string;
  description: string | null;
  cover_image: string | null;
  is_public: boolean;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

// ─── Notification ────────────────────────────────────────────────────────────

export type NotificationType =
  | "like"
  | "comment"
  | "reply"
  | "follow"
  | "message"
  | "repost"
  | "quote"
  | "mention";

export interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  post: Post | null;
  comment: Comment | null;
  is_read: boolean;
  created_at: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  conversation_id: string;
  sender: User;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  last_message: Message | null;
  unread_count: number;
  is_online: boolean;
  updated_at: string;
}

// ─── Media ───────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "gif";
  width?: number;
  height?: number;
  alt?: string;
}

// ─── Misc ────────────────────────────────────────────────────────────────────

export type FeedTab = "following" | "suggested" | "trending";
export type ProfileTab = "posts" | "collections" | "likes" | "articles";
export type SearchTab = "posts" | "users" | "tags" | "collections";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  has_more: boolean;
  next_cursor: string | null;
}
