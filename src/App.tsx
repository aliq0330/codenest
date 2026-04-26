import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import { AppShell } from "@/layouts/AppShell";
import { AuthLayout } from "@/layouts/AuthLayout";

// Pages — lazy imports for better performance
import { FeedPage } from "@/modules/feed/FeedPage";
import { ExplorePage } from "@/modules/explore/ExplorePage";
import { FeaturedPage } from "@/modules/featured/FeaturedPage";
import { TagPage } from "@/modules/explore/TagPage";
import { ProfilePage } from "@/modules/profile/ProfilePage";
import { PostDetailPage } from "@/modules/post/PostDetailPage";
import { MessagesPage } from "@/modules/messages/MessagesPage";
import { NotificationsPage } from "@/modules/notifications/NotificationsPage";
import { CollectionsPage } from "@/modules/collections/CollectionsPage";
import { CollectionDetailPage } from "@/modules/collections/CollectionDetailPage";
import { SearchPage } from "@/modules/search/SearchPage";
import { SettingsPage } from "@/modules/settings/SettingsPage";
import { ArticleDetailPage } from "@/modules/articles/ArticleDetailPage";
import { ComposePage } from "@/modules/post-composer/ComposePage";
import { EditorPage } from "@/modules/editor/EditorPage";
import { LoginPage } from "@/modules/auth/LoginPage";
import { RegisterPage } from "@/modules/auth/RegisterPage";

export default function App() {
  return (
    <HashRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#f5f5f5",
            border: "1px solid #2e2e2e",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/feed" replace />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Editor (fullscreen, no AppShell) */}
        <Route path="/editor/new" element={<EditorPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />

        {/* Compose (fullscreen) */}
        <Route path="/compose" element={<ComposePage />} />

        {/* App routes with sidebar */}
        <Route element={<AppShell />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/tags" element={<ExplorePage />} />
          <Route path="/tags/:tag" element={<TagPage />} />
          <Route path="/profile" element={<ProfilePage username="me" />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </HashRouter>
  );
}
