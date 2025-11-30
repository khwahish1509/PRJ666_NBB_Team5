import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWidget from './ChatWidget';
import axios from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

describe('ChatWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        tokens: { accessToken: 'test-token' },
      })
    );
  });

  it('renders chat button when closed', () => {
    render(<ChatWidget />);
    const button = screen.getByLabelText('Open chat');
    expect(button).toBeInTheDocument();
  });

  it('opens chat window when button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { suggestions: ['Test suggestion'] },
    });

    render(<ChatWidget />);
    const button = screen.getByLabelText('Open chat');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Skincare Assistant')).toBeInTheDocument();
    });
  });

  it('displays welcome message when opened', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { suggestions: [] },
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    await waitFor(() => {
      expect(
        screen.getByText(/Hi! I'm your skincare assistant/i)
      ).toBeInTheDocument();
    });
  });

  it('loads and displays quick reply suggestions', async () => {
    const suggestions = [
      'Is this product safe?',
      'Explain harmful ingredients',
    ];

    mockedAxios.get.mockResolvedValue({
      data: { suggestions },
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    await waitFor(() => {
      expect(screen.getByText('Is this product safe?')).toBeInTheDocument();
      expect(screen.getByText('Explain harmful ingredients')).toBeInTheDocument();
    });
  });

  it('sends message when form is submitted', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { suggestions: [] },
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        response: 'Test response',
        timestamp: new Date().toISOString(),
      },
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ask about skincare...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Ask about skincare...');
    const sendButton = screen.getByLabelText('Send message');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat/message'),
        expect.objectContaining({
          message: 'Test message',
        }),
        expect.any(Object)
      );
    });
  });

  it('displays typing indicator while loading', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { suggestions: [] },
    });

    mockedAxios.post.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: {
                  response: 'Response',
                  timestamp: new Date().toISOString(),
                },
              }),
            100
          )
        )
    );

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ask about skincare...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Ask about skincare...');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.submit(input.closest('form')!);

    // Check for typing indicator (animated dots)
    await waitFor(() => {
      const dots = document.querySelectorAll('.animate-bounce');
      expect(dots.length).toBeGreaterThan(0);
    });
  });

  it('handles quick reply button click', async () => {
    const suggestions = ['Quick question'];

    mockedAxios.get.mockResolvedValue({
      data: { suggestions },
    });

    mockedAxios.post.mockResolvedValue({
      data: {
        response: 'Quick answer',
        timestamp: new Date().toISOString(),
      },
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    await waitFor(() => {
      expect(screen.getByText('Quick question')).toBeInTheDocument();
    });

    const quickReplyButton = screen.getByText('Quick question');
    fireEvent.click(quickReplyButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/chat/message'),
        expect.objectContaining({
          message: 'Quick question',
        }),
        expect.any(Object)
      );
    });
  });

  it('closes chat window when close button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { suggestions: [] },
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    await waitFor(() => {
      expect(screen.getByLabelText('Close chat')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Close chat'));

    await waitFor(() => {
      expect(screen.queryByText('Skincare Assistant')).not.toBeInTheDocument();
    });
  });

  it('disables input and button while loading', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { suggestions: [] },
    });

    mockedAxios.post.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: {
                  response: 'Response',
                  timestamp: new Date().toISOString(),
                },
              }),
            100
          )
        )
    );

    render(<ChatWidget />);
    fireEvent.click(screen.getByLabelText('Open chat'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ask about skincare...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Ask about skincare...') as HTMLInputElement;
    const sendButton = screen.getByLabelText('Send message') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(input.disabled).toBe(true);
      expect(sendButton.disabled).toBe(true);
    });
  });
});
