// ==================== src/hooks/useInspectionRecords.ts ====================
// 파일 위치: src/hooks/useInspectionRecords.ts
// 설명: 재고 조사 기록 관리 전용 훅
import { useSheetData } from "./useApi";
import { InspectionRecord } from "@/types";

export function useInspectionRecords() {
  const {
    data: inspectionRecords,
    loading,
    error,
    loadData,
    addItem: addInspectionRecord,
    updateItem: updateInspectionRecord,
    deleteItem: deleteInspectionRecord,
  } = useSheetData<InspectionRecord>("InspectionRecords");

  const getRecordsByMaterial = (materialId: string): InspectionRecord[] => {
    return inspectionRecords.filter(
      (record) => record.materialId === materialId
    );
  };

  const getRecordsByLocation = (locationId: string): InspectionRecord[] => {
    return inspectionRecords.filter(
      (record) => record.locationId === locationId
    );
  };

  const getRecentRecords = (limit: number = 10): InspectionRecord[] => {
    return inspectionRecords
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  };

  const getTotalQuantityByMaterial = (materialId: string): number => {
    return inspectionRecords
      .filter((record) => record.materialId === materialId)
      .reduce((total, record) => total + record.quantity, 0);
  };

  return {
    inspectionRecords,
    loading,
    error,
    loadData,
    addInspectionRecord,
    updateInspectionRecord,
    deleteInspectionRecord,
    getRecordsByMaterial,
    getRecordsByLocation,
    getRecentRecords,
    getTotalQuantityByMaterial,
  };
}

export type { InspectionRecord };
