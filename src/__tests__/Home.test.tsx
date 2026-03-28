import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { Todo, ColorName } from '@/types/todo';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Home (App Integration)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('renders page title and description', () => {
    render(<Home />);

    expect(screen.getByText('Todo List')).toBeInTheDocument();
    expect(
      screen.getByText('简洁高效的任务管理工具 · 支持颜色分类')
    ).toBeInTheDocument();
  });

  it('shows empty state initially', () => {
    render(<Home />);

    expect(screen.getByText('暂无任务')).toBeInTheDocument();
    expect(
      screen.getByText('添加一个任务，开始高效工作吧！')
    ).toBeInTheDocument();
  });

  it('adds a new todo via form submission', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'New integration test task');

    const submitButton = screen.getByRole('button', { name: /添加/i });
    await user.click(submitButton);

    expect(screen.getByText('New integration test task')).toBeInTheDocument();
  });

  it('adds a new todo via Enter key', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Enter submitted task{Enter}');

    expect(screen.getByText('Enter submitted task')).toBeInTheDocument();
  });

  it('displays stats when todos exist', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Task 1{Enter}');
    await user.type(input, 'Task 2{Enter}');
    await user.type(input, 'Task 3{Enter}');

    // Check stats display
    expect(screen.getByText('完成进度')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument(); // completed count
    expect(screen.getByText('3')).toBeInTheDocument(); // total count
  });

  it('toggles todo completion status', async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Add a task
    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Toggle test task{Enter}');

    // Find the checkbox and click it
    const checkbox = screen.getAllByRole('checkbox')[0];
    await user.click(checkbox);

    // Check for completed badge
    expect(screen.getByText('已完成')).toBeInTheDocument();

    // Check that the completed count shows "1" in the stats
    // The completed count is in a larger font (text-3xl)
    const completedCountElement = document.querySelector('.text-3xl.text-indigo-600');
    expect(completedCountElement).toHaveTextContent('1');
  });

  it('deletes a todo', async () => {
    const user = userEvent.setup();
    render(<Home />);

    // Add a task
    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Delete me{Enter}');

    expect(screen.getByText('Delete me')).toBeInTheDocument();

    // Hover to reveal delete button and click
    const deleteButton = screen.getByTitle('删除任务');
    await user.click(deleteButton);

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });

  it('persists todos to localStorage', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Persisted task{Enter}');

    // Check localStorage was called
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const savedData = JSON.parse(
      localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1][1]
    );
    expect(savedData).toHaveLength(1);
    expect(savedData[0].text).toBe('Persisted task');
  });

  it('loads todos from localStorage on mount', () => {
    const existingTodos: Todo[] = [
      {
        id: 1,
        text: 'Loaded task',
        completed: false,
        createdAt: new Date().toISOString(),
        color: 'green',
      },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingTodos));

    render(<Home />);

    expect(screen.getByText('Loaded task')).toBeInTheDocument();
  });

  it('handles malformed localStorage data gracefully', () => {
    // Spy on console.error to verify error is logged but no crash
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValueOnce('invalid-json');

    // Should not throw
    expect(() => render(<Home />)).not.toThrow();

    // Should log error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to parse todos',
      expect.any(Error)
    );

    consoleSpy.mockRestore();

    expect(screen.getByText('暂无任务')).toBeInTheDocument();
  });

  it('adds todo with color selection', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');
    await user.type(input, 'Colored task');

    // Select red color
    const redColorButton = screen.getByTitle('🔴');
    await user.click(redColorButton);

    const submitButton = screen.getByRole('button', { name: /添加/i });
    await user.click(submitButton);

    // The color tag should be present
    const colorTag = document.querySelector('.todo-color-tag.bg-red-500');
    expect(colorTag).toBeInTheDocument();
  });

  it('calculates progress bar width correctly', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');

    // Add 4 tasks
    await user.type(input, 'Task 1{Enter}');
    await user.type(input, 'Task 2{Enter}');
    await user.type(input, 'Task 3{Enter}');
    await user.type(input, 'Task 4{Enter}');

    // Complete 2 tasks
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]); // Complete "Task 1"
    await user.click(checkboxes[1]); // Complete "Task 2"

    // Check progress bar width (should be 50%)
    // Progress bar is the div inside the stats-card with gradient classes and inline style
    const progressBar = document.querySelector('.stats-card + div .bg-gradient-to-r');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('filters completed and active tasks count correctly', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');

    await user.type(input, 'Active 1{Enter}');
    await user.type(input, 'Completed 1{Enter}');
    await user.type(input, 'Active 2{Enter}');
    await user.type(input, 'Completed 2{Enter}');

    // Complete tasks 2 and 4 (indices 1 and 3)
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // Complete "Completed 1"
    await user.click(checkboxes[3]); // Complete "Completed 2"

    // Should show 2 completed out of 4
    const numbers = screen.getAllByText(/[0-4]/);
    expect(numbers.some(el => el.textContent === '2')).toBe(true); // completed
    expect(numbers.some(el => el.textContent === '4')).toBe(true); // total
  });

  it('handles race condition in localStorage updates', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');

    // Rapidly add multiple tasks
    await user.type(input, 'Task A{Enter}');
    await user.type(input, 'Task B{Enter}');
    await user.type(input, 'Task C{Enter}');

    const todoItems = screen.getAllByRole('checkbox');
    expect(todoItems).toHaveLength(3);
  });

  it('maintains correct todo order (newest first)', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText('添加新任务...按 Enter 提交');

    await user.type(input, 'First task{Enter}');
    await user.type(input, 'Second task{Enter}');
    await user.type(input, 'Third task{Enter}');

    const todos = screen.getAllByText(/task/i);
    expect(todos[0]).toHaveTextContent('Third task');
    expect(todos[1]).toHaveTextContent('Second task');
    expect(todos[2]).toHaveTextContent('First task');
  });
});
