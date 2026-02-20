import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'red' | 'purple';
  icon?: LucideIcon;
  className?: string;
}

export function Badge({ children, variant = 'blue', icon: Icon, className = '' }: BadgeProps) {
  const variantStyles = {
    blue: 'vault-badge-blue',
    green: 'vault-badge-green',
    red: 'vault-badge-red',
    purple: 'vault-badge-purple'
  };

  return (
    <span className={`vault-badge ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
