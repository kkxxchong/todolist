'use client';

import { useState, useEffect } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import { Todo, ColorName } from '@/types/todo';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // 从 localStorage 加载
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(
          parsed.map((t: Todo) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          }))
        );
      } catch (e) {
        console.error('Failed to parse todos', e);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, color?: ColorName) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
      color,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: number, newText: string, newColor?: ColorName) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: newText.trim(),
              color: newColor,
            }
          : todo
      )
    );
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/40 dark:to-slate-900/60 py-16 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-enter">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Todo List
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            简洁高效的任务管理工具 · 支持颜色分类
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 sm:p-10 animate-enter">
          <TodoForm onAdd={addTodo} />

          {/* Stats */}
          {totalCount > 0 && (
            <div className="mb-8">
              <div className="stats-card flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    完成进度
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {completedCount}
                    </span>
                    <span className="text-slate-400">/</span>
                    <span className="text-2xl font-semibold text-slate-600 dark:text-slate-300">
                      {totalCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}

          <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
          <p>Built with Next.js, React, TypeScript & Tailwind CSS</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            数据保存在本地浏览器中
          </p>
        </footer>
      </div>
    </main>
  );
}