// ==================== src/components/LocationInfo.tsx ====================
// 파일 위치: src/components/LocationInfo.tsx
// 설명: 위치 정보 관리 메인 컴포넌트
import React, { useState, useCallback, useMemo } from "react";
import { MapPin, Plus } from "lucide-react";
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

import { useLocations, Location } from "@/hooks/useLocations";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";
import { ImageUploadField } from "@/components/common/ImageUploadField";

interface LocationFormData {
  name: string;
  code: string;
  imageUrl: string;
}

const initialFormData: LocationFormData = {
  name: "",
  code: "",
  imageUrl: "",
};

export const LocationInfo = React.memo(() => {
  const {
    locations,
    loading,
    error,
    loadData,
    addLocation,
    updateLocation,
    deleteLocation,
    isCodeDuplicate,
  } = useLocations();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<LocationFormData>(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 필터링
  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations;
    return locations.filter(
      (location) =>
        location.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  // 폼 필드 변경 핸들러
  const handleFormChange = useCallback(
    (field: keyof LocationFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setEditingLocation(null);
  }, []);

  // 위치 추가/수정 처리
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.code || !formData.name) {
        toast.error("입력 오류", {
          description: "위치코드와 위치명을 입력해주세요.",
        });
        return;
      }

      if (isCodeDuplicate(formData.code, editingLocation?.id)) {
        toast.error("코드 중복", {
          description: "이미 존재하는 위치 코드입니다.",
        });
        return;
      }

      setFormLoading(true);

      try {
        if (editingLocation) {
          const result = await updateLocation({
            ...editingLocation,
            ...formData,
          });

          if (result) {
            toast.success("수정 완료", {
              description: "위치 정보가 성공적으로 수정되었습니다.",
            });
            resetForm();
            setShowAddDialog(false);
          }
        } else {
          const result = await addLocation(formData);

          if (result) {
            toast.success("추가 완료", {
              description: "새 위치가 성공적으로 추가되었습니다.",
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
      editingLocation,
      isCodeDuplicate,
      addLocation,
      updateLocation,
      resetForm,
    ]
  );

  // 수정 시작
  const handleEdit = useCallback((location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      code: location.code,
      imageUrl: location.imageUrl || "",
    });
    setShowAddDialog(true);
  }, []);

  // 삭제 처리
  const handleDelete = useCallback(
    async (location: Location) => {
      if (
        !confirm(`${location.code} - ${location.name}을(를) 삭제하시겠습니까?`)
      ) {
        return;
      }

      const success = await deleteLocation(location.id);

      if (success) {
        toast.success("삭제 완료", {
          description: "위치가 성공적으로 삭제되었습니다.",
        });
      } else {
        toast.error("삭제 실패", {
          description: "위치 삭제 중 오류가 발생했습니다.",
        });
      }
    },
    [deleteLocation]
  );

  if (loading) {
    return <LoadingSpinner text="위치 정보를 불러오는 중..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">위치 정보 관리</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              위치 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "위치 정보 수정" : "새 위치 추가"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">위치코드 *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleFormChange("code", e.target.value)}
                    placeholder="LOC001"
                    className="font-mono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">위치명 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="A동 1층"
                    required
                  />
                </div>
              </div>

              <ImageUploadField
                label="위치사진"
                value={formData.imageUrl}
                onChange={(url) => handleFormChange("imageUrl", url)}
                folderId={process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading
                    ? "처리 중..."
                    : editingLocation
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
          placeholder="위치코드 또는 위치명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-4"
        />
      </div>

      {/* 위치 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">
                    {location.code}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {location.name}
                  </p>
                </div>
                {location.imageUrl && (
                  <img
                    src={location.imageUrl}
                    alt={location.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(location)}
                  className="flex-1"
                >
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(location)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "검색 결과가 없습니다." : "등록된 위치가 없습니다."}
        </div>
      )}
    </div>
  );
});

LocationInfo.displayName = "LocationInfo";
