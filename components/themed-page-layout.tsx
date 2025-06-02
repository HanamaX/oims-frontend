"use client"

import React from 'react'

interface PageLayoutProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ThemedPageLayout({
  title,
  description,
  actions,
  children,
  className = ""
}: PageLayoutProps) {
  return (
    <div className={`space-y-6 p-6 pb-16 fade-in ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-theme-text-primary">
            {title}
          </h2>
          {description && (
            <p className="text-theme-text-secondary">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      
      {children}
    </div>
  )
}

interface SectionProps {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ThemedSection({
  title,
  description,
  actions,
  children,
  className = ""
}: SectionProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description || actions) && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold text-theme-text-primary">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-theme-text-secondary">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {children}
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function ThemedEmptyState({
  icon,
  title,
  description,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {icon && (
        <div className="mb-4 rounded-full bg-theme-bg-accent p-3">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-theme-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-theme-text-secondary">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}

interface LoadingStateProps {
  title?: string
  description?: string
  className?: string
}

export function ThemedLoadingState({
  title = "Loading...",
  description,
  className = ""
}: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
      </div>
      <h3 className="text-lg font-semibold text-theme-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-theme-text-secondary">
          {description}
        </p>
      )}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function ThemedErrorState({
  title = "Something went wrong",
  description,
  action,
  className = ""
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4 rounded-full bg-red-100 p-3">
        <svg
          className="h-6 w-6 text-red-600"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-theme-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-theme-text-secondary">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  )
}
