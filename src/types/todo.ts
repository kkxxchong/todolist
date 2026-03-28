export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  color?: string; // 颜色标签: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink'
}

export const COLOR_OPTIONS = [
  { name: 'none', label: '无', class: '' },
  { name: 'red', label: '🔴', class: 'bg-red-500' },
  { name: 'orange', label: '🟠', class: 'bg-orange-500' },
  { name: 'yellow', label: '🟡', class: 'bg-yellow-500' },
  { name: 'green', label: '🟢', class: 'bg-green-500' },
  { name: 'blue', label: '🔵', class: 'bg-blue-500' },
  { name: 'purple', label: '🟣', class: 'bg-purple-500' },
  { name: 'pink', label: '🩷', class: 'bg-pink-500' },
] as const;

export type ColorName = (typeof COLOR_OPTIONS)[number]['name'];