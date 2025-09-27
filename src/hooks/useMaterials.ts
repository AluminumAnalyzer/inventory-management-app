// ==================== src/hooks/useMaterials.ts ====================
// 파일 위치: src/hooks/useMaterials.ts
// 설명: 자재 데이터 관리 전용 훅
import { useSheetData } from "./useApi";
import { Material } from "@/types";

export function useMaterials() {
  const {
    data: materials,
    loading,
    error,
    loadData,
    addItem: addMaterial,
    updateItem: updateMaterial,
    deleteItem: deleteMaterial,
  } = useSheetData<Material>("Materials");

  const findByCode = (code: string): Material | undefined => {
    return materials.find((material) => material.code === code);
  };

  const findByName = (name: string): Material[] => {
    return materials.filter((material) =>
      material.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  const isCodeDuplicate = (code: string, excludeId?: string): boolean => {
    return materials.some(
      (material) => material.code === code && material.id !== excludeId
    );
  };

  return {
    materials,
    loading,
    error,
    loadData,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    findByCode,
    findByName,
    isCodeDuplicate,
  };
}

export type { Material };
