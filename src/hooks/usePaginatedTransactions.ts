import { useCallback, useState } from "react";
import { PaginatedResponse, Transaction } from "../utils/types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions() {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(
    null
  );

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>>(
      "paginatedTransactions",
      { page: paginatedTransactions?.nextPage || 0 }
    );
    setPaginatedTransactions((prev) => {
      if (prev === null) {
        return response;
      }
      return {
        data: [...prev.data, ...(response?.data || [])],
        nextPage: response?.nextPage || null,
      };
    });
    return response;
  }, [fetchWithCache, paginatedTransactions]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  return { data: paginatedTransactions, fetchAll, loading, invalidateData };
}
