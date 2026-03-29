'use client';

import { useState, useEffect, useRef } from 'react';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import { Todo, ColorName } from '@/types/todo';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);
  const [deleteTimer, setDeleteTimer] = useState<NodeJS.Timeout | null>(null);
  const [notification, setNotification] = useState<string>('');
  const [focusedInput, setFocusedInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage
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

  // Save to localStorage
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
    showNotification('任务已添加 ✅');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setDeletedTodo(todo);
    if (deleteTimer) clearTimeout(deleteTimer);

    const timer = setTimeout(() => {
      setTodos(todos.filter((t) => t.id !== id));
      setDeletedTodo(null);
      showNotification('任务已删除 🗑️');
    }, 5000);

    setDeleteTimer(timer);
    showNotification('任务已删除，可撤销 ⬅️', 3000);
  };

  const undoDelete = () => {
    if (deletedTodo) {
      setTodos([deletedTodo, ...todos]);
      if (deleteTimer) clearTimeout(deleteTimer);
      setDeletedTodo(null);
      showNotification('已撤销 ↪️');
    }
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
    showNotification('任务已更新 ✏️');
  };

  const showNotification = (msg: string, duration: number = 2000) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), duration);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          inputRef.current?.blur();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/40 dark:to-slate-900/60 py-16 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* 通知 */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-slate-800/90 dark:bg-white/90 text-white dark:text-slate-800 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{notification}</span>
            </div>
          </div>
        </div>
      )}

      {/* 撤销栏 */}
      {deletedTodo && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-slate-800/95 dark:bg-slate-700/95 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-600/50">
            <div className="flex items-center gap-4">
              <span className="flex-1">
                已删除: <span className="font-medium line-through opacity-75">{deletedTodo.text}</span>
              </span>
              <button
                onClick={undoDelete}
                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-indigo-500/50"
              >
                撤销 ↪️
              </button>
            </div>
            <div className="mt-2 h-1 bg-slate-600 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-400 animate-progress" style={{ animationDuration: '5s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-enter">
          <div className="inline-flex items-center justify-center gap-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <button
              onClick={toggleTheme}
              className="btn-icon group relative p-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:rotate-12"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                快捷键: Ctrl+N
              </span>
            </button>
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
          <TodoForm onAdd={addTodo} inputRef={inputRef} isFocused={focusedInput} onFocusChange={setFocusedInput} />

          {/* Stats */}
          {totalCount > 0 && (
            <div className="mb-8">
              <div className="stats-card flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">完成进度</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{completedCount}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-2xl font-semibold text-slate-600 dark:text-slate-300">{totalCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
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
            数据保存在本地浏览器中 · 按 Ctrl+N 快速添加任务
          </p>
        </footer>
      </div>
    </main>
  );
}