import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

const Vercel = React.forwardRef<SVGSVGElement, IconProps>(({ className, size = 24, strokeWidth = 1.5, color, style }, ref) => (
  <svg
    ref={ref}
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || 'currentColor'}
    stroke="none"
    style={style}
  >
    <path d="M12 2.68 22 20H2z"/>
  </svg>
));

Vercel.displayName = 'Vercel';

export default Vercel;
