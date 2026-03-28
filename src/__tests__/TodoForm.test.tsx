import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '@/components/TodoForm';

describe('TodoForm', () => {
  const mockAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button', () => {
    render(<TodoForm onAdd={mockAdd} />);

    expect(screen.getByPlaceholderText('添加新任务...按 Enter 提交')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /添加/i })).toBeInTheDocument();
  });

  it('renders color picker with 8 color options', () => {
    render(<TodoForm onAdd={mockAdd} />);

    const colorButtons = screen.getAllByRole('button').filter(btn =>
      btn.getAttribute('aria-label')?.startsWith('选择颜色')
    );
    expect(colorButtons).toHaveLength(8);
  });

  it('submit button is disabled when input is empty', () => {
    render(<TodoForm onAdd={mockAdd} />);

    const submitButton = screen.getByRole('button', { name: /添加/i });
    expect(submitButton).toBeDisabled();
  });

  it('submit button is enabled when input has text', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockAdd} />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'New task');

    const submitButton = screen.getByRole('button', { name: /添加/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onAdd with text when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockAdd} />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'My new task');

    const submitButton = screen.getByRole('button', { name: /添加/i });
    await user.click(submitButton);

    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith('My new task', undefined);
  });

  it('calls onAdd with selected color when form is submitted', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockAdd} />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Colored task');

    // Select red color (title is just the emoji)
    const redColorButton = screen.getByTitle('🔴');
    await user.click(redColorButton);

    const submitButton = screen.getByRole('button', { name: /添加/i });
    await user.click(submitButton);

    expect(mockAdd).toHaveBeenCalledWith('Colored task', 'red');
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockAdd} />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Task to clear');

    const submitButton = screen.getByRole('button', { name: /添加/i });
    await user.click(submitButton);

    expect(input).toHaveValue('');
  });

  it('submits on Enter key press', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockAdd} />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Enter task{Enter}');

    expect(mockAdd).toHaveBeenCalledWith('Enter task', undefined);
  });

  it('shows selected color label when color is picked', async () => {
    const user = userEvent.setup();
    render(<TodoForm onAdd={mockAdd} />);

    const redColorButton = screen.getByTitle('🔴');
    await user.click(redColorButton);

    expect(screen.getByText('🔴')).toBeInTheDocument();
  });
});