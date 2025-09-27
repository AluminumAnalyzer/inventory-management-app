// ==================== src/hooks/useLocations.ts ====================
// 파일 위치: src/hooks/useLocations.ts
// 설명: 위치 데이터 관리 전용 훅
import { useSheetData } from "./useApi";
import { Location } from "@/types";

export function useLocations() {
  const {
    data: locations,
    loading,
    error,
    loadData,
    addItem: addLocation,
    updateItem: updateLocation,
    deleteItem: deleteLocation,
  } = useSheetData<Location>("Locations");

  const findByCode = (code: string): Location | undefined => {
    return locations.find((location) => location.code === code);
  };

  const isCodeDuplicate = (code: string, excludeId?: string): boolean => {
    return locations.some(
      (location) => location.code === code && location.id !== excludeId
    );
  };

  return {
    locations,
    loading,
    error,
    loadData,
    addLocation,
    updateLocation,
    deleteLocation,
    findByCode,
    isCodeDuplicate,
  };
}

export type { Location };
