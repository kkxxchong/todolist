import { render, screen } from '@testing-library/react';
import TodoList from '@/components/TodoList';
import { Todo } from '@/types/todo';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      text: 'First task',
      completed: false,
      createdAt: new Date(),
      color: 'blue',
    },
    {
      id: 2,
      text: 'Second task',
      completed: true,
      createdAt: new Date(),
      color: 'green',
    },
    {
      id: 3,
      text: 'Third task',
      completed: false,
      createdAt: new Date(),
      color: 'red',
    },
  ];

  const mockToggle = jest.fn();
  const mockDelete = jest.fn();

  it('renders empty state when no todos', () => {
    render(
      <TodoList todos={[]} onToggle={mockToggle} onDelete={mockDelete} />
    );

    expect(screen.getByText('暂无任务')).toBeInTheDocument();
    expect(screen.getByText('添加一个任务，开始高效工作吧！')).toBeInTheDocument();
  });

  it('renders all todo items', () => {
    render(
      <TodoList todos={mockTodos} onToggle={mockToggle} onDelete={mockDelete} />
    );

    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
  });

  it('renders correct number of todo items', () => {
    render(
      <TodoList todos={mockTodos} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const todoItems = screen.getAllByRole('checkbox');
    expect(todoItems).toHaveLength(3);
  });

  it('marks completed todos with line-through class', () => {
    render(
      <TodoList todos={mockTodos} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const secondTask = screen.getByText('Second task');
    expect(secondTask.className).toContain('line-through');
  });

  it('shows completed badge for completed todos', () => {
    render(
      <TodoList todos={mockTodos} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const completedBadges = screen.getAllByText('已完成');
    expect(completedBadges).toHaveLength(1);
  });

  it('renders color tags for todos with colors', () => {
    render(
      <TodoList todos={mockTodos} onToggle={mockToggle} onDelete={mockDelete} />
    );

    // Check that color tags are rendered (they have specific classes)
    const colorTags = document.querySelectorAll('.todo-color-tag');
    // Only todos with defined color should have tags (mockTodos all have colors)
    expect(colorTags.length).toBe(3);
  });

  it('does not render color tag for todo without color', () => {
    const todosWithoutColor: Todo[] = [
      {
        id: 1,
        text: 'No color task',
        completed: false,
        createdAt: new Date(),
      },
    ];

    render(
      <TodoList todos={todosWithoutColor} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const colorTags = document.querySelectorAll('.todo-color-tag');
    expect(colorTags.length).toBe(0);
  });

  it('shows delete buttons for each todo item', () => {
    render(
      <TodoList todos={mockTodos} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const deleteButtons = screen.getAllByTitle('删除任务');
    expect(deleteButtons).toHaveLength(3);
  });
});