import React from 'react';

type CloseIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};


export default function CloseIcon({ size = 24, ...props }: CloseIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M5 5L19 19" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M19 5L5 19" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
