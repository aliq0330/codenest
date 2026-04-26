import { useState } from "react";
import { User, Lock, Palette, Bell, Shield, Code2, Globe, Sun, Moon } from "lucide-react";
import { Input, Textarea, Button } from "@/components/ui";
import { useEditorStore } from "@/store/editor.store";
import { useUIStore } from "@/store/ui.store";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { THEME_LABELS, THEME_PREVIEWS, type EditorThemeName } from "@/modules/editor/themes";

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
  const t = useT();
  const { theme, setTheme, lang, setLang } = useUIStore();
  const [section, setSection] = useState("profile");
  const { settings, updateSettings } = useEditorStore();

  const SECTIONS = [
    { id: "profile",       label: t.settings.sections.profile,       icon: User },
    { id: "account",       label: t.settings.sections.account,       icon: Lock },
    { id: "appearance",    label: t.settings.sections.appearance,    icon: Palette },
    { id: "language",      label: t.settings.sections.language,      icon: Globe },
    { id: "notifications", label: t.settings.sections.notifications, icon: Bell },
    { id: "privacy",       label: t.settings.sections.privacy,       icon: Shield },
    { id: "editor",        label: t.settings.sections.editor,        icon: Code2 },
  ];

  const [profile, setProfile] = useState({
    display_name: "", username: "", bio: "", location: "", website: "",
    github_url: "", twitter_url: "", linkedin_url: "",
  });

  const [notifSettings, setNotifSettings] = useState({
    likes: true, comments: true, follows: true, mentions: true, messages: true, reposts: false,
  });

  const [privacy, setPrivacy] = useState({ public_profile: true, allow_messages: "everyone" });

  const sn = t.settings.notifications;
  const notifRows = [
    { key: "likes",    label: sn.likes,    desc: sn.likesDesc },
    { key: "comments", label: sn.comments, desc: sn.commentsDesc },
    { key: "follows",  label: sn.follows,  desc: sn.followsDesc },
    { key: "mentions", label: sn.mentions, desc: sn.mentionsDesc },
    { key: "messages", label: sn.messages, desc: sn.messagesDesc },
    { key: "reposts",  label: sn.reposts,  desc: sn.repostsDesc },
  ] as const;

  const editorToggles = [
    { key: "line_numbers",      label: t.settings.editor.lineNumbers },
    { key: "word_wrap",         label: t.settings.editor.wordWrap },
    { key: "auto_complete",     label: t.settings.editor.autoComplete },
    { key: "bracket_matching",  label: t.settings.editor.bracketMatching },
    { key: "auto_save",         label: t.settings.editor.autoSave },
  ] as const;

  return (
    <div className="flex min-h-full">
      {/* Left nav */}
      <div className="hidden w-52 shrink-0 border-r border-[#2e2e2e] py-4 sm:block">
        <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-widest text-[#3d3d3d]">
          {t.settings.title}
        </p>
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={cn(
              "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors text-left",
              section === id
                ? "text-[#f5f5f5] bg-[#1a1a1a]"
                : "text-[#6b6b6b] hover:text-[#a3a3a3] hover:bg-[#1a1a1a]"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {/* Mobile picker */}
        <select
          className="mb-4 w-full rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-3 py-2 text-sm text-[#f5f5f5] sm:hidden"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          {SECTIONS.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </select>

        {/* ── Profile ── */}
        {section === "profile" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">{t.settings.profile.title}</h2>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#1a1a1a] ring-1 ring-[#2e2e2e]" />
              <Button size="sm" variant="outline">{t.settings.profile.changeAvatar}</Button>
            </div>
            <div className="flex flex-col gap-3">
              <Input label={t.settings.profile.displayName} value={profile.display_name} onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))} />
              <Input label={t.settings.profile.username} value={profile.username} left={<span className="text-xs">@</span>} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} />
              <Textarea label={t.settings.profile.bio} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} rows={3} hint={t.settings.profile.bioHint} />
              <Input label={t.settings.profile.location} value={profile.location} placeholder="İstanbul, Türkiye" onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} />
              <Input label={t.settings.profile.website} value={profile.website} placeholder="https://siteniz.com" onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} />
              <Input label={t.settings.profile.github} value={profile.github_url} placeholder="github.com/kullanici" onChange={(e) => setProfile((p) => ({ ...p, github_url: e.target.value }))} />
              <Input label={t.settings.profile.twitter} value={profile.twitter_url} placeholder="@kullanici" onChange={(e) => setProfile((p) => ({ ...p, twitter_url: e.target.value }))} />
              <Input label={t.settings.profile.linkedin} value={profile.linkedin_url} placeholder="linkedin.com/in/kullanici" onChange={(e) => setProfile((p) => ({ ...p, linkedin_url: e.target.value }))} />
              <Button variant="primary" className="mt-2 self-start">{t.settings.profile.save}</Button>
            </div>
          </div>
        )}

        {/* ── Account ── */}
        {section === "account" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">{t.settings.account.title}</h2>
            <div className="flex flex-col gap-3">
              <Input label={t.settings.account.email} type="email" defaultValue="me@example.com" />
              <div className="h-px bg-[#2e2e2e] my-2" />
              <h3 className="text-sm font-semibold text-[#f5f5f5]">{t.settings.account.changePassword}</h3>
              <Input label={t.settings.account.currentPassword} type="password" />
              <Input label={t.settings.account.newPassword} type="password" />
              <Input label={t.settings.account.confirmPassword} type="password" />
              <Button variant="primary" className="self-start">{t.settings.account.updatePassword}</Button>
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <h3 className="text-sm font-semibold text-red-400 mb-1">{t.settings.account.dangerZone}</h3>
                <p className="text-xs text-[#6b6b6b] mb-3">{t.settings.account.deleteDesc}</p>
                <Button variant="danger" size="sm">{t.settings.account.deleteAccount}</Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Appearance ── */}
        {section === "appearance" && (
          <div>
            <h2 className="mb-1 text-base font-bold text-[#f5f5f5]">{t.settings.appearance.title}</h2>
            <p className="mb-5 text-xs text-[#6b6b6b]">{t.settings.appearance.subtitle}</p>
            <div className="grid grid-cols-2 gap-3">
              {(["dark", "light"] as const).map((mode) => {
                const isSelected = theme === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-[#f5f5f5] ring-1 ring-[#f5f5f5]/30"
                        : "border-[#2e2e2e] hover:border-[#6b6b6b]"
                    )}
                  >
                    <div className={cn(
                      "mb-3 h-16 w-full rounded-lg flex items-center justify-center",
                      mode === "dark" ? "bg-[#0a0a0a] border border-[#2e2e2e]" : "bg-white border border-gray-200"
                    )}>
                      {mode === "dark"
                        ? <Moon className="h-6 w-6 text-[#6b6b6b]" />
                        : <Sun className="h-6 w-6 text-yellow-500" />
                      }
                    </div>
                    <p className="text-sm font-semibold text-[#f5f5f5]">
                      {mode === "dark" ? t.settings.appearance.dark : t.settings.appearance.light}
                    </p>
                    {isSelected && (
                      <span className="mt-1 inline-block rounded-full bg-[#f5f5f5]/10 px-2 py-0.5 text-xs text-[#a3a3a3]">✓ Aktif</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Language ── */}
        {section === "language" && (
          <div>
            <h2 className="mb-1 text-base font-bold text-[#f5f5f5]">{t.settings.language.title}</h2>
            <p className="mb-5 text-xs text-[#6b6b6b]">{t.settings.language.subtitle}</p>
            <div className="grid grid-cols-2 gap-3">
              {(["tr", "en"] as const).map((l) => {
                const isSelected = lang === l;
                return (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-[#f5f5f5] ring-1 ring-[#f5f5f5]/30"
                        : "border-[#2e2e2e] hover:border-[#6b6b6b]"
                    )}
                  >
                    <span className="text-2xl">{l === "tr" ? "🇹🇷" : "🇬🇧"}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#f5f5f5]">
                        {l === "tr" ? t.settings.language.tr : t.settings.language.en}
                      </p>
                      {isSelected && (
                        <p className="text-xs text-[#6b6b6b]">✓ Aktif</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Notifications ── */}
        {section === "notifications" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">{t.settings.notifications.title}</h2>
            <div className="rounded-xl border border-[#2e2e2e] bg-[#111111] px-4">
              {notifRows.map(({ key, label, desc }) => (
                <SettingRow key={key} label={label} description={desc}>
                  <Toggle
                    checked={notifSettings[key]}
                    onChange={(v) => setNotifSettings((p) => ({ ...p, [key]: v }))}
                  />
                </SettingRow>
              ))}
            </div>
          </div>
        )}

        {/* ── Privacy ── */}
        {section === "privacy" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">{t.settings.privacy.title}</h2>
            <div className="rounded-xl border border-[#2e2e2e] bg-[#111111] px-4">
              <SettingRow label={t.settings.privacy.publicProfile} description={t.settings.privacy.publicProfileDesc}>
                <Toggle checked={privacy.public_profile} onChange={(v) => setPrivacy((p) => ({ ...p, public_profile: v }))} />
              </SettingRow>
              <SettingRow label={t.settings.privacy.allowMessages} description={t.settings.privacy.allowMessagesDesc}>
                <select
                  value={privacy.allow_messages}
                  onChange={(e) => setPrivacy((p) => ({ ...p, allow_messages: e.target.value }))}
                  className="rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-1 text-xs text-[#f5f5f5]"
                >
                  <option value="everyone">{t.settings.privacy.everyone}</option>
                  <option value="following">{t.settings.privacy.following}</option>
                  <option value="nobody">{t.settings.privacy.nobody}</option>
                </select>
              </SettingRow>
            </div>
          </div>
        )}

        {/* ── Editor ── */}
        {section === "editor" && (
          <div>
            <h2 className="mb-6 text-base font-bold text-[#f5f5f5]">{t.settings.editor.title}</h2>
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-[#a3a3a3]">{t.settings.editor.theme}</p>
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
            <div className="mb-4 rounded-xl border border-[#2e2e2e] bg-[#111111] px-4">
              <SettingRow label={t.settings.editor.fontSize} description={t.settings.editor.fontSizeCurrent(settings.font_size)}>
                <input type="range" min={11} max={20} value={settings.font_size}
                  onChange={(e) => updateSettings({ font_size: Number(e.target.value) })}
                  className="w-24 accent-[#f5f5f5]" />
              </SettingRow>
              <SettingRow label={t.settings.editor.tabSize} description="">
                <select
                  value={settings.tab_size}
                  onChange={(e) => updateSettings({ tab_size: Number(e.target.value) })}
                  className="rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-1 text-xs text-[#f5f5f5]"
                >
                  <option value={2}>{t.settings.editor.spaces(2)}</option>
                  <option value={4}>{t.settings.editor.spaces(4)}</option>
                </select>
              </SettingRow>
              {editorToggles.map(({ key, label }) => (
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
