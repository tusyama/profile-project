import styled, { css } from 'styled-components';
import type { ReactNode } from 'react';

type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4';
type TextVariant = 'body' | 'muted' | 'small';

const headingSizes: Record<HeadingSize, string> = {
  h1: 'clamp(2rem, 5vw, 3rem)',
  h2: 'clamp(1.5rem, 3vw, 2rem)',
  h3: '1.35rem',
  h4: '1.1rem',
};

const headingStyles = css<{ $size: HeadingSize }>`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ $size }) => headingSizes[$size]};
`;

export const H1 = styled.h1<{ $size?: HeadingSize }>`
  ${headingStyles}
  ${({ $size = 'h1' }) => css`font-size: ${headingSizes[$size]};`}
`;

export const H2 = styled.h2<{ $size?: HeadingSize }>`
  ${headingStyles}
  ${({ $size = 'h2' }) => css`font-size: ${headingSizes[$size]};`}
`;

export const H3 = styled.h3<{ $size?: HeadingSize }>`
  ${headingStyles}
  ${({ $size = 'h3' }) => css`font-size: ${headingSizes[$size]};`}
`;

export const H4 = styled.h4<{ $size?: HeadingSize }>`
  ${headingStyles}
  ${({ $size = 'h4' }) => css`font-size: ${headingSizes[$size]};`}
`;

/** @deprecated use H1-H4 */
export function Heading({
  as = 'h2',
  $size,
  children,
}: {
  as?: HeadingSize;
  $size: HeadingSize;
  children: ReactNode;
}) {
  const Tag = { h1: H1, h2: H2, h3: H3, h4: H4 }[as];
  return <Tag $size={$size}>{children}</Tag>;
}

export const Text = styled.p<{ $variant: TextVariant }>`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  line-height: 1.7;

  ${({ $variant, theme }) =>
    $variant === 'body' &&
    css`
      color: ${theme.colors.text};
      font-size: 1rem;
    `}

  ${({ $variant, theme }) =>
    $variant === 'muted' &&
    css`
      color: ${theme.colors.textMuted};
      font-size: 1rem;
    `}

  ${({ $variant, theme }) =>
    $variant === 'small' &&
    css`
      color: ${theme.colors.textMuted};
      font-size: 0.875rem;
    `}
`;
