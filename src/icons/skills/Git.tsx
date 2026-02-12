import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

const Git = React.forwardRef<SVGSVGElement, IconProps>(({ className, size = 24, strokeWidth = 1.5, color, style }, ref) => (
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
    <path d="m21.62 11.108-8.731-8.729a1.29 1.29 0 0 0-1.823 0L9.257 4.19l2.299 2.3a1.532 1.532 0 0 1 1.939 1.95l2.214 2.217a1.53 1.53 0 0 1 1.583 2.531c-.599.6-1.566.6-2.166 0a1.54 1.54 0 0 1-.337-1.662l-2.074-2.063V14.9c.146.071.286.169.407.29a1.537 1.537 0 0 1 0 2.166 1.536 1.536 0 0 1-2.174 0 1.53 1.53 0 0 1 0-2.164q.23-.226.504-.339v-5.49a1.53 1.53 0 0 1-.83-2.008l-2.26-2.271-5.987 5.982c-.5.504-.5 1.32 0 1.824l8.731 8.729a1.286 1.286 0 0 0 1.821 0l8.69-8.689a1.284 1.284 0 0 0 .003-1.822"/>
  </svg>
));

Git.displayName = 'Git';

export default Git;
