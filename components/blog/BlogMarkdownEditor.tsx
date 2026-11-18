'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Undo2,
  Redo2,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Link2,
  Minus,
  ImagePlus,
  PenLine,
  Eye,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { compressImageFile } from '@/lib/image-compression';
import { uploadToCloudinary } from '@/app/actions/upload';
import { parseBlogBody, renderFormattedInline } from '@/lib/blog-parser';
import { cn } from '@/lib/utils';

type BlogMarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  minHeight?: string;
};

interface FormattingOptions {
  prefix: string;
  suffix?: string;
  defaultText?: string;
  isBlock?: boolean;
  isDivider?: boolean;
  isLink?: boolean;
}

export function BlogMarkdownEditor({
  value,
  onChange,
  error,
  placeholder = 'Write the full blog article here...',
  minHeight = '320px',
}: BlogMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Undo / Redo history state
  const [history, setHistory] = useState<string[]>([value || '']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const historyRef = useRef<string[]>([value || '']);
  const historyIndexRef = useRef<number>(0);
  const isUndoRedoActionRef = useRef<boolean>(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial history
  useEffect(() => {
    if (historyRef.current.length === 1 && historyRef.current[0] === '' && value) {
      historyRef.current = [value];
      historyIndexRef.current = 0;
      setHistory([value]);
      setHistoryIndex(0);
    }
  }, [value]);

  /**
   * Pushes a new snapshot onto the Undo/Redo stack.
   */
  const recordHistory = useCallback((newVal: string) => {
    const currentSlice = historyRef.current.slice(0, historyIndexRef.current + 1);
    if (currentSlice[currentSlice.length - 1] === newVal) return;

    const nextHistory = [...currentSlice, newVal];
    if (nextHistory.length > 60) nextHistory.shift();

    historyRef.current = nextHistory;
    const newIdx = nextHistory.length - 1;
    historyIndexRef.current = newIdx;
    setHistory(nextHistory);
    setHistoryIndex(newIdx);
  }, []);

  /**
   * Undo.
   */
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      const targetIndex = historyIndexRef.current - 1;
      const targetValue = historyRef.current[targetIndex];

      isUndoRedoActionRef.current = true;
      historyIndexRef.current = targetIndex;
      setHistoryIndex(targetIndex);
      onChange(targetValue);

      setTimeout(() => {
        textareaRef.current?.focus();
        isUndoRedoActionRef.current = false;
      }, 0);
    }
  }, [onChange]);

  /**
   * Redo.
   */
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      const targetIndex = historyIndexRef.current + 1;
      const targetValue = historyRef.current[targetIndex];

      isUndoRedoActionRef.current = true;
      historyIndexRef.current = targetIndex;
      setHistoryIndex(targetIndex);
      onChange(targetValue);

      setTimeout(() => {
        textareaRef.current?.focus();
        isUndoRedoActionRef.current = false;
      }, 0);
    }
  }, [onChange]);

  /**
   * Handles keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Y and Ctrl+Shift+Z (Redo).
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        handleRedo();
      } else {
        handleUndo();
      }
      return;
    }

    if (modKey && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      handleRedo();
      return;
    }
  };

  /**
   * Handles regular typing
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    onChange(newVal);

    if (isUndoRedoActionRef.current) return;

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      recordHistory(newVal);
    }, 350);
  };

  const insertFormatting = useCallback(
    ({
      prefix,
      suffix = '',
      defaultText = '',
      isBlock = false,
      isDivider = false,
      isLink = false,
    }: FormattingOptions) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;
      const currentValue = textarea.value;
      const selectedText = currentValue.substring(start, end);

      let prepended = '';
      let textToInsert = selectedText || defaultText;
      let targetStart = start;
      let targetEnd = end;

      if (isDivider) {
        const needsNewlineBefore = start > 0 && currentValue[start - 1] !== '\n';
        const needsDoubleNewlineBefore =
          start > 1 && currentValue[start - 1] === '\n' && currentValue[start - 2] !== '\n';

        if (needsDoubleNewlineBefore) prepended = '\n';
        else if (needsNewlineBefore) prepended = '\n\n';

        const insertion = `${prepended}---\n\n`;
        const newValue = currentValue.substring(0, start) + insertion + currentValue.substring(end);

        onChange(newValue);
        recordHistory(newValue);

        setTimeout(() => {
          textarea.focus();
          const nextCursor = start + insertion.length;
          textarea.setSelectionRange(nextCursor, nextCursor);
        }, 0);
        return;
      }

      if (isLink) {
        let insertion = '';
        if (selectedText) {
          insertion = `[${selectedText}](https://example.com)`;
          targetStart = start + 1 + selectedText.length + 2;
          targetEnd = targetStart + 19; 
        } else {
          insertion = `[Link text](https://example.com)`;
          targetStart = start + 1;
          targetEnd = targetStart + 9;
        }

        const newValue = currentValue.substring(0, start) + insertion + currentValue.substring(end);
        onChange(newValue);
        recordHistory(newValue);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(targetStart, targetEnd);
        }, 0);
        return;
      }

      // Block formatting (H2, H3, quotes, lists, attributions)
      if (isBlock) {
        const needsNewlineBefore = start > 0 && currentValue[start - 1] !== '\n';
        const needsDoubleNewlineBefore =
          start > 1 && currentValue[start - 1] === '\n' && currentValue[start - 2] !== '\n';

        if (needsDoubleNewlineBefore) prepended = '\n';
        else if (needsNewlineBefore) prepended = '\n\n';

        const insertion = `${prepended}${prefix}${textToInsert}${suffix}`;
        const newValue = currentValue.substring(0, start) + insertion + currentValue.substring(end);

        onChange(newValue);
        recordHistory(newValue);

        targetStart = start + prepended.length + prefix.length;
        targetEnd = targetStart + textToInsert.length;

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(targetStart, targetEnd);
        }, 0);
        return;
      }

      const insertion = `${prefix}${textToInsert}${suffix}`;
      const newValue = currentValue.substring(0, start) + insertion + currentValue.substring(end);

      onChange(newValue);
      recordHistory(newValue);

      targetStart = start + prefix.length;
      targetEnd = targetStart + textToInsert.length;

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(targetStart, targetEnd);
      }, 0);
    },
    [onChange, recordHistory]
  );

  const handleProcessImageFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const base64 = await compressImageFile(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.85,
      });

      const secureUrl = await uploadToCloudinary(base64, 'ules_blog');

      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      const caption = cleanName || 'Image description';

      const textarea = textareaRef.current;
      const start = textarea?.selectionStart ?? value.length;
      const end = textarea?.selectionEnd ?? value.length;

      const needsNewlineBefore = start > 0 && value[start - 1] !== '\n';
      const prepended = needsNewlineBefore ? '\n\n' : '';
      const insertion = `${prepended}![${caption}](${secureUrl})\n\n`;

      const newValue = value.substring(0, start) + insertion + value.substring(end);
      onChange(newValue);
      recordHistory(newValue);

      setTimeout(() => {
        if (!textarea) return;
        textarea.focus();
        const cursorPosition = start + insertion.length;
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    } catch (err: any) {
      console.error('Failed to upload inline blog image:', err);
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessImageFile(file);
  };

  /**
   * Drag-and-drop image support onto the textarea.
   */
  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        handleProcessImageFile(file);
      }
    }
  };

  /**
   * Clipboard paste support (Ctrl+V) for images.
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith('image/')) {
        e.preventDefault();
        handleProcessImageFile(file);
      }
    }
  };

  const previewBlocks = parseBlogBody(value);
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Editor */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50/80 px-3 py-2">
        {/* Formatting Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-1 text-gray-700">
          {/* Undo */}
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={handleUndo}
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            <Undo2 className="size-3.5" />
          </button>

          {/* Redo */}
          <button
            type="button"
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
            disabled={!canRedo}
            onClick={handleRedo}
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            <Redo2 className="size-3.5" />
          </button>

          <span className="mx-1 h-4 w-px bg-gray-300" />

          {/* H2 Heading */}
          <button
            type="button"
            title="Section Heading (##)"
            onClick={() =>
              insertFormatting({
                prefix: '## ',
                defaultText: 'Section Heading',
                isBlock: true,
              })
            }
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Heading2 className="size-3.5 text-[#170A51]" />
            <span className="hidden sm:inline">H2</span>
          </button>

          {/* H3 Subheading */}
          <button
            type="button"
            title="Subsection Heading (###)"
            onClick={() =>
              insertFormatting({
                prefix: '### ',
                defaultText: 'Subsection Heading',
                isBlock: true,
              })
            }
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Heading3 className="size-3.5 text-[#170A51]" />
            <span className="hidden sm:inline">H3</span>
          </button>

          <span className="mx-1 h-4 w-px bg-gray-300" />

          {/* Bold */}
          <button
            type="button"
            title="Bold Text (**bold**)"
            onClick={() =>
              insertFormatting({
                prefix: '**',
                suffix: '**',
                defaultText: 'bold text',
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Bold className="size-3.5" />
          </button>

          {/* Italic */}
          <button
            type="button"
            title="Italic Text (*italic*)"
            onClick={() =>
              insertFormatting({
                prefix: '*',
                suffix: '*',
                defaultText: 'italic text',
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Italic className="size-3.5" />
          </button>

          <span className="mx-1 h-4 w-px bg-gray-300" />

          {/* Blockquote */}
          <button
            type="button"
            title="Quote (> quote)"
            onClick={() =>
              insertFormatting({
                prefix: '> "',
                suffix: '"',
                defaultText: 'Memorable quote or thought',
                isBlock: true,
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Quote className="size-3.5" />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            title="Bullet List (* item)"
            onClick={() =>
              insertFormatting({
                prefix: '* ',
                defaultText: 'List item',
                isBlock: true,
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <List className="size-3.5" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            title="Numbered List (1. item)"
            onClick={() =>
              insertFormatting({
                prefix: '1. ',
                defaultText: 'Numbered item',
                isBlock: true,
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ListOrdered className="size-3.5" />
          </button>

          {/* Attribution */}
          <button
            type="button"
            title="Author Attribution (-- Name)"
            onClick={() =>
              insertFormatting({
                prefix: '-- ',
                defaultText: 'Author or Source Name',
                isBlock: true,
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <UserCheck className="size-3.5" />
          </button>

          {/* Link */}
          <button
            type="button"
            title="Hyperlink ([title](url))"
            onClick={() =>
              insertFormatting({
                prefix: '[',
                suffix: '](https://example.com)',
                defaultText: 'Link text',
                isLink: true,
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Link2 className="size-3.5" />
          </button>

          {/* Horizontal Divider */}
          <button
            type="button"
            title="Horizontal Divider (---)"
            onClick={() =>
              insertFormatting({
                prefix: '',
                isDivider: true,
              })
            }
            className="rounded-md p-1.5 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <Minus className="size-3.5" />
          </button>

          <span className="mx-1 h-4 w-px bg-gray-300" />

          {/* Insert Image */}
          <button
            type="button"
            disabled={isUploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md p-1.5 bg-[#C85B15]/10 text-[#C85B15] hover:bg-[#C85B15]/20 hover:text-[#C85B15] disabled:opacity-50 transition-colors cursor-pointer"
            title={isUploadingImage ? 'Uploading image...' : 'Upload & insert image between paragraphs'}
          >
            {isUploadingImage ? (
              <Loader2 className="size-3.5 animate-spin text-[#C85B15]" />
            ) : (
              <ImagePlus className="size-3.5 text-[#C85B15]" />
            )}
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
              activeTab === 'write'
                ? 'bg-[#170A51] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <PenLine className="size-3" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer',
              activeTab === 'preview'
                ? 'bg-[#170A51] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <Eye className="size-3" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 border-b border-red-200 px-3 py-1.5 text-xs text-red-700 flex items-center justify-between">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-500 hover:text-red-800 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Body */}
      {activeTab === 'write' ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onPaste={handlePaste}
            placeholder={placeholder}
            style={{ minHeight }}
            className={cn(
              'w-full p-4 font-sans text-sm leading-relaxed text-gray-900 outline-none resize-y placeholder:text-gray-400 bg-white transition-colors',
              isDraggingOver && 'bg-[#C85B15]/5 ring-2 ring-inset ring-[#C85B15]'
            )}
          />

          {isDraggingOver && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/90 text-sm font-semibold text-[#C85B15] backdrop-blur-2xs">
              Drop image here to insert into article
            </div>
          )}
        </div>
      ) : (
        /* LIVE PREVIEW MODE */
        <div
          style={{ minHeight }}
          className="p-6 bg-slate-50/60 overflow-y-auto max-h-[460px] prose prose-slate max-w-none text-left"
        >
          {previewBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
              <PenLine className="size-8 text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-600">Nothing to preview yet</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Switch back to the &quot;Write&quot; tab and write your article content or insert images.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {previewBlocks.map((block, index) => {
                if (block.kind === 'image') {
                  return (
                    <figure key={index} className="my-6 flex flex-col items-center">
                      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs max-w-xl w-full flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={block.src}
                          alt={block.alt || 'Blog illustration'}
                          className="w-full h-auto max-h-[420px] object-contain rounded-2xl"
                        />
                      </div>
                      {block.caption && (
                        <figcaption className="mt-2 text-center text-xs text-slate-500 italic font-sans">
                          {renderFormattedInline(block.caption)}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.kind === 'divider') {
                  return (
                    <hr
                      key={index}
                      className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
                    />
                  );
                }

                if (block.kind === 'heading') {
                  if (block.level === 3) {
                    return (
                      <h3 key={index} className="text-[#170A51] mt-6 mb-2 text-lg font-bold tracking-tight">
                        {renderFormattedInline(block.text)}
                      </h3>
                    );
                  }
                  return (
                    <h2
                      key={index}
                      className="text-[#170A51] mt-7 mb-2 text-xl font-bold tracking-tight pb-1.5 border-b border-slate-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-5 bg-[#C85B15] rounded-full inline-block shrink-0" />
                      <span>{renderFormattedInline(block.text)}</span>
                    </h2>
                  );
                }

                if (block.kind === 'attribution') {
                  return (
                    <div
                      key={index}
                      className="my-3 rounded-lg bg-slate-100 border-l-3 border-[#C85B15] p-3 text-xs text-slate-700 italic font-medium"
                    >
                      {renderFormattedInline(block.text)}
                    </div>
                  );
                }

                if (block.kind === 'quote') {
                  return (
                    <blockquote
                      key={index}
                      className="my-5 rounded-xl border-l-4 border-[#C85B15] bg-[#C85B15]/5 px-4 py-3 italic text-slate-800 text-sm leading-relaxed"
                    >
                      &ldquo;{renderFormattedInline(block.text)}&rdquo;
                    </blockquote>
                  );
                }

                if (block.kind === 'list') {
                  return (
                    <ul key={index} className="my-3 list-disc space-y-1.5 pl-5 text-slate-700 text-sm">
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{renderFormattedInline(item)}</li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={index} className="text-sm text-slate-800 leading-relaxed font-sans">
                    {renderFormattedInline(block.text)}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-3 py-1.5 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <span>Markdown supported</span>
          <span className="text-gray-300">•</span>
          <span>Undo: <kbd className="px-1 py-0.5 rounded bg-gray-100 font-mono text-[10px]">Ctrl+Z</kbd></span>
          <span>Redo: <kbd className="px-1 py-0.5 rounded bg-gray-100 font-mono text-[10px]">Ctrl+Y</kbd></span>
        </div>
        <span className="font-mono text-[10px] text-gray-400">
          {value.trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {error && <p className="p-2 text-xs text-red-500 bg-red-50 border-t border-red-100">{error}</p>}
    </div>
  );
}

export default BlogMarkdownEditor;
