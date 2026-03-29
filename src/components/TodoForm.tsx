'use client';

import { useState } from 'react';
import { Todo, COLOR_OPTIONS, ColorName } from '@/types/todo';

interface TodoFormProps {
  onAdd: (text: string, color?: ColorName) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isFocused?: boolean;
  onFocusChange?: (focused: boolean) => void;
}

export default function TodoForm({ onAdd, inputRef, isFocused = false, onFocusChange }: TodoFormProps) {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState<ColorName>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), selectedColor === 'none' ? undefined : selectedColor);
      setText('');
      onFocusChange?.(false);
      setSelectedColor('none');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className={`flex gap-3 mb-4 transition-all duration-200 ${isFocused ? 'scale-[1.02]' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          placeholder="添加新任务... 按 Enter 提交"
          className="input-field flex-1 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          autoFocus
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-indigo-500/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>添加</span>
        </button>
      </div>

      {/* 颜色选择器 */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          颜色标签:
        </span>
        <div className="color-picker flex-1">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name as ColorName)}
              className={`color-option ${color.class} ${selectedColor === color.name ? 'selected' : ''}`}
              title={color.label}
              aria-label={`选择颜色 ${color.label}`}
            >
              {color.name !== 'none' ? (
                <svg className="w-full h-full p-1" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        {selectedColor !== 'none' && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {COLOR_OPTIONS.find((c) => c.name === selectedColor)?.label}
          </span>
        )}
      </div>
    </form>
  );
}