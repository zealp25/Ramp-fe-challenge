import { useCallback, useState } from "react";
import { Transaction } from "../utils/types";
import { useCustomFetch } from "./useCustomFetch";

export function useTransactionsByEmployee() {
  const { fetchWithCache, loading } = useCustomFetch();
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null);

  const fetchById = useCallback(async (employeeId: string) => {
    const response = await fetchWithCache<Transaction[]>("transactionsByEmployee", { employeeId });
    setTransactionsByEmployee(response || []);
    return response;
  }, [fetchWithCache]);

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null);
  }, []);

  return { data: transactionsByEmployee, fetchById, loading, invalidateData };
}
