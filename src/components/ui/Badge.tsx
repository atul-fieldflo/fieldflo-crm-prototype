import type { ReactNode } from 'react';

interface BadgeProps {
  variant: 'teal' | 'amber' | 'red' | 'green' | 'muted' | 'ai' | 'purple' | 'blue';
  size?: 'sm' | 'md';
  children: ReactNode;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
  ai: 'bg-ff-teal-light text-ff-teal-dark text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
  teal: 'bg-ff-teal-light text-ff-teal-dark',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  green: 'bg-green-50 text-green-700',
  muted: 'bg-gray-100 text-gray-500',
  purple: 'bg-purple-50 text-purple-700',
  blue: 'bg-blue-50 text-blue-700',
};

const sizeStyles: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-xs px-2 py-0.5 rounded',
  md: 'text-sm px-2.5 py-1 rounded-md',
};

export default function Badge({ variant, size = 'sm', children }: BadgeProps) {
  // 'ai' variant has its own sizing built in
  const classes =
    variant === 'ai'
      ? variantStyles.ai
      : `${variantStyles[variant]} ${sizeStyles[size]}`;

  return <span className={`inline-flex items-center font-medium ${classes}`}>{children}</span>;
}
