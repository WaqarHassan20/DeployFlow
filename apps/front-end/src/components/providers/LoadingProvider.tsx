"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isGlobalLoading: boolean;
  loadingMessage: string;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  withLoading: <T extends any[]>(
    asyncFn: (...args: T) => Promise<any>,
    message?: string
  ) => (...args: T) => Promise<any>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const setGlobalLoading = (loading: boolean, message: string = 'Loading...') => {
    setIsGlobalLoading(loading);
    setLoadingMessage(message);
  };

  const withLoading = <T extends any[]>(
    asyncFn: (...args: T) => Promise<any>,
    message: string = 'Processing...'
  ) => {
    return async (...args: T) => {
      setGlobalLoading(true, message);
      try {
        const result = await asyncFn(...args);
        return result;
      } finally {
        setGlobalLoading(false);
      }
    };
  };

  const value: LoadingContextType = {
    isGlobalLoading,
    loadingMessage,
    setGlobalLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};