import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

const Jwt = React.forwardRef<SVGSVGElement, IconProps>(({ className, size = 24, strokeWidth = 1.5, color, style }, ref) => (
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
    <path d="m13.48 7.37-.02-5.38h-3l.02 5.38 1.5 2.06zm-3 9.22v5.4h3v-5.4l-1.5-2.06z"/><path d="m13.48 16.6 3.16 4.36 2.42-1.76-3.16-4.36-2.42-.78zm-3-9.22L7.3 3.02 4.88 4.78l3.16 4.36 2.44.78z"/><path d="M8.04 9.14 2.92 7.48 2 10.32 7.12 12l2.42-.8zm6.36 3.64 1.5 2.06 5.12 1.66.92-2.84L16.82 12zM16.82 12l5.12-1.68-.92-2.84-5.12 1.66-1.5 2.06zm-9.7 0L2 13.66l.92 2.84 5.12-1.66 1.5-2.06zM8.04 14.84 4.88 19.2l2.42 1.76 3.18-4.36v-2.54zm7.86-5.7 3.16-4.36-2.42-1.76-3.16 4.36v2.54z"/>
  </svg>
));

Jwt.displayName = 'Jwt';

export default Jwt;
