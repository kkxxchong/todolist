import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  const mockEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders todo text correctly', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('shows checkbox with correct checked state', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('calls onToggle when checkbox is clicked', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledWith(1);
  });

  it('shows delete button', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    const deleteButton = screen.getByTitle('删除任务');
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    const deleteButton = screen.getByTitle('删除任务');
    fireEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('shows completed badge when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };

    render(
      <TodoItem todo={completedTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('applies line-through style for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };

    render(
      <TodoItem todo={completedTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    const textElement = screen.getByText('Test task');
    expect(textElement.className).toContain('line-through');
  });

  // === Edit Functionality Tests ===

  it('shows edit button', () => {
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    const editButton = screen.getByTitle('编辑任务');
    expect(editButton).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Should show input with current text
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Test task');

    // Should show color picker
    const colorPicker = document.querySelector('.color-picker');
    expect(colorPicker).toBeInTheDocument();

    // Should show save and cancel buttons
    expect(screen.getByTitle('保存')).toBeInTheDocument();
    expect(screen.getByText('取消')).toBeInTheDocument();
  });

  it('calls onEdit with new text and same color when saved', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Change text
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated task text');

    // Click save button
    const saveButton = screen.getByTitle('保存');
    await user.click(saveButton);

    expect(mockEdit).toHaveBeenCalledTimes(1);
    expect(mockEdit).toHaveBeenCalledWith(1, 'Updated task text', 'blue');
  });

  it('calls onEdit with new color when color is changed', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Get all color buttons (9 total: none + 8 colors)
    const colorPicker = document.querySelector('.color-picker')!;
    const colorButtons = colorPicker.querySelectorAll('button');

    // Index 1 is red (after "none" at index 0)
    const redColorButton = colorButtons[1] as HTMLButtonElement;
    await user.click(redColorButton);

    // Click save
    const saveButton = screen.getByTitle('保存');
    await user.click(saveButton);

    expect(mockEdit).toHaveBeenCalledWith(1, 'Test task', 'red');
  });

  it('saves on Enter key press', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Change text and press Enter
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Enter saved text{Enter}');

    expect(mockEdit).toHaveBeenCalledWith(1, 'Enter saved text', 'blue');
  });

  it('cancels edit on Escape key press', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Change text
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Cancelled edit');

    // Press Escape
    await user.keyboard('{Escape}');

    // Should not call onEdit
    expect(mockEdit).not.toHaveBeenCalled();

    // Should show original text
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('cancels edit when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Change text
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Cancelled via button');

    // Click cancel button using fireEvent to avoid blur interference
    const cancelButton = screen.getByText('取消');
    fireEvent.click(cancelButton);

    expect(mockEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('does not save empty text', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Clear text
    const input = screen.getByRole('textbox');
    await user.clear(input);

    // Press Enter (should not save)
    await user.keyboard('{Enter}');

    expect(mockEdit).not.toHaveBeenCalled();

    // Should still be in edit mode with empty input
    expect(input).toHaveValue('');
    expect(screen.getByTitle('保存')).toBeInTheDocument();
  });

  it('saves on blur when input has valid text', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Change text
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Saved on blur');

    // Trigger blur by clicking outside
    fireEvent.blur(input);

    expect(mockEdit).toHaveBeenCalledWith(1, 'Saved on blur', 'blue');
  });

  it('preserves original color when not changed during edit', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Click save without changing color
    const saveButton = screen.getByTitle('保存');
    await user.click(saveButton);

    expect(mockEdit).toHaveBeenCalledWith(1, 'Test task', 'blue');
  });

  it('handles todo without color property', async () => {
    const todoWithoutColor: Todo = {
      id: 2,
      text: 'No color task',
      completed: false,
      createdAt: new Date(),
    };

    const user = userEvent.setup();
    render(
      <TodoItem todo={todoWithoutColor} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Should have "none" color selected by default
    const colorPicker = document.querySelector('.color-picker');
    expect(colorPicker).toBeInTheDocument();

    // Save with no color change (should pass undefined)
    const saveButton = screen.getByTitle('保存');
    await user.click(saveButton);

    expect(mockEdit).toHaveBeenCalledWith(2, 'No color task', undefined);
  });

  it('allows changing color from colored to none', async () => {
    const user = userEvent.setup();
    render(
      <TodoItem todo={mockTodo} onToggle={mockToggle} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Enter edit mode
    const editButton = screen.getByTitle('编辑任务');
    await user.click(editButton);

    // Get all color buttons
    const colorPicker = document.querySelector('.color-picker')!;
    const colorButtons = colorPicker.querySelectorAll('button');

    // Index 0 is "none" button
    const noneColorButton = colorButtons[0] as HTMLButtonElement;
    await user.click(noneColorButton);

    // Save
    const saveButton = screen.getByTitle('保存');
    await user.click(saveButton);

    expect(mockEdit).toHaveBeenCalledWith(1, 'Test task', undefined);
  });
});