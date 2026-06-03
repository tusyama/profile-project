import type { ReactNode } from 'react';
import { H1, H2, H3, H4, type HeadingSize } from './Typography.styles';

export { H1, H2, H3, H4, Text } from './Typography.styles';
export type { HeadingSize, TextVariant } from './Typography.styles';

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
