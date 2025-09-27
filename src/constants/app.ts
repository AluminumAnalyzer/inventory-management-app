/*
================================================================================  
📁 SRC/CONSTANTS - 상수 정의 파일들
================================================================================
*/

// ==================== src/constants/app.ts ====================
// 파일 위치: src/constants/app.ts
// 설명: 앱 전체 상수 정의

export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || "자재 재고 조사 시스템",
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

  API: {
    GAS_URL: process.env.NEXT_PUBLIC_GAS_URL || "",
    DRIVE_FOLDER_ID: process.env.NEXT_PUBLIC_DRIVE_FOLDER_ID || "",
    TIMEOUT: 30000,
  },

  UI: {
    ITEMS_PER_PAGE: 20,
    SEARCH_DEBOUNCE: 300,
    TOAST_DURATION: 5000,
    MAX_FILE_SIZE: 5 * 1024 * 1024,
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK: "네트워크 연결을 확인해주세요.",
  VALIDATION: "입력값을 확인해주세요.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다.",
  INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다.",
  DUPLICATE: "중복된 데이터입니다.",
  REQUIRED_FIELD: "필수 항목을 입력해주세요.",
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: "성공적으로 생성되었습니다.",
  UPDATED: "성공적으로 수정되었습니다.",
  DELETED: "성공적으로 삭제되었습니다.",
  UPLOADED: "파일이 업로드되었습니다.",
} as const;
