'use client';

import { useState } from 'react';
import { Todo, COLOR_OPTIONS, ColorName } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string, newColor?: ColorName) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editColor, setEditColor] = useState<ColorName>(
    (todo.color as ColorName) || 'none'
  );

  const colorOption = todo.color ? COLOR_OPTIONS.find((c) => c.name === todo.color) : null;

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim(), editColor === 'none' ? undefined : editColor);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditColor((todo.color as ColorName) || 'none');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="todo-item animate-enter">
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          className="input-field flex-1 text-lg"
        />
        <div className="color-picker flex items-center gap-2 mr-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setEditColor(color.name as ColorName)}
              className={`color-option ${color.class} ${editColor === color.name ? 'selected' : ''}`}
            >
              {color.name !== 'none' ? (
                <svg className="w-full h-full p-1" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="8" />
                </svg>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="btn-primary p-2"
          title="保存"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          onClick={handleCancel}
          className="ml-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
          title="取消"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <div
      className={`todo-item group animate-enter ${todo.completed ? 'opacity-75' : ''}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-3">
          {colorOption && (
            <div
              className={`todo-color-tag ${colorOption.class}`}
              title={`颜色: ${colorOption.label}`}
            ></div>
          )}
          <span
            className={`flex-1 text-lg font-medium break-words ${
              todo.completed
                ? 'text-slate-400 line-through'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {todo.text}
          </span>
        </div>
        {todo.completed && (
          <div className="mt-2">
            <span className="text-xs font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full">
              已完成
            </span>
          </div>
        )}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="mr-2 p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="编辑任务"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="btn-danger opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-200"
        title="删除任务"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}