'use client';

import { Todo } from '@/types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16 animate-enter">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          暂无任务
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          添加一个任务，开始高效工作吧！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-enter"
        >
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}