import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const base = 'bg-ff-card border border-ff-border rounded-lg';
  const hoverStyles = hover
    ? 'hover:border-ff-teal hover:shadow-sm transition-all cursor-pointer'
    : '';

  return (
    <div className={`${base} ${hoverStyles} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
