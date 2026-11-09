import { siLeetcode } from 'simple-icons';

interface LeetCodeIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const LeetCodeIcon = ({ size = 16, className }: LeetCodeIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d={siLeetcode.path} />
  </svg>
);

export default LeetCodeIcon;
