"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough, RotateCcw, Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  initialContent?: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
};

export function RichTextEditor({ initialContent = "", onChange, readOnly = false }: Props) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const kopyala = () => {
    if (editor) {
      const text = editor.getText();
      navigator.clipboard.writeText(text);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    }
  };

  return (
    <div className="rounded-lg border border-cizgi bg-white">
      {!readOnly && (
        <div className="flex flex-wrap gap-1 border-b border-cizgi bg-zemin p-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            aria-pressed={editor.isActive("bold")}
            className={`flex h-8 w-8 items-center justify-center rounded text-sm transition
              ${editor.isActive("bold") ? "bg-lacivert text-white" : "hover:bg-white"}`}
            title="Kalın (Ctrl+B)"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            aria-pressed={editor.isActive("italic")}
            className={`flex h-8 w-8 items-center justify-center rounded text-sm transition
              ${editor.isActive("italic") ? "bg-lacivert text-white" : "hover:bg-white"}`}
            title="İtalik (Ctrl+I)"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            aria-pressed={editor.isActive("strike")}
            className={`flex h-8 w-8 items-center justify-center rounded text-sm transition
              ${editor.isActive("strike") ? "bg-lacivert text-white" : "hover:bg-white"}`}
            title="Üzeri Çizili"
          >
            <Strikethrough size={16} />
          </button>
          <div className="w-px bg-cizgi" />
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().run()}
            className="flex h-8 w-8 items-center justify-center rounded text-sm hover:bg-white"
            title="Biçimlendirmeyi Kaldır"
          >
            <RotateCcw size={16} />
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={kopyala}
            className="flex h-8 items-center gap-1 rounded px-2 text-sm hover:bg-white"
          >
            {kopyalandi ? (
              <>
                <Check size={14} className="text-emerald-600" /> Kopyalandı
              </>
            ) : (
              <>
                <Copy size={14} /> Kopyala
              </>
            )}
          </button>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 font-belge text-[13px] leading-relaxed focus:outline-none
          prose-p:m-0 prose-p:leading-relaxed prose-headings:text-lg prose-headings:font-bold prose-hr:border-cizgi"
      />
    </div>
  );
}
