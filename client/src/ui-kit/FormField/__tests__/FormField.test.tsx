import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { FormField } from '@/ui-kit/FormField/FormField';
import { Input } from '@/ui-kit/Input/Input';
import { renderWithTheme } from '@/test/render';

describe('FormField', () => {
  it('renders honeypot without visible label', () => {
    renderWithTheme(
      <FormField honeypot>
        <Input data-testid="trap" />
      </FormField>,
    );
    expect(screen.getByTestId('trap')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('links error message to input for accessibility', () => {
    renderWithTheme(
      <FormField label="Email" htmlFor="email" error="Некорректный email">
        <Input id="email" />
      </FormField>,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Некорректный email');
  });
});
