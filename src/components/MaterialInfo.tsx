/*
================================================================================
📁 SRC/COMPONENTS - 메인 기능 컴포넌트 파일들
================================================================================
*/

// ==================== src/components/MaterialInfo.tsx ====================
// 파일 위치: src/components/MaterialInfo.tsx
// 설명: 자재 정보 관리 메인 컴포넌트
import React, { useState, useCallback, useMemo } from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

import { useMaterials, Material } from "@/hooks/useMaterials";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { ImageUploadField } from "@/components/common/ImageUploadField";

interface MaterialFormData {
  code: string;
  name: string;
  specification: string;
  unit: string;
  imageUrl: string;
}

const initialFormData: MaterialFormData = {
  code: "",
  name: "",
  specification: "",
  unit: "",
  imageUrl: "",
};

export const MaterialInfo = React.memo(() => {
  const {
    materials,
    loading,
    error,
    loadData,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    isCodeDuplicate,
  } = useMaterials();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState<MaterialFormData>(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 필터링
  const filteredMaterials = useMemo(() => {
    if (!searchTerm) return materials;
    return materials.filter(
      (material) =>
        material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.specification.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materials, searchTerm]);

  // 폼 필드 변경 핸들러
  const handleFormChange = useCallback(
    (field: keyof MaterialFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setEditingMaterial(null);
  }, []);

  // 자재 추가/수정 처리
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !formData.code ||
        !formData.name ||
        !formData.specification ||
        !formData.unit
      ) {
        toast.error("입력 오류", {
          description: "모든 필수 항목을 입력해주세요.",
        });
        return;
      }

      if (isCodeDuplicate(formData.code, editingMaterial?.id)) {
        toast.error("코드 중복", {
          description: "이미 존재하는 자재 코드입니다.",
        });
        return;
      }

      setFormLoading(true);

      try {
        if (editingMaterial) {
          const result = await updateMaterial({
            ...editingMaterial,
            ...formData,
          });

          if (result) {
            toast.success("수정 완료", {
              description: "자재 정보가 성공적으로 수정되었습니다.",
            });
            resetForm();
            setShowAddDialog(false);
          }
        } else {
          const result = await addMaterial(formData);

          if (result) {
            toast.success("추가 완료", {
              description: "새 자재가 성공적으로 추가되었습니다.",
            });
            resetForm();
            setShowAddDialog(false);
          }
        }
      } catch (err) {
        toast.error("오류 발생", {
          description: "작업 중 오류가 발생했습니다. 다시 시도해주세요.",
        });
      } finally {
        setFormLoading(false);
      }
    },
    [
      formData,
      editingMaterial,
      isCodeDuplicate,
      addMaterial,
      updateMaterial,
      resetForm,
    ]
  );

  // 수정 시작
  const handleEdit = useCallback((material: Material) => {
    setEditingMaterial(material);
    setFormData({
      code: material.code,
      name: material.name,
      specification: material.specification,
      unit: material.unit,
      imageUrl: material.imageUrl || "",
    });
    setShowAddDialog(true);
  }, []);

  // 삭제 처리
  const handleDelete = useCallback(
    async (material: Material) => {
      if (
        !confirm(`${material.code} - ${material.name}을(를) 삭제하시겠습니까?`)
      ) {
        return;
      }

      const success = await deleteMaterial(material.id);

      if (success) {
        toast.success("삭제 완료", {
          description: "자재가 성공적으로 삭제되었습니다.",
        });
      } else {
        toast.error("삭제 실패", {
          description: "자재 삭제 중 오류가 발생했습니다.",
        });
      }
    },
    [deleteMaterial]
  );

  if (loading) {
    return <LoadingSpinner text="자재 정보를 불러오는 중..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">자재 정보 관리</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              자재 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? "자재 정보 수정" : "새 자재 추가"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">자재코드 *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleFormChange("code", e.target.value)}
                    placeholder="MAT001"
                    className="font-mono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">자재명 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="H형강"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specification">규격 *</Label>
                  <Input
                    id="specification"
                    value={formData.specification}
                    onChange={(e) =>
                      handleFormChange("specification", e.target.value)
                    }
                    placeholder="200x100x8x12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">단위 *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleFormChange("unit", e.target.value)}
                    placeholder="EA, KG, M 등"
                    required
                  />
                </div>
              </div>

              <ImageUploadField
                label="형상도"
                value={formData.imageUrl}
                onChange={(url) => handleFormChange("imageUrl", url)}
                folderId={process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading
                    ? "처리 중..."
                    : editingMaterial
                      ? "수정"
                      : "추가"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    resetForm();
                  }}
                  disabled={formLoading}
                >
                  취소
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 */}
      <div className="relative">
        <Input
          placeholder="자재코드, 자재명, 규격으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4"
        />
      </div>

      {/* 자재 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">
                    {material.code}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {material.name}
                  </p>
                </div>
                {material.imageUrl && (
                  <img
                    src={material.imageUrl}
                    alt={material.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">규격: </span>
                  <span className="text-sm">{material.specification}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">단위: </span>
                  <span className="text-sm font-medium">{material.unit}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(material)}
                  className="flex-1"
                >
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(material)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "검색 결과가 없습니다." : "등록된 자재가 없습니다."}
        </div>
      )}
    </div>
  );
});

MaterialInfo.displayName = "MaterialInfo";
