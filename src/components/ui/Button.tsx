import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-ff-teal text-white rounded-full font-medium hover:bg-ff-teal-dark transition-colors',
  secondary: 'border border-ff-border text-ff-text-secondary rounded-md hover:border-ff-teal hover:text-ff-text transition-colors',
  ghost: 'text-ff-text-secondary hover:text-ff-text hover:bg-gray-50 rounded-md transition-colors',
  danger: 'bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
