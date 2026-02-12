import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

const AntigravityIde = React.forwardRef<SVGSVGElement, IconProps>(({ className, size = 24, strokeWidth = 1.5, color, style }, ref) => (
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
    <path d="m19.94,20.59c1.09.82,2.73.27,1.23-1.23-4.5-4.36-3.55-16.36-9.14-16.36S7.39,15,2.89,19.36c-1.64,1.64.14,2.05,1.23,1.23,4.23-2.86,3.95-7.91,7.91-7.91s3.68,5.05,7.91,7.91Z" />
  </svg>
));

AntigravityIde.displayName = 'AntigravityIde';

export default AntigravityIde;
