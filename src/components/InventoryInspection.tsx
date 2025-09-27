// ==================== src/components/InventoryInspection.tsx ====================
// 파일 위치: src/components/InventoryInspection.tsx
// 설명: 재고 조사 입력 메인 컴포넌트
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ClipboardCheck, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

import { useMaterials } from "@/hooks/useMaterials";
import { useLocations } from "@/hooks/useLocations";
import { useInvestigators } from "@/hooks/useInvestigators";
import {
  useInspectionRecords,
  InspectionRecord,
} from "@/hooks/useInspectionRecords";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { SearchableSelect } from "@/components/common/SearchableSelect";

interface InspectionFormData {
  materialId: string;
  quantity: string;
  locationId: string;
}

const initialFormData: InspectionFormData = {
  materialId: "",
  quantity: "",
  locationId: "",
};

export const InventoryInspection = React.memo(() => {
  // 훅들
  const {
    materials,
    loading: materialsLoading,
    error: materialsError,
  } = useMaterials();
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useLocations();
  const { getCurrentInvestigator, loading: investigatorsLoading } =
    useInvestigators();
  const {
    addInspectionRecord,
    getRecentRecords,
    getTotalQuantityByMaterial,
    loading: recordsLoading,
  } = useInspectionRecords();

  // 상태
  const [formData, setFormData] = useState<InspectionFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [inspectionDate, setInspectionDate] = useState("");

  const currentInvestigator = getCurrentInvestigator();
  const recentRecords = getRecentRecords(10);

  // 선택된 자재 정보
  const selectedMaterial = useMemo(() => {
    return materials.find((m) => m.id === formData.materialId);
  }, [materials, formData.materialId]);

  // 선택된 위치 정보
  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === formData.locationId);
  }, [locations, formData.locationId]);

  // 자재 옵션 생성
  const materialOptions = useMemo(() => {
    return materials.map((material) => ({
      value: material.id,
      label: material.name,
      sublabel: material.specification,
    }));
  }, [materials]);

  // 위치 옵션 생성
  const locationOptions = useMemo(() => {
    return locations.map((location) => ({
      value: location.id,
      label: location.name,
      sublabel: location.code,
    }));
  }, [locations]);

  // 조사일시 갱신
  const updateInspectionDate = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setInspectionDate(dateStr);
  }, []);

  // 초기 조사일시 설정
  useEffect(() => {
    updateInspectionDate();
    const interval = setInterval(updateInspectionDate, 1000);
    return () => clearInterval(interval);
  }, [updateInspectionDate]);

  // 폼 필드 변경 핸들러
  const handleFormChange = useCallback(
    (field: keyof InspectionFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    updateInspectionDate();
  }, [updateInspectionDate]);

  // 조사 기록 제출
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !selectedMaterial ||
        !formData.quantity ||
        !selectedLocation ||
        !currentInvestigator
      ) {
        toast.error("입력오류", {
          description: "모든 필수 항목을 입력해주세요.",
        });
        return;
      }

      const quantity = parseFloat(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        toast.error("수량 오류", {
          description: "올바른 수량을 입력해주세요.",
        });
        return;
      }

      setSubmitting(true);

      try {
        const record: Partial<InspectionRecord> = {
          materialId: selectedMaterial.id,
          materialCode: selectedMaterial.code,
          materialName: selectedMaterial.name,
          unit: selectedMaterial.unit,
          quantity: quantity,
          locationId: selectedLocation.id,
          locationName: selectedLocation.name,
          investigatorName: currentInvestigator.name,
          inspectionDate: inspectionDate,
        };

        const result = await addInspectionRecord(record);

        if (result) {
          toast.success("등록 완료", {
            description: `${selectedMaterial.code} - ${selectedMaterial.name} (${quantity}${selectedMaterial.unit})이 등록되었습니다.`,
          });

          resetForm();
        }
      } catch (err) {
        toast.error("등록 실패", {
          description: `재고 조사 기록 등록 중 오류가 발생했습니다.`,
        });
      } finally {
        setSubmitting(false);
      }
    },
    [
      formData,
      selectedMaterial,
      selectedLocation,
      currentInvestigator,
      inspectionDate,
      addInspectionRecord,
      resetForm,
    ]
  );

  // 로딩 상태
  const isLoading =
    materialsLoading || locationsLoading || investigatorsLoading;

  // 에러 상태
  const hasError = materialsError || locationsError;

  if (isLoading) {
    return <LoadingSpinner text="데이터를 불러오는 중..." />;
  }

  if (hasError) {
    return (
      <ErrorDisplay error={hasError || "알 수 없는 오류가 발생했습니다."} />
    );
  }

  if (!currentInvestigator) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            현재 조사자가 설정되지 않았습니다.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            조사자 정보 탭에서 조사자를 설정해주세요.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 현재 조사자 표시 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">현재 조사자:</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {currentInvestigator.name}
              </Badge>
            </div>
            <div className="text-sm text-blue-600">{inspectionDate}</div>
          </div>
        </CardContent>
      </Card>

      {/* 조사 입력 폼 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            재고 조사 입력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 자재 선택 */}
              <div className="space-y-2">
                <Label>자재 선택 *</Label>
                <SearchableSelect
                  options={materialOptions}
                  value={formData.materialId}
                  onValueChange={(value) =>
                    handleFormChange("materialId", value)
                  }
                  placeholder="자재를 선택하세요..."
                  searchPlaceholder="자재코드 또는 자재명으로 검색..."
                />
                {selectedMaterial && (
                  <div className="text-sm text-muted-foreground">
                    <p>코드: {selectedMaterial.code}</p>
                    <p>규격: {selectedMaterial.specification}</p>
                    <p>단위: {selectedMaterial.unit}</p>
                    <p>
                      현재 총 수량:{" "}
                      {getTotalQuantityByMaterial(selectedMaterial.id)}{" "}
                      {selectedMaterial.unit}
                    </p>
                  </div>
                )}
              </div>

              {/* 수량 입력 */}
              <div className="space-y-2">
                <Label htmlFor="quantity">수량 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleFormChange("quantity", e.target.value)
                    }
                    placeholder="수량 입력"
                    step="0.1"
                    min="0"
                    required
                    className="flex-1"
                  />
                  {selectedMaterial && (
                    <div className="flex items-center px-3 border rounded-md bg-muted text-muted-foreground text-sm">
                      {selectedMaterial.unit}
                    </div>
                  )}
                </div>
              </div>

              {/* 위치 선택 */}
              <div className="space-y-2">
                <Label>위치 선택 *</Label>
                <SearchableSelect
                  options={locationOptions}
                  value={formData.locationId}
                  onValueChange={(value) =>
                    handleFormChange("locationId", value)
                  }
                  placeholder="위치를 선택하세요..."
                  searchPlaceholder="위치코드 또는 위치명으로 검색..."
                />
                {selectedLocation && (
                  <div className="text-sm text-muted-foreground">
                    <p>코드: {selectedLocation.code}</p>
                  </div>
                )}
              </div>

              {/* 조사일시 (읽기전용) */}
              <div className="space-y-2">
                <Label>조사일시</Label>
                <Input value={inspectionDate} disabled className="bg-muted" />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {submitting ? "등록 중..." : "조사 기록 제출"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={submitting}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                초기화
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 최근 조사 기록 */}
      {recentRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>최근 조사 기록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRecords.map((record, index) => (
                <div key={record.id}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">자재: </span>
                      <span className="font-medium">{record.materialCode}</span>
                      <span className="block text-muted-foreground">
                        {record.materialName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">수량: </span>
                      <span className="font-medium">
                        {record.quantity} {record.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">위치: </span>
                      <span className="font-medium">{record.locationName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">조사일시: </span>
                      <span className="text-sm">{record.inspectionDate}</span>
                    </div>
                  </div>
                  {index < recentRecords.length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

InventoryInspection.displayName = "InventoryInspection";
