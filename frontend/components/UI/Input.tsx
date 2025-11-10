'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, required, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helpTextId = `${inputId}-help`;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`label ${required ? 'label-required' : ''}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helpText ? helpTextId : undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className="error-message" role="alert">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={helpTextId} className="help-text">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
