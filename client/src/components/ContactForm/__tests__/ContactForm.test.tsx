import { describe, expect, it, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiErrorCode } from '@/types/api';
import * as api from '@/api/client';
import { ContactForm } from '@/components/ContactForm/ContactForm';
import { renderWithTheme } from '@/test/render';

vi.mock('@/api/client', async (importOriginal) => {
  const mod = await importOriginal<typeof api>();
  return { ...mod, submitContact: vi.fn() };
});

const validPayload = {
  name: 'Артем Репин',
  phone: '+7 999 123 45 67',
  email: 'test@example.com',
  comment: 'Достаточно длинный комментарий для формы',
  website: '',
};

describe('ContactForm', () => {
  beforeEach(() => {
    vi.mocked(api.submitContact).mockReset();
  });

  it('shows success state after submit', async () => {
    vi.mocked(api.submitContact).mockResolvedValue({ success: true });
    const user = userEvent.setup();

    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText('Имя'), validPayload.name);
    await user.type(screen.getByLabelText('Телефон'), validPayload.phone);
    await user.type(screen.getByLabelText('Email'), validPayload.email);
    await user.type(screen.getByLabelText('Комментарий'), validPayload.comment);
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/отправлено/i);
    });
    expect(api.submitContact).toHaveBeenCalledOnce();
  });

  it('shows field error from server validation details', async () => {
    vi.mocked(api.submitContact).mockRejectedValue(
      new api.ApiError(ApiErrorCode.ValidationFailed, 'validation', [
        { field: 'email', message: 'Некорректный email' },
      ]),
    );
    const user = userEvent.setup();

    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText('Имя'), validPayload.name);
    await user.type(screen.getByLabelText('Телефон'), validPayload.phone);
    await user.type(screen.getByLabelText('Email'), 'bad');
    await user.type(screen.getByLabelText('Комментарий'), validPayload.comment);
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => {
      expect(screen.getByText('Некорректный email')).toBeInTheDocument();
    });
  });

  it('shows global error for rate limit', async () => {
    vi.mocked(api.submitContact).mockRejectedValue(
      new api.ApiError(ApiErrorCode.RateLimitExceeded, 'rate'),
    );
    const user = userEvent.setup();

    renderWithTheme(<ContactForm />);

    await user.type(screen.getByLabelText('Имя'), validPayload.name);
    await user.type(screen.getByLabelText('Телефон'), validPayload.phone);
    await user.type(screen.getByLabelText('Email'), validPayload.email);
    await user.type(screen.getByLabelText('Комментарий'), validPayload.comment);
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Слишком много попыток/i);
    });
  });
});
