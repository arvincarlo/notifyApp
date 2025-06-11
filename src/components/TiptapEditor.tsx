// TiptapEditor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import TextStyle from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  Undo,
  Redo,
  Code,
  MoreVertical,
  Strikethrough,
  List,
  ListOrdered,
} from "lucide-react";
import FontFamily from "@tiptap/extension-font-family";
import { Toggle } from "@/components/ui/toggle";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MenuBar = ({
  editor,
  showSource,
  setShowSource,
}: {
  editor: any;
  showSource: boolean;
  setShowSource: (show: boolean) => void;
}) => {
  if (!editor) {
    return null;
  }

  const headings = [
    { label: "Normal", value: "0" },
    { label: "H1", value: "1" },
    { label: "H2", value: "2" },
    { label: "H3", value: "3" },
  ];

  const getCurrentHeadingLevel = () => {
    for (let i = 1; i <= 3; i++) {
      if (editor.isActive("heading", { level: i })) {
        return i.toString();
      }
    }
    return "0";
  };

  const clearFormat = () => {
    const { from, to } = editor.state.selection;

    editor.state.doc.nodesBetween(
      from,
      to,
      (node: { type: { name: string } }) => {
        if (
          node.type.name === "listItem" ||
          node.type.name === "bulletList" ||
          node.type.name === "orderedList"
        ) {
          editor.chain().focus().liftListItem("listItem").run();
        }
      }
    );

    editor.chain().focus().clearNodes().unsetAllMarks().setParagraph().run();
  };

  return (
    <div className="border-b p-1 flex items-center gap-1 flex-nowrap overflow-x-auto">
      <div className="flex items-center gap-1 min-w-[600px]">
        {/* <Toggle
          size="sm"
          pressed={editor.isActive("undo")}
          onPressedChange={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("redo")}
          onPressedChange={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Toggle> */}

        <div className="w-[1px] bg-gray-200 mx-1" />

        <Toggle
          size="sm"
          pressed={showSource}
          onPressedChange={() => setShowSource(!showSource)}
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <div className="w-[1px] bg-gray-200 mx-1" />

        <Select
          value={getCurrentHeadingLevel()}
          onValueChange={(value) => {
            if (value === "0") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .setHeading({ level: parseInt(value) })
                .run();
            }
          }}
        >
          <SelectTrigger className="h-8 w-[100px]">
            <SelectValue placeholder="Heading" />
          </SelectTrigger>
          <SelectContent>
            {headings.map((heading) => (
              <SelectItem key={heading.value} value={heading.value}>
                {heading.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-[1px] bg-gray-200 mx-1" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Toggle size="sm">
              <MoreVertical className="h-4 w-4" />
            </Toggle>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={clearFormat}>
              Clear Format
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().clearContent().run()}
            >
              Clear Content
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [charCount, setCharCount] = useState(0);
  const [showSource, setShowSource] = useState(false);
  const [sourceContent, setSourceContent] = useState(content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      CharacterCount.configure({
        limit: 3000,
      }),
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      setSourceContent(html);
      setCharCount(editor.getText().length);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] px-3 py-2",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
      setSourceContent(content || "");
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      setCharCount(editor.getText().length);
    }
  }, [editor]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setSourceContent(newContent);
    onChange(newContent);
    if (editor) {
      editor.commands.setContent(newContent);
    }
  };
  const editorStyles = `
  .source-preview h1,
  .ProseMirror h1 {
    font-size: 2.5em !important;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  .source-preview h2,
  .ProseMirror h2 {
    font-size: 2em !important;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  .source-preview h3,
  .ProseMirror h3 {
    font-size: 1.5em !important;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  .preview-content h1 {
    font-size: 2.5em !important;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  .preview-content h2 {
    font-size: 2em !important;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  
  .preview-content h3 {
    font-size: 1.5em !important;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
  .source-preview ul,
  .ProseMirror ul,
  .ProseMirror ol {
    list-style-position: outside !important;
    padding-left: 0.5em !important;
    margin: 0.5em 0 !important;
    list-style-type: disc !important;
  }

  .source-preview ol,
  .ProseMirror ol {
    list-style-type: decimal !important;
    counter-reset: list-counter;
  }

  .ProseMirror ol li {
    display: flex !important;
    margin: 0 !important;
  }

  .ProseMirror ol li::before {
    content: counter(list-counter) ". ";
    counter-increment: list-counter;
    margin-right: 0.5em;
    min-width: 1.2em;
  }

  .preview-content ul,
  .preview-content ol {
    list-style-position: outside !important;
    padding-left: 0.5em !important;
    margin: 0.5em 0 !important;
    list-style-type: disc !important;
  }

  .preview-content ol {
    list-style-type: decimal !important;
    counter-reset: list-counter;
  }

  .preview-content ol li {
    display: flex !important;
    margin: 0 !important;
  }

  .preview-content ol li::before {
    content: counter(list-counter) ". ";
    counter-increment: list-counter;
    margin-right: 0.5em;
    min-width: 1.2em;
  }

  `;
  return (
    <>
      <style>{editorStyles}</style>
      <div className="border rounded-md">
        <MenuBar
          editor={editor}
          showSource={showSource}
          setShowSource={setShowSource}
        />
        <div className="overflow-x-auto">
          {showSource ? (
            <div className="flex">
              <div className="w-1/2 border-r">
                <textarea
                  ref={textareaRef}
                  className="w-full min-h-[200px] p-3 font-mono text-sm focus:outline-none"
                  value={sourceContent}
                  onChange={handleSourceChange}
                />
              </div>
              <div className="w-1/2 min-h-[200px] p-3">
                <div
                  className="source-preview prose prose-sm sm:prose-base"
                  dangerouslySetInnerHTML={{ __html: sourceContent }}
                />
              </div>
            </div>
          ) : (
            <div className="min-w-[600px]">
              <EditorContent editor={editor} />
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 px-3 py-1 border-t">
          {charCount} / 3000
        </div>
      </div>
    </>
  );
}
