import React from 'react';

/**
 * Reusable Card Component
 * Meets MediMatch design specs: rounded-xl, soft shadow, generous padding, white background.
 */
export function Card({ 
  children, 
  className = '', 
  hoverable = false,
  bordered = true,
  onClick,
  id 
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        bg-white rounded-xl transition-all duration-200 
        ${bordered ? 'border border-gray-100' : ''}
        shadow-sm hover:shadow-md
        ${hoverable ? 'hover:-translate-y-0.5 cursor-pointer hover:border-gray-300' : ''}
        p-5 sm:p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-1.5 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold text-[#1A1A1A] tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-gray-500 font-normal ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-5 pt-4 border-t border-gray-100 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}
