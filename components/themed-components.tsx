"use client"

import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function PageWrapper({ 
  children, 
  title, 
  description,
  className = "" 
}: PageWrapperProps) {
  return (
    <div className={`fade-in p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h1 className="text-2xl font-bold text-theme-text-primary">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-2 text-theme-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

interface ContentCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  onAnimationComplete?: () => void;
}

export function ContentCard({ 
  children, 
  title, 
  description,
  className = "",
  onAnimationComplete 
}: ContentCardProps) {
  return (
    <div 
      className={`themed-card slide-up ${className}`}
      onAnimationEnd={onAnimationComplete}
    >
      {(title || description) && (
        <div className="themed-card-header">
          {title && (
            <h2 className="text-xl font-semibold text-theme-text-primary">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-theme-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="themed-card-content">
        {children}
      </div>
    </div>
  );
}

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  isLoading?: boolean;
}

export function ActionButton({ 
  children, 
  variant = 'primary',
  isLoading,
  className = "",
  ...props 
}: ActionButtonProps) {
  const baseClass = variant === 'primary' ? 'themed-button' :
                   variant === 'outline' ? 'themed-button-outline' :
                   'text-theme-primary hover:text-theme-primary-dark';
                   
  return (
    <button 
      className={`${baseClass} ${isLoading ? 'opacity-75 cursor-wait' : ''} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({ 
  label, 
  error,
  className = "",
  ...props 
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-theme-text-primary">
          {label}
        </label>
      )}
      <input 
        className={`themed-input ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: 'success' | 'pending' | 'error';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ 
  status, 
  children,
  className = "" 
}: StatusBadgeProps) {
  // Green-themed color scheme that's balanced and professional
  const badgeClass = status === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    status === 'pending' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    'bg-red-100 text-red-700 border border-red-200';
                    
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass} ${className} transition-all duration-300 hover:shadow-sm`}>
      {children}
    </span>
  );
}
