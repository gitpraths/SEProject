'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/utils/api';
import { ErrorHandler } from '@/utils/errorHandler';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  immediate?: boolean;
}

export interface UseApiReturn<T, P extends any[] = any[]> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic hook for API calls with loading and error states
 */
export function useApi<T, P extends any[] = any[]>(
  apiFunction: (...params: P) => Promise<any>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...params);
        const result = response?.data || response;

        setData(result);
        options.onSuccess?.(result);

        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        options.onError?.(apiError);
        ErrorHandler.handle(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [options.immediate]);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for fetching data with automatic loading on mount
 */
export function useFetch<T>(
  apiFunction: () => Promise<any>,
  dependencies: any[] = []
): UseApiReturn<T, []> {
  const result = useApi<T, []>(apiFunction, { immediate: true });

  useEffect(() => {
    result.execute();
  }, dependencies);

  return result;
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T, P extends any[] = any[]>(
  apiFunction: (...params: P) => Promise<any>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T, P> {
  return useApi<T, P>(apiFunction, { ...options, immediate: false });
}

/**
 * Hook for paginated data
 */
export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export interface UsePaginationReturn<T> {
  data: T[];
  loading: boolean;
  error: ApiError | null;
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refresh: () => void;
}

export function usePagination<T>(
  apiFunction: (params: { page: number; limit: number }) => Promise<any>,
  options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction({ page, limit });
      const result = response?.data || response;

      setData(result.data || []);
      setTotal(result.total || 0);
      setPages(result.pages || 0);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      ErrorHandler.handle(apiError);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    if (page < pages) {
      setPage((prev) => prev + 1);
    }
  }, [page, pages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  }, [pages]);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
    nextPage,
    prevPage,
    goToPage,
    setLimit: updateLimit,
    refresh: fetchData,
  };
}

/**
 * Hook for file uploads with progress
 */
export interface UseUploadReturn {
  upload: (file: File, individualId: string | number, documentType?: string) => Promise<any>;
  progress: number;
  loading: boolean;
  error: ApiError | null;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const upload = useCallback(
    async (file: File, individualId: string | number, documentType = 'id_proof') => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0);

        const response = await api.uploadDocument(
          file,
          individualId,
          documentType,
          (progressValue) => {
            setProgress(progressValue);
          }
        );

        return response;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        ErrorHandler.handle(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setProgress(0);
    setError(null);
    setLoading(false);
  }, []);

  return { upload, progress, loading, error, reset };
}
