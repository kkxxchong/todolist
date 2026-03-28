'use client';

import { Todo } from '@/types/todo';
import { COLOR_OPTIONS } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const colorOption = todo.color ? COLOR_OPTIONS.find((c) => c.name === todo.color) : null;

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