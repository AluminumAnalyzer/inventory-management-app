// ==================== src/hooks/useImageUpload.ts ====================
// 파일 위치: src/hooks/useImageUpload.ts
// 설명: 이미지 업로드 관리 훅
import { useState, useCallback } from "react";
import { uploadImage } from "@/lib/api";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = useCallback(
    async (
      file: File,
      folderId?: string
    ): Promise<{ url: string; id: string } | null> => {
      setUploading(true);
      setError(null);

      try {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("파일 크기는 5MB 이하여야 합니다.");
        }

        if (!file.type.startsWith("image/")) {
          throw new Error("이미지 파일만 업로드 가능합니다.");
        }

        const base64Data = await fileToBase64(file);
        const fileName = `${Date.now()}_${file.name}`;

        const result = await uploadImage(base64Data, fileName, folderId);

        if (result.success && result.data) {
          return {
            url: result.data.url,
            id: result.data.id,
          };
        } else {
          setError(result.error || "이미지 업로드에 실패했습니다.");
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "이미지 업로드 중 오류가 발생했습니다.";
        setError(errorMessage);
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadFile,
    uploading,
    error,
    resetError,
  };
}
