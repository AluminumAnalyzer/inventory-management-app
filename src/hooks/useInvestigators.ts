// ==================== src/hooks/useInvestigators.ts ====================
// 파일 위치: src/hooks/useInvestigators.ts
// 설명: 조사자 데이터 관리 전용 훅
import { useSheetData } from "./useApi";
import { Investigator } from "@/types";

export function useInvestigators() {
  const {
    data: investigators,
    loading,
    error,
    loadData,
    addItem: addInvestigator,
    updateItem: updateInvestigator,
    deleteItem: deleteInvestigator,
  } = useSheetData<Investigator>("Investigators");

  const getCurrentInvestigator = (): Investigator | undefined => {
    return investigators.find(
      (investigator) =>
        investigator.isCurrent === true ||
        investigator.isCurrent === "TRUE" ||
        investigator.isCurrent === "true"
    );
  };

  const setCurrentInvestigator = async (id: string): Promise<boolean> => {
    try {
      // 모든 조사자의 isCurrent를 false로 설정
      const updatePromises = investigators.map((investigator) => {
        if (
          investigator.isCurrent === true ||
          investigator.isCurrent === "TRUE"
        ) {
          return updateInvestigator({
            ...investigator,
            isCurrent: false,
          });
        }
        return Promise.resolve(null);
      });

      await Promise.all(updatePromises);

      // 선택된 조사자를 현재 조사자로 설정
      const targetInvestigator = investigators.find((inv) => inv.id === id);
      if (targetInvestigator) {
        const result = await updateInvestigator({
          ...targetInvestigator,
          isCurrent: true,
        });
        return result !== null;
      }

      return false;
    } catch (error) {
      console.error("Failed to set current investigator:", error);
      return false;
    }
  };

  return {
    investigators,
    loading,
    error,
    loadData,
    addInvestigator,
    updateInvestigator,
    deleteInvestigator,
    getCurrentInvestigator,
    setCurrentInvestigator,
  };
}

export type { Investigator };
