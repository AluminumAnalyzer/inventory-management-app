// ==================== src/components/common/ImageUploadField.tsx ====================
// 파일 위치: src/components/common/ImageUploadField.tsx
// 설명: 이미지 업로드 필드 컴포넌트
import React, { useCallback, useState } from "react";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (imageUrl: string) => void;
  onError?: (error: string) => void;
  folderId?: string;
  className?: string;
  required?: boolean;
}

export const ImageUploadField = React.memo<ImageUploadFieldProps>(
  ({
    label,
    value,
    onChange,
    onError,
    folderId,
    className,
    required = false,
  }) => {
    const { uploadFile, uploading, error } = useImageUpload();
    const [previewUrl, setPreviewUrl] = useState<string>(value || "");

    const handleFileSelect = useCallback(
      async (file: File) => {
        try {
          const localPreview = URL.createObjectURL(file);
          setPreviewUrl(localPreview);

          const result = await uploadFile(file, folderId);

          if (result) {
            onChange(result.url);
            URL.revokeObjectURL(localPreview);
            setPreviewUrl(result.url);
          } else {
            setPreviewUrl(value || "");
            URL.revokeObjectURL(localPreview);
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "업로드 중 오류가 발생했습니다.";
          onError?.(errorMessage);
          setPreviewUrl(value || "");
        }
      },
      [uploadFile, onChange, onError, folderId, value]
    );

    const handleRemoveImage = useCallback(() => {
      onChange("");
      setPreviewUrl("");
    }, [onChange]);

    return (
      <div className={cn("space-y-2", className)}>
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

        <div className="flex items-start gap-4">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="미리보기"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }}
            >
              <Upload className="h-4 w-4 mr-1" />
              {uploading ? "업로드 중..." : "파일 선택"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.capture = "environment";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }}
            >
              <Camera className="h-4 w-4 mr-1" />
              촬영
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

ImageUploadField.displayName = "ImageUploadField";
