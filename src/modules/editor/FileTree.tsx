"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectFile, ProjectFolder } from "@/types";

interface FileTreeProps {
  files: ProjectFile[];
  folders: ProjectFolder[];
  activeFileId: string | null;
  onFileSelect: (file: ProjectFile) => void;
  onFileCreate?: (parentPath: string) => void;
  onFileDelete?: (fileId: string) => void;
}

interface FolderNodeProps {
  folder: ProjectFolder;
  depth: number;
  activeFileId: string | null;
  onFileSelect: (file: ProjectFile) => void;
  onFileCreate?: (parentPath: string) => void;
  onFileDelete?: (fileId: string) => void;
}

function FolderNode({ folder, depth, activeFileId, onFileSelect, onFileCreate, onFileDelete }: FolderNodeProps) {
  const [open, setOpen] = useState(folder.isOpen ?? true);

  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs text-ink-secondary transition-colors hover:bg-surface hover:text-ink-primary"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {open ? (
          <ChevronDown className="h-3 w-3 shrink-0 text-ink-tertiary" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-ink-tertiary" />
        )}
        {open ? (
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" />
        ) : (
          <Folder className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" />
        )}
        <span className="flex-1 truncate text-left">{folder.name}</span>
        {onFileCreate && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onFileCreate(folder.path);
            }}
            className="opacity-0 group-hover:opacity-100 ml-auto text-ink-tertiary hover:text-ink-primary"
          >
            <Plus className="h-3 w-3" />
          </span>
        )}
      </button>

      {open && (
        <div>
          {folder.children.map((child) =>
            "children" in child ? (
              <FolderNode
                key={child.id}
                folder={child as ProjectFolder}
                depth={depth + 1}
                activeFileId={activeFileId}
                onFileSelect={onFileSelect}
                onFileCreate={onFileCreate}
                onFileDelete={onFileDelete}
              />
            ) : (
              <FileNode
                key={child.id}
                file={child as ProjectFile}
                depth={depth + 1}
                isActive={activeFileId === child.id}
                onSelect={onFileSelect}
                onDelete={onFileDelete}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

interface FileNodeProps {
  file: ProjectFile;
  depth: number;
  isActive: boolean;
  onSelect: (file: ProjectFile) => void;
  onDelete?: (fileId: string) => void;
}

function FileNode({ file, depth, isActive, onSelect, onDelete }: FileNodeProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors cursor-pointer",
        isActive
          ? "bg-surface text-ink-primary"
          : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
      )}
      style={{ paddingLeft: `${8 + depth * 12}px` }}
      onClick={() => onSelect(file)}
    >
      <span className="w-3 shrink-0" />
      <File className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" />
      <span className="flex-1 truncate font-mono">{file.name}</span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file.id);
          }}
          className="hidden group-hover:block text-ink-disabled hover:text-semantic-error"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function FileTree({
  files,
  folders,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
}: FileTreeProps) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      {folders.map((folder) => (
        <FolderNode
          key={folder.id}
          folder={folder}
          depth={0}
          activeFileId={activeFileId}
          onFileSelect={onFileSelect}
          onFileCreate={onFileCreate}
          onFileDelete={onFileDelete}
        />
      ))}
      {files.map((file) => (
        <FileNode
          key={file.id}
          file={file}
          depth={0}
          isActive={activeFileId === file.id}
          onSelect={onFileSelect}
          onDelete={onFileDelete}
        />
      ))}
    </div>
  );
}
