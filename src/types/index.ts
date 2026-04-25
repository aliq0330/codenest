// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  coverImage: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  links: SocialLinks;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

// ─── Post ────────────────────────────────────────────────────────────────────

export type PostType = "snippet" | "project" | "article" | "repost" | "quote";

export interface Post {
  id: string;
  type: PostType;
  author: User;
  title?: string;
  content: string;
  tags: string[];
  language?: string;
  snippets: CodeSnippet[];
  media: MediaItem[];
  links: string[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  savesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isReposted: boolean;
  // Repost / quote
  repostedPost?: Post | null;
  quotedPost?: Post | null;
  // Article
  article?: Article | null;
  // Project
  project?: Project | null;
  isDraft: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  isOpen?: boolean;
  isModified?: boolean;
}

export interface ProjectFolder {
  id: string;
  name: string;
  path: string;
  isOpen?: boolean;
  children: (ProjectFile | ProjectFolder)[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  folders: ProjectFolder[];
  entryFile: string;
  framework?: string;
  isPublic: boolean;
  forkCount: number;
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
  fontSize: number;
  tabSize: number;
  lineNumbers: boolean;
  wordWrap: boolean;
  minimap: boolean;
  autoComplete: boolean;
  bracketMatching: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
}

export interface EditorTab {
  id: string;
  fileId: string;
  filename: string;
  language: string;
  isDirty: boolean;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  snippets: CodeSnippet[];
  mentions: string[];
  likesCount: number;
  isLiked: boolean;
  replies: Comment[];
  repliesCount: number;
  parentId: string | null;
  asPost?: Post | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Article ─────────────────────────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: ArticleBlock[];
  coverImage?: string;
  readingTime: number;
  wordCount: number;
}

export type ArticleBlockType = "heading" | "subheading" | "paragraph" | "code" | "image" | "quote" | "divider";

export interface ArticleBlock {
  id: string;
  type: ArticleBlockType;
  content: string;
  level?: 1 | 2 | 3;
  language?: string;
  caption?: string;
  alt?: string;
}

// ─── Collection ──────────────────────────────────────────────────────────────

export interface Collection {
  id: string;
  owner: User;
  name: string;
  description: string | null;
  coverImage: string | null;
  isPublic: boolean;
  postsCount: number;
  posts: Post[];
  createdAt: string;
  updatedAt: string;
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
  post?: Post | null;
  comment?: Comment | null;
  message?: string | null;
  isRead: boolean;
  createdAt: string;
}

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  conversationId: string;
  sender: User;
  content: string;
  attachments: MediaItem[];
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message | null;
  unreadCount: number;
  isOnline: boolean;
  updatedAt: string;
}

// ─── Media ───────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "gif" | "video";
  width?: number;
  height?: number;
  alt?: string;
}

// ─── Feed & Pagination ───────────────────────────────────────────────────────

export type FeedTab = "following" | "suggested" | "trending";
export type ExploreFilter = "all" | "html" | "css" | "javascript" | "typescript" | "react" | "vue";
export type ProfileTab = "posts" | "collections" | "likes" | "articles";
export type NotificationFilter = "all" | "likes" | "comments" | "follows" | "mentions";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextCursor?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Search ──────────────────────────────────────────────────────────────────

export type SearchTab = "posts" | "users" | "tags" | "collections";

export interface SearchResult {
  posts: Post[];
  users: User[];
  tags: string[];
  collections: Collection[];
}
