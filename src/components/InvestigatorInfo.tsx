// ==================== src/components/InvestigatorInfo.tsx ====================
// 파일 위치: src/components/InvestigatorInfo.tsx
// 설명: 조사자 정보 관리 메인 컴포넌트
import React, { useState, useCallback } from "react";
import { User, Plus, CheckCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

import { useInvestigators, Investigator } from "@/hooks/useInvestigators";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorDisplay } from "@/components/common/ErrorDisplay";

interface InvestigatorFormData {
  name: string;
}

const initialFormData: InvestigatorFormData = {
  name: "",
};

export const InvestigatorInfo = React.memo(() => {
  const {
    investigators,
    loading,
    error,
    loadData,
    addInvestigator,
    deleteInvestigator,
    getCurrentInvestigator,
    setCurrentInvestigator,
  } = useInvestigators();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] =
    useState<InvestigatorFormData>(initialFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [switchingCurrent, setSwitchingCurrent] = useState<string | null>(null);

  const currentInvestigator = getCurrentInvestigator();

  // 폼 필드 변경 핸들러
  const handleFormChange = useCallback(
    (field: keyof InvestigatorFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 폼 초기화
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  // 조사자 추가 처리
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name.trim()) {
        toast.error("입력 오류", {
          description: "조사자명을 입력해주세요.",
        });
        return;
      }

      const existingInvestigator = investigators.find(
        (inv) => inv.name === formData.name.trim()
      );
      if (existingInvestigator) {
        toast.error("이름 중복", {
          description: "이미 존재하는 조사자명입니다.",
        });
        return;
      }

      setFormLoading(true);

      try {
        const result = await addInvestigator({
          name: formData.name.trim(),
          isCurrent: investigators.length === 0,
          registeredAt: new Date().toISOString(),
        });

        if (result) {
          toast.success("추가 완료", {
            description: "새 조사자가 성공적으로 추가되었습니다.",
          });
          resetForm();
          setShowAddDialog(false);
        }
      } catch (err) {
        toast.error("오류 발생", {
          description: "조사자 추가 중 오류가 발생했습니다. 다시 시도해주세요.",
        });
      } finally {
        setFormLoading(false);
      }
    },
    [formData, investigators, addInvestigator, resetForm]
  );

  // 현재 조사자 설정
  const handleSetCurrent = useCallback(
    async (investigatorId: string) => {
      setSwitchingCurrent(investigatorId);

      try {
        const success = await setCurrentInvestigator(investigatorId);

        if (success) {
          const investigator = investigators.find(
            (inv) => inv.id === investigatorId
          );
          toast.success("설정 완료", {
            description: `${investigator?.name}님이 현재 조사자로 설정되었습니다.`,
          });
        } else {
          toast.error("설정 실패", {
            description: "현재 조사자 설정 중 오류가 발생했습니다.",
          });
        }
      } catch (err) {
        toast.error("오류 발생", {
          description: "현재 조사자 설정 중 오류가 발생했습니다.",
        });
      } finally {
        setSwitchingCurrent(null);
      }
    },
    [investigators, setCurrentInvestigator]
  );

  // 삭제 처리
  const handleDelete = useCallback(
    async (investigator: Investigator) => {
      const isCurrent =
        investigator.isCurrent === true || investigator.isCurrent === "TRUE";
      if (isCurrent) {
        toast.error("삭제 불가", {
          description:
            "현재 조사자는 삭제할 수 없습니다. 다른 조사자를 현재 조사자로 설정한 후 삭제해주세요.",
        });
        return;
      }

      if (!confirm(`${investigator.name}님을 삭제하시겠습니까?`)) {
        return;
      }

      const success = await deleteInvestigator(investigator.id);

      if (success) {
        toast.success("삭제 완료", {
          description: "조사자가 성공적으로 삭제되었습니다.",
        });
      } else {
        toast.error("삭제 실패", {
          description: "조사자 삭제 중 오류가 발생했습니다.",
        });
      }
    },
    [deleteInvestigator]
  );

  if (loading) {
    return <LoadingSpinner text="조사자 정보를 불러오는 중..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* 현재 조사자 표시 */}
      {currentInvestigator && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">현재 조사자:</span>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {currentInvestigator.name}
              </Badge>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              등록일:{" "}
              {new Date(currentInvestigator.registeredAt).toLocaleDateString(
                "ko-KR"
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">조사자 정보 관리</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              조사자 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 조사자 추가</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">조사자명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder="김철수"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? "처리 중..." : "추가"}
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

      {/* 조사자 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investigators.map((investigator) => {
          const isCurrent =
            investigator.isCurrent === true ||
            investigator.isCurrent === "TRUE";

          return (
            <Card
              key={investigator.id}
              className={`hover:shadow-md transition-shadow ${isCurrent ? "ring-2 ring-blue-500" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {investigator.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      등록일:{" "}
                      {new Date(investigator.registeredAt).toLocaleDateString(
                        "ko-KR"
                      )}
                    </p>
                  </div>
                  <Badge variant={isCurrent ? "default" : "secondary"}>
                    {isCurrent ? "현재 조사자" : "대기"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  {!isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetCurrent(investigator.id)}
                      disabled={switchingCurrent === investigator.id}
                      className="flex-1"
                    >
                      {switchingCurrent === investigator.id ? (
                        "변경 중..."
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          설정
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(investigator)}
                    disabled={isCurrent}
                    className={`${isCurrent ? "flex-1" : "flex-1"} text-red-600 hover:text-red-700 disabled:text-gray-400`}
                  >
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {investigators.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          등록된 조사자가 없습니다.
        </div>
      )}
    </div>
  );
});

InvestigatorInfo.displayName = "InvestigatorInfo";
