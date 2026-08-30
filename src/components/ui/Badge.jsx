import React from 'react';

/**
 * Reusable Badge Component
 * Strict Color Logic:
 * - 'green' (Success/Available): #16A34A text, #ECFDF5 background
 * - 'red' (Full/Unavailable): #DC2626 text, #FEF2F2 background
 * - 'amber' (Pending/In Progress): #D97706 text, #FFFBEB background
 * - 'gray' (Neutral): Charcoal/Muted
 */
export function Badge({ 
  children, 
  variant = 'green', 
  size = 'md', 
  dot = false, 
  className = '',
  id
}) {
  const variantStyles = {
    green: 'bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/20',
    red: 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/20',
    amber: 'bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/20',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const dotColors = {
    green: 'bg-[#16A34A]',
    red: 'bg-[#DC2626]',
    amber: 'bg-[#D97706]',
    gray: 'bg-gray-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
    lg: 'text-sm px-3 py-1.5 rounded-full font-semibold',
  };

  return (
    <span 
      id={id}
      className={`inline-flex items-center gap-1.5 transition-all duration-200 ${variantStyles[variant] || variantStyles.green} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.green} animate-pulse-subtle`} />
      )}
      {children}
    </span>
  );
}
