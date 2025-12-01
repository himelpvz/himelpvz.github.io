import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icons } from './Icons';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className={`flex flex-col border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#0a0a0f] ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 overflow-x-auto">
        <ToolButton icon={<Icons.Code className="w-4 h-4" />} label="Bold" onClick={() => insertText('**', '**')} />
        <ToolButton icon={<span className="font-serif italic font-bold text-sm">I</span>} label="Italic" onClick={() => insertText('*', '*')} />
        <div className="w-px h-5 bg-gray-300 dark:bg-white/20 mx-1" />
        <ToolButton icon={<span className="font-bold text-sm">H1</span>} label="Heading 1" onClick={() => insertText('# ')} />
        <ToolButton icon={<span className="font-bold text-sm">H2</span>} label="Heading 2" onClick={() => insertText('## ')} />
        <ToolButton icon={<span className="font-bold text-sm">H3</span>} label="Heading 3" onClick={() => insertText('### ')} />
        <div className="w-px h-5 bg-gray-300 dark:bg-white/20 mx-1" />
        <ToolButton icon={<Icons.Code className="w-4 h-4" />} label="Code Block" onClick={() => insertText('```\n', '\n```')} />
        <ToolButton icon={<Icons.ExternalLink className="w-4 h-4" />} label="Link" onClick={() => insertText('[', '](url)')} />
        <ToolButton icon={<span className="text-sm">IMG</span>} label="Image" onClick={() => insertText('![alt text](', ')')} />
        
        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activeTab === 'write' ? 'bg-white dark:bg-white/20 shadow-sm text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Write
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activeTab === 'preview' ? 'bg-white dark:bg-white/20 shadow-sm text-cyan-600 dark:text-cyan-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative min-h-[400px]">
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            className="w-full h-full p-6 bg-transparent outline-none text-gray-800 dark:text-gray-200 font-mono text-sm resize-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder="Write your masterpiece here (Markdown supported)..."
          />
        ) : (
          <div className="absolute inset-0 p-6 overflow-y-auto markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-2 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors shrink-0"
    title={label}
    type="button"
  >
    {icon}
  </button>
);

export default MarkdownEditor;