// ==================== src/components/common/ErrorDisplay.tsx ====================
// 파일 위치: src/components/common/ErrorDisplay.tsx
// 설명: 에러 상태 표시 컴포넌트
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorDisplay = React.memo<ErrorDisplayProps>(
  ({ error, onRetry, title = "오류가 발생했습니다" }) => {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-md">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        )}
      </div>
    );
  }
);

ErrorDisplay.displayName = "ErrorDisplay";
