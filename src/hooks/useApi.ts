/* trunk-ignore-all(prettier) */
/*
================================================================================
📁 SRC/HOOKS - 커스텀 훅 파일들
================================================================================
*/

// ==================== src/hooks/useApi.ts ====================
// 파일 위치: src/hooks/useApi.ts
// 설명: 기본 API 호출 및 데이터 관리 훅
import { useState, useEffect, useCallback } from "react";
import { fetchData, addData, updateData, deleteData } from "@/lib/api";

export function useSheetData<T>(sheetName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchData<T>(sheetName);

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [sheetName]);

  const addItem = useCallback(
    async (item: Partial<T>) => {
      try {
        const result = await addData<T>(sheetName, item);

        if (result.success && result.data) {
          setData((prev) => [result.data!, ...prev]);
          return result.data;
        } else {
          setError(result.error || "Failed to add item");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
        return null;
      }
    },
    [sheetName]
  );

  const updateItem = useCallback(
    async (item: T) => {
      try {
        const result = await updateData<T>(sheetName, item);

        if (result.success && result.data) {
          setData((prev) =>
            prev.map((existing) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (existing as any).id === (result.data as any).id
                ? result.data!
                : existing
            )
          );
          return result.data;
        } else {
          setError(result.error || "Failed to update item");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item");
        return null;
      }
    },
    [sheetName]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        const result = await deleteData(sheetName, id);

        if (result.success) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setData((prev) => prev.filter((item) => (item as any).id !== id));
          return true;
        } else {
          setError(result.error || "Failed to delete item");
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete item");
        return false;
      }
    },
    [sheetName]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    loadData,
    addItem,
    updateItem,
    deleteItem,
  };
}
