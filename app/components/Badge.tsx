import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'red';
  icon?: LucideIcon;
  className?: string;
}

export function Badge({ children, variant = 'blue', icon: Icon, className = '' }: BadgeProps) {
  const variantStyles = {
    blue: 'vault-badge-blue',
    green: 'vault-badge-green',
    red: 'vault-badge-red'
  };

  return (
    <span className={`vault-badge ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
