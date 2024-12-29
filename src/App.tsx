import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { InputSelect } from "./components/InputSelect";
import { Instructions } from "./components/Instructions";
import { Transactions } from "./components/Transactions";
import { useEmployees } from "./hooks/useEmployees";
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions";
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee";
import { EMPTY_EMPLOYEE } from "./utils/constants";
import { Employee } from "./utils/types";

export function App() {
  const { data: employees, loading: isEmployeesLoading, fetchAll: fetchEmployees } = useEmployees();
  const { data: paginatedTransactions, fetchAll: fetchTransactions, loading: isTransactionsLoading } =
    usePaginatedTransactions();
  const { data: transactionsByEmployee, fetchById: fetchTransactionsByEmployee } =
    useTransactionsByEmployee();
  const [allTransactions, setAllTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const transactions = useMemo(() => {
    if (transactionsByEmployee) return transactionsByEmployee;
    if (paginatedTransactions) return allTransactions;
    return null;
  }, [transactionsByEmployee, paginatedTransactions, allTransactions]);

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true);
    await fetchEmployees(); // Ensure employees are loaded first
    const response = await fetchTransactions();
    if (response?.data) {
      setAllTransactions((prev) => [...(prev || []), ...response.data]);
    }
    setIsLoading(false);
  }, [fetchEmployees, fetchTransactions]);

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      setIsLoading(true);
      const response = await fetchTransactionsByEmployee(employeeId);
      setAllTransactions(null); // Clear paginated transactions
      if (response) {
        setAllTransactions(response);
      }
      setIsLoading(false);
    },
    [fetchTransactionsByEmployee]
  );

  useEffect(() => {
    if (!employees && !isEmployeesLoading) {
      loadAllTransactions();
    }
  }, [employees, isEmployeesLoading, loadAllTransactions]);

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isEmployeesLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees..."
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null || newValue.id === EMPTY_EMPLOYEE.id) {
              setAllTransactions(null);
              await loadAllTransactions();
            } else {
              await loadTransactionsByEmployee(newValue.id);
            }
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {paginatedTransactions?.nextPage !== null && (
            <button
              className="RampButton"
              disabled={isTransactionsLoading}
              onClick={async () => {
                const response = await fetchTransactions();
                if (response?.data) {
                  setAllTransactions((prev) => [...(prev || []), ...response.data]);
                }
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  );
}
