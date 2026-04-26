import { useState } from "react";
import { User, Lock, Palette, Bell, Shield, Code2 } from "lucide-react";
import { Input, Textarea, Button } from "@/components/ui";
import { useEditorStore } from "@/store/editor.store";
import { cn } from "@/lib/utils";
import { THEME_LABELS, THEME_PREVIEWS, type EditorThemeName } from "@/modules/editor/themes";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "editor", label: "Editor", icon: Code2 },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${checked ? "bg-[#f5f5f5]" : "bg-[#2e2e2e]"}`}
      onClick={() => onChange(!checked)}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#0a0a0a] transition-all ${checked ? "left-4" : "left-0.5"}`} />
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-[#2e2e2e] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#f5f5f5]">{label}</p>
        {description && <p className="text-xs text-[#6b6b6b] mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const [section, setSection] = useState("profile");
  const { settings, updateSettings } = useEditorStore();

  const [profile, setProfile] = useState({
    display_name: "My Name", username: "myusername", bio: "", location: "", website: "",
    github_url: "", twitter_url: "", linkedin_url: "",
  });

  const [notifSettings, setNotifSettings] = useState({
    likes: true, comments: true, follows: true, mentions: true, messages: true, reposts: false,
  });

  const [privacy, setPrivacy] = useState({ public_profile: true, allow_messages: "everyone" });

  return (
    <div className="flex min-h-full">
      {/* Left nav */}
      <div className="hidden w-48 shrink-0 border-r border-[#2e2e2e] py-4 sm:block">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={cn(
              "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors text-left",
              section === id ? "text-[#f5f5f5] bg-[#1a1a1a]" : "text-[#6b6b6b] hover:text-[#a3a3a3] hover:bg-[#111111]"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {/* Mobile section picker */}
        <select
          className="mb-4 w-full rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-3 py-2 text-sm text-[#f5f5f5] sm:hidden"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          {SECTIONS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </select>

        {/* Profile */}
        {section === "profile" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">Profile</h2>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#1a1a1a] ring-1 ring-[#2e2e2e]" />
              <Button size="sm" variant="outline">Change Avatar</Button>
            </div>
            <div className="flex flex-col gap-3">
              <Input label="Display Name" value={profile.display_name} onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))} />
              <Input label="Username" value={profile.username} left={<span className="text-xs">@</span>} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} />
              <Textarea label="Bio" value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} rows={3} hint="Max 300 characters" />
              <Input label="Location" value={profile.location} placeholder="Berlin, Germany" onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} />
              <Input label="Website" value={profile.website} placeholder="https://yoursite.com" onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} />
              <Input label="GitHub" value={profile.github_url} placeholder="github.com/username" onChange={(e) => setProfile((p) => ({ ...p, github_url: e.target.value }))} />
              <Input label="Twitter / X" value={profile.twitter_url} placeholder="@username" onChange={(e) => setProfile((p) => ({ ...p, twitter_url: e.target.value }))} />
              <Input label="LinkedIn" value={profile.linkedin_url} placeholder="linkedin.com/in/username" onChange={(e) => setProfile((p) => ({ ...p, linkedin_url: e.target.value }))} />
              <Button variant="primary" className="mt-2 self-start">Save Changes</Button>
            </div>
          </div>
        )}

        {/* Account */}
        {section === "account" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">Account</h2>
            <div className="flex flex-col gap-3">
              <Input label="Email" type="email" defaultValue="me@example.com" />
              <div className="h-px bg-[#2e2e2e] my-2" />
              <h3 className="text-sm font-semibold text-[#f5f5f5]">Change Password</h3>
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
              <Button variant="primary" className="self-start">Update Password</Button>
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <h3 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h3>
                <p className="text-xs text-[#6b6b6b] mb-3">Permanently delete your account and all your data.</p>
                <Button variant="danger" size="sm">Delete Account</Button>
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        {section === "appearance" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">Appearance</h2>
            <p className="text-xs text-[#6b6b6b] mb-4">CodeNest uses dark mode by default for optimal code readability.</p>
            <div className="grid grid-cols-2 gap-3">
              {(["dark", "light"] as const).map((mode) => (
                <button
                  key={mode}
                  className={`rounded-xl border p-4 text-left transition-all ${mode === "dark" ? "border-[#f5f5f5] bg-[#111111]" : "border-[#2e2e2e] bg-[#1a1a1a] opacity-50 cursor-not-allowed"}`}
                  disabled={mode === "light"}
                >
                  <div className={`mb-2 h-10 w-full rounded-lg ${mode === "dark" ? "bg-[#0a0a0a]" : "bg-white"}`} />
                  <p className="text-xs font-medium text-[#f5f5f5] capitalize">{mode} Mode</p>
                  {mode === "light" && <p className="text-xs text-[#6b6b6b]">Coming soon</p>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {section === "notifications" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">Notifications</h2>
            <div className="rounded-xl border border-[#2e2e2e] bg-[#111111] px-4">
              {(Object.keys(notifSettings) as (keyof typeof notifSettings)[]).map((key) => (
                <SettingRow
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  description={`Notify when someone ${key === "follows" ? "follows you" : `${key} your post`}`}
                >
                  <Toggle checked={notifSettings[key]} onChange={(v) => setNotifSettings((p) => ({ ...p, [key]: v }))} />
                </SettingRow>
              ))}
            </div>
          </div>
        )}

        {/* Privacy */}
        {section === "privacy" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">Privacy</h2>
            <div className="rounded-xl border border-[#2e2e2e] bg-[#111111] px-4">
              <SettingRow label="Public Profile" description="Anyone can see your profile and posts">
                <Toggle checked={privacy.public_profile} onChange={(v) => setPrivacy((p) => ({ ...p, public_profile: v }))} />
              </SettingRow>
              <SettingRow label="Allow Messages From" description="Who can send you direct messages">
                <select
                  value={privacy.allow_messages}
                  onChange={(e) => setPrivacy((p) => ({ ...p, allow_messages: e.target.value }))}
                  className="rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-1 text-xs text-[#f5f5f5]"
                >
                  <option value="everyone">Everyone</option>
                  <option value="following">Following only</option>
                  <option value="nobody">Nobody</option>
                </select>
              </SettingRow>
            </div>
          </div>
        )}

        {/* Editor */}
        {section === "editor" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">Editor Preferences</h2>

            {/* Theme */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-[#a3a3a3]">Theme</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(THEME_LABELS) as EditorThemeName[]).map((name) => {
                  const p = THEME_PREVIEWS[name];
                  return (
                    <button
                      key={name}
                      onClick={() => updateSettings({ theme: name })}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs transition-all ${settings.theme === name ? "border-[#f5f5f5]" : "border-[#2e2e2e] hover:border-[#6b6b6b]"}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded" style={{ background: p.bg }}>
                        <span className="text-[9px] font-mono" style={{ color: p.fg }}>Aa</span>
                      </span>
                      <span className="text-[#a3a3a3] truncate">{THEME_LABELS[name]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font size */}
            <div className="mb-4 rounded-xl border border-[#2e2e2e] bg-[#111111] px-4">
              <SettingRow label="Font Size" description={`Current: ${settings.font_size}px`}>
                <input type="range" min={11} max={20} value={settings.font_size}
                  onChange={(e) => updateSettings({ font_size: Number(e.target.value) })}
                  className="w-24 accent-[#f5f5f5]" />
              </SettingRow>
              <SettingRow label="Tab Size" description="Spaces per tab level">
                <select
                  value={settings.tab_size}
                  onChange={(e) => updateSettings({ tab_size: Number(e.target.value) })}
                  className="rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-1 text-xs text-[#f5f5f5]"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </SettingRow>
              {([
                { key: "line_numbers", label: "Line Numbers" },
                { key: "word_wrap", label: "Word Wrap" },
                { key: "auto_complete", label: "Auto Complete" },
                { key: "bracket_matching", label: "Bracket Matching" },
                { key: "auto_save", label: "Auto Save" },
              ] as { key: keyof typeof settings; label: string }[]).map(({ key, label }) => (
                <SettingRow key={key} label={label}>
                  <Toggle
                    checked={settings[key] as boolean}
                    onChange={(v) => updateSettings({ [key]: v })}
                  />
                </SettingRow>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
