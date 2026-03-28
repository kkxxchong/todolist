import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '@/components/TodoItem';
import { Todo } from '@/types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test task',
    completed: false,
    createdAt: new Date(),
    color: 'blue',
  };

  const mockToggle = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo text correctly', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('shows checkbox with correct checked state', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledWith(1);
  });

  it('shows delete button', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const deleteButton = screen.getByTitle('删除任务');
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const deleteButton = screen.getByTitle('删除任务');
    fireEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('shows completed badge when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };

    render(
      <TodoItem todo={completedTodo} onToggle={mockToggle} onDelete={mockDelete} />
    );

    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('applies line-through style for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };

    render(
      <TodoItem todo={completedTodo} onToggle={mockToggle} onDelete={mockDelete} />
    );

    const textElement = screen.getByText('Test task');
    expect(textElement.className).toContain('line-through');
  });
});