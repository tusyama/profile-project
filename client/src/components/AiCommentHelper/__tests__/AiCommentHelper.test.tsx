import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiErrorCode } from '@developer-landing/shared';
import * as api from '@/api/client';
import { AiCommentHelper } from '@/components/AiCommentHelper/AiCommentHelper';
import { renderWithTheme } from '@/test/render';

vi.mock('@/api/client', async (importOriginal) => {
  const mod = await importOriginal<typeof api>();
  return { ...mod, improveComment: vi.fn() };
});

const draft = 'Достаточно длинный черновик комментария для AI';

describe('AiCommentHelper', () => {
  beforeEach(() => {
    vi.mocked(api.improveComment).mockReset();
  });

  it('disables improve button for short draft', () => {
    renderWithTheme(<AiCommentHelper draft="short" onAccept={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Улучшить/i })).toBeDisabled();
  });

  it('shows preview and accept flow on success', async () => {
    vi.mocked(api.improveComment).mockResolvedValue({ improved: 'Улучшенный текст' });
    const onAccept = vi.fn();
    const user = userEvent.setup();

    renderWithTheme(<AiCommentHelper draft={draft} onAccept={onAccept} />);
    await user.click(screen.getByRole('button', { name: /Улучшить/i }));

    await waitFor(() => {
      expect(screen.getByText('Улучшенный текст')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Принять' }));
    expect(onAccept).toHaveBeenCalledWith('Улучшенный текст');
  });

  it('shows error alert when AI is unavailable', async () => {
    vi.mocked(api.improveComment).mockRejectedValue(
      new api.ApiError(ApiErrorCode.AiUnavailable, 'down'),
    );
    const user = userEvent.setup();

    renderWithTheme(<AiCommentHelper draft={draft} onAccept={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Улучшить/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/временно недоступен/i);
    });
  });
});
