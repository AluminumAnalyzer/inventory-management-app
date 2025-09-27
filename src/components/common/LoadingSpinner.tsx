/*
================================================================================
📁 SRC/COMPONENTS/COMMON - 공통 컴포넌트 파일들
================================================================================
*/

// ==================== src/components/common/LoadingSpinner.tsx ====================
// 파일 위치: src/components/common/LoadingSpinner.tsx
// 설명: 로딩 상태 표시 컴포넌트
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const LoadingSpinner = React.memo<LoadingSpinnerProps>(
  ({ size = "md", text = "로딩 중...", className }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    };

    return (
      <div
        className={cn("flex items-center justify-center gap-2 p-4", className)}
      >
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        <span className="text-muted-foreground">{text}</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";
