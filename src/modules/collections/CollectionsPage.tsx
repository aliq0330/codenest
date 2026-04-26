import { useState } from "react";
import { Plus, Lock, Globe, Edit2, Trash2, MoreHorizontal, Bookmark } from "lucide-react";
import { Button, Modal, Input, Textarea, Dropdown, Badge } from "@/components/ui";
import { useNavigate } from "react-router-dom";

interface MockCollection {
  id: string;
  name: string;
  description: string;
  cover_image: string | null;
  is_public: boolean;
  posts_count: number;
}

const INITIAL: MockCollection[] = [
  { id: "c1", name: "React Components", description: "Reusable React component patterns I love", cover_image: null, is_public: true, posts_count: 24 },
  { id: "c2", name: "CSS Effects", description: "Stunning pure CSS visual effects", cover_image: null, is_public: true, posts_count: 18 },
  { id: "c3", name: "Login Screens", description: "Beautiful auth form designs", cover_image: null, is_public: false, posts_count: 7 },
  { id: "c4", name: "Algorithm Patterns", description: "Common interview algorithms", cover_image: null, is_public: false, posts_count: 31 },
];

const GRADIENT_BG = [
  "from-purple-900/40 to-blue-900/40",
  "from-blue-900/40 to-cyan-900/40",
  "from-green-900/40 to-teal-900/40",
  "from-orange-900/40 to-red-900/40",
  "from-pink-900/40 to-purple-900/40",
];

export function CollectionsPage() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<MockCollection[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", is_public: true });

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const newCol: MockCollection = {
      id: `c${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      cover_image: null,
      is_public: form.is_public,
      posts_count: 0,
    };
    setCollections((p) => [newCol, ...p]);
    setForm({ name: "", description: "", is_public: true });
    setShowModal(false);
  };

  const handleDelete = (id: string) => setCollections((p) => p.filter((c) => c.id !== id));

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2e2e2e] bg-[#0a0a0a]/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-[#6b6b6b]" />
          <h1 className="text-lg font-bold text-[#f5f5f5]">Collections</h1>
          <span className="text-xs text-[#6b6b6b]">{collections.length}</span>
        </div>
        <Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowModal(true)}>
          New
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        {collections.map((col, i) => (
          <div
            key={col.id}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#2e2e2e] bg-[#111111] transition-all hover:border-[#6b6b6b]"
            onClick={() => navigate(`/collections/${col.id}`)}
          >
            {/* Cover */}
            <div className={`h-24 bg-gradient-to-br ${GRADIENT_BG[i % GRADIENT_BG.length]} flex items-center justify-center`}>
              <Bookmark className="h-8 w-8 text-white/20" />
            </div>

            <div className="p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#f5f5f5] line-clamp-1">{col.name}</h3>
                <Dropdown
                  trigger={
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6b6b6b] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#1a1a1a] hover:text-[#f5f5f5]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  }
                  items={[
                    { label: "Edit", icon: <Edit2 className="h-3.5 w-3.5" />, onClick: () => {} },
                    { label: "Delete", icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => handleDelete(col.id), variant: "danger", divider: true },
                  ]}
                />
              </div>
              {col.description && (
                <p className="mb-2 text-xs text-[#6b6b6b] line-clamp-2">{col.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#3d3d3d]">{col.posts_count} posts</span>
                <div className="flex items-center gap-1 text-xs text-[#6b6b6b]">
                  {col.is_public ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  <span>{col.is_public ? "Public" : "Private"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Collection Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Collection">
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            placeholder="e.g. React Patterns"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <Textarea
            label="Description"
            placeholder="What's this collection about?"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
          />
          <label className="flex cursor-pointer items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#f5f5f5]">Public</p>
              <p className="text-xs text-[#6b6b6b]">Anyone can see this collection</p>
            </div>
            <div
              className={`relative h-5 w-9 rounded-full transition-colors ${form.is_public ? "bg-[#f5f5f5]" : "bg-[#2e2e2e]"}`}
              onClick={() => setForm((p) => ({ ...p, is_public: !p.is_public }))}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#0a0a0a] transition-all ${form.is_public ? "left-4" : "left-0.5"}`} />
            </div>
          </label>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" fullWidth onClick={handleCreate} disabled={!form.name.trim()}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
