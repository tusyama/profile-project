import { Ring } from './Spinner.styles';

export function Spinner({ size = 20 }: { size?: number }) {
  return <Ring $size={size} aria-hidden />;
}
