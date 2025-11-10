'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  onClick,
  className = '',
}) => {
  const baseClass = interactive ? 'card-interactive' : 'card';

  if (interactive && onClick) {
    return (
      <button
        className={`${baseClass} ${className}`}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }

  return <div className={`${baseClass} ${className}`}>{children}</div>;
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-xl font-bold text-neutral-900 ${className}`}>
      {children}
    </h3>
  );
};

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => {
  return <div className={`text-neutral-600 ${className}`}>{children}</div>;
};
