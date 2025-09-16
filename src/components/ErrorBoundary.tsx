'use client';

import { useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Application error:', error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <>
      {children}
      {fallback}
    </>
  );
}
