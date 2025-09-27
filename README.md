# 자재 재고 조사 웹앱 - 완전한 프로젝트 가이드

## 📋 프로젝트 개요

## 🎯 주요 기능

- 자재 정보 관리 - 자재 마스터 데이터 CRUD
- 위치 정보 관리 - 보관 위치 마스터 데이터 CRUD
- 조사자 정보 관리 - 조사자 등록 및 현재 조사자 설정
- 재고 조사 입력 - 실시간 재고 조사 데이터 입력
- 이미지 관리 - 구글 드라이브 연동 이미지 업로드
- 오프라인 지원 - PWA 기능으로 오프라인 작업 가능

🏗️ 기술 아키텍처

┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Next.js App │───▶│ Google Apps │───▶│ Google Sheets │
│ (CloudFlare) │ │ Script API │ │ (Database) │
└─────────────────┘ └──────────────────┘ └─────────────────┘
│ │ │
▼ ▼ ▼
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ PWA Cache │ │ Image Upload │ │ Google Drive │
│ (Offline) │ │ Processing │ │ (File Storage) │
└─────────────────┘ └──────────────────┘ └─────────────────┘
📁 전체 파일 구조
inventory-management-app/
├── public/
│ ├── icons/ # PWA 아이콘들
│ ├── manifest.json # PWA 매니페스트
│ └── sw.js # 서비스 워커
├── src/
│ ├── app/
│ │ ├── globals.css # 전역 스타일
│ │ ├── layout.tsx # 루트 레이아웃
│ │ └── page.tsx # 메인 페이지
│ ├── components/
│ │ ├── common/ # 공통 컴포넌트
│ │ │ ├── LoadingSpinner.tsx
│ │ │ ├── ErrorDisplay.tsx
│ │ │ ├── ImageUploadField.tsx
│ │ │ ├── SearchableSelect.tsx
│ │ │ ├── DataTable.tsx
│ │ │ ├── FormCard.tsx
│ │ │ ├── StatusIndicator.tsx
│ │ │ ├── ErrorBoundary.tsx
│ │ │ ├── VirtualizedList.tsx
│ │ │ ├── ConfirmDialog.tsx
│ │ │ ├── AccessibilityProvider.tsx
│ │ │ └── PWAInstallPrompt.tsx
│ │ ├── ui/ # shadcn/ui 컴포넌트
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ ├── table.tsx
│ │ │ ├── tabs.tsx
│ │ │ ├── toast.tsx
│ │ │ ├── toaster.tsx
│ │ │ ├── popover.tsx
│ │ │ ├── command.tsx
│ │ │ ├── badge.tsx
│ │ │ ├── separator.tsx
│ │ │ └── use-toast.ts
│ │ ├── MaterialInfo.tsx # 자재 정보 관리
│ │ ├── LocationInfo.tsx # 위치 정보 관리
│ │ ├── InvestigatorInfo.tsx # 조사자 정보 관리
│ │ └── InventoryInspection.tsx # 재고 조사 입력
│ ├── hooks/ # 커스텀 훅
│ │ ├── useApi.ts # 기본 API 훅
│ │ ├── useMaterials.ts # 자재 데이터 훅
│ │ ├── useLocations.ts # 위치 데이터 훅
│ │ ├── useInvestigators.ts # 조사자 데이터 훅
│ │ ├── useInspectionRecords.ts # 조사 기록 훅
│ │ ├── useImageUpload.ts # 이미지 업로드 훅
│ │ ├── useLocalStorage.ts # 로컬 스토리지 훅
│ │ ├── useOfflineSync.ts # 오프라인 동기화 훅
│ │ ├── useConfirm.ts # 확인 다이얼로그 훅
│ │ ├── useIntersectionObserver.ts # 무한 스크롤 훅
│ │ ├── useKeyboardShortcuts.ts # 키보드 단축키 훅
│ │ └── usePerformanceMonitor.ts # 성능 모니터링 훅
│ ├── lib/
│ │ ├── api.ts # API 호출 유틸리티
│ │ └── utils.ts # 공통 유틸리티 함수
│ ├── utils/
│ │ ├── imageUtils.ts # 이미지 처리 유틸리티
│ │ └── performance.ts # 성능 유틸리티
│ └── constants/
│ └── app.ts # 앱 상수 정의
├── **tests**/ # 테스트 파일
│ ├── components/
│ ├── hooks/
│ └── utils/
├── google-apps-script/ # GAS 코드
│ └── main.js
├── .env.local # 환경 변수
├── .env.example # 환경 변수 예시
├── next.config.js # Next.js 설정
├── tailwind.config.ts # Tailwind 설정
├── tsconfig.json # TypeScript 설정
├── package.json # 의존성 및 스크립트
├── jest.config.js # Jest 설정
├── jest.setup.js # Jest 설정 파일
├── .eslintrc.json # ESLint 설정
├── .prettierrc # Prettier 설정
├── wrangler.toml # CloudFlare 설정
└── README.md # 프로젝트 문서

## 🚀 자재 재고 조사 웹앱 - 완전한 설치 가이드

### 📋 프로젝트 완성 상태

✅ **모든 핵심 기능이 완성되었습니다!**

### 🎯 완성된 기능들

- ✅ **자재 정보 관리** - CRUD, 이미지 업로드, 검색
- ✅ **위치 정보 관리** - CRUD, 이미지 업로드, 검색
- ✅ **조사자 정보 관리** - 등록, 현재 조사자 설정
- ✅ **재고 조사 입력** - 실시간 입력, 자동 기록, 최근 기록 표시
- ✅ **구글 시트 연동** - 실시간 데이터 동기화
- ✅ **구글 드라이브 연동** - 이미지 업로드 및 관리
- ✅ **PWA 지원** - 오프라인 작업, 홈 화면 설치
- ✅ **모바일 최적화** - 반응형 디자인, 터치 최적화
- ✅ **접근성 지원** - 키보드 탐색, 스크린 리더 지원

### 🏗️ 기술 스택

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Storage**: Google Drive
- **Hosting**: CloudFlare Pages

## 🛠️ 단계별 설치 가이드

### 1단계: 프로젝트 생성 및 설정

```bash
# 1. Next.js 프로젝트 생성
npx create-next-app@latest inventory-management-app --typescript --tailwind --eslint
cd inventory-management-app

# 2. 의존성 설치
npm install @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-select @radix-ui/react-separator
npm install lucide-react clsx tailwind-merge class-variance-authority
npm install cmdk react-hook-form

# 3. 개발 의존성 설치
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jest jest-environment-jsdom @types/react
npm install -D prettier eslint-config-prettier

# 4. 프로젝트 구조 생성
mkdir -p src/{components/{common,ui},hooks,lib,utils,constants,types}
mkdir -p public/icons
mkdir -p google-apps-script
```

### 2단계: 프로젝트 파일 구성

아래 파일들을 순서대로 생성하세요:

#### 📁 핵심 설정 파일들

1. **package.json** - 의존성 및 스크립트 설정
2. **next.config.js** - Next.js 설정
3. **tailwind.config.ts** - Tailwind CSS 설정
4. **.env.local** - 환경 변수 설정

#### 📁 타입 정의 및 유틸리티

5. **src/types/index.ts** - 타입 정의
6. **src/lib/utils.ts** - 공통 유틸리티
7. **src/lib/api.ts** - API 호출 함수
8. **src/constants/app.ts** - 앱 상수

#### 📁 커스텀 훅들

9. **src/hooks/useApi.ts** - 기본 API 훅
10. **src/hooks/useMaterials.ts** - 자재 데이터 훅
11. **src/hooks/useLocations.ts** - 위치 데이터 훅
12. **src/hooks/useInvestigators.ts** - 조사자 데이터 훅
13. **src/hooks/useInspectionRecords.ts** - 재고 조사 기록 훅
14. **src/hooks/useImageUpload.ts** - 이미지 업로드 훅

#### 📁 공통 컴포넌트들

15. **src/components/common/LoadingSpinner.tsx**
16. **src/components/common/ErrorDisplay.tsx**
17. **src/components/common/ImageUploadField.tsx**
18. **src/components/common/SearchableSelect.tsx**

#### 📁 UI 컴포넌트들 (shadcn/ui)

19. **src/components/ui/** 폴더에 shadcn/ui 컴포넌트들 설치:

```bash
# shadcn/ui 초기화
npx shadcn-ui@latest init

# 필요한 컴포넌트들 설치
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add command
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
```

#### 📁 메인 기능 컴포넌트들

20. **src/components/MaterialInfo.tsx** - 자재 정보 관리
21. **src/components/LocationInfo.tsx** - 위치 정보 관리
22. **src/components/InvestigatorInfo.tsx** - 조사자 정보 관리
23. **src/components/InventoryInspection.tsx** - 재고 조사 입력

#### 📁 앱 메인 파일들

24. **src/app/layout.tsx** - 루트 레이아웃
25. **src/app/page.tsx** - 메인 App 컴포넌트
26. **src/app/globals.css** - 전역 스타일

#### 📁 PWA 설정 파일들

27. **public/manifest.json** - PWA 매니페스트
28. **public/sw.js** - 서비스 워커
29. **public/icons/** - PWA 아이콘들 (72x72부터 512x512까지)

### 3단계: 구글 서비스 설정

#### 🔗 구글 시트 설정

1. **새 구글 시트 생성**: `자재재고조사_데이터`

2. **시트 탭 생성 및 헤더 설정**:

**Materials 시트**:

```
A1: id | B1: code | C1: name | D1: specification | E1: unit | F1: imageUrl | G1: createdAt
```

**Locations 시트**:

```
A1: id | B1: name | C1: code | D1: imageUrl | E1: createdAt
```

**Investigators 시트**:

```
A1: id | B1: name | C1: registeredAt
```

**InspectionRecords 시트**:

```
A1: id | B1: materialId | C1: materialCode | D1: materialName | E1: unit | F1: quantity
G1: locationId | H1: locationName | I1: investigatorName | J1: inspectionDate | K1: createdAt
```

3. **시트 ID 복사**: URL의 `/d/` 와 `/edit` 사이 부분

#### 📁 구글 드라이브 설정

1. **폴더 생성**: "자재재고조사\_이미지"
2. **하위 폴더**: `materials/`, `locations/`
3. **공유 설정**: "링크가 있는 모든 사용자가 볼 수 있음"
4. **폴더 ID 복사**: 폴더 URL의 마지막 부분

#### ⚙️ Google Apps Script 설정

1. **새 GAS 프로젝트 생성**: [script.google.com](https://script.google.com)
2. **코드 복사**: 제공된 `google-apps-script/main.js` 코드 붙여넣기
3. **SPREADSHEET_ID 수정**: 실제 시트 ID로 변경
4. **배포**:
   - 배포 → 새 배포
   - 유형: 웹 앱
   - 실행: 나
   - 액세스: 모든 사용자
5. **배포 URL 복사**

### 4단계: 환경 변수 설정

**.env.local** 파일 생성:

```bash
NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_DRIVE_FOLDER_ID=YOUR_DRIVE_FOLDER_ID
NEXT_PUBLIC_APP_NAME=자재 재고 조사 시스템
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 5단계: 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

### 6단계: 기능 테스트

#### ✅ 테스트 순서

1. **조사자 추가**: 조사자 정보 탭에서 조사자 등록
2. **자재 추가**: 자재 정보 탭에서 자재 등록 (이미지 포함)
3. **위치 추가**: 위치 정보 탭에서 위치 등록 (이미지 포함)
4. **재고 조사**: 재고 조사 탭에서 실제 조사 입력
5. **데이터 확인**: 구글 시트에서 데이터 확인

### 7단계: CloudFlare Pages 배포

#### 🌐 배포 준비

```bash
# 프로덕션 빌드 테스트
npm run build

# 결과물 확인
ls -la out/
```

#### ☁️ CloudFlare 설정

1. **CloudFlare Pages 접속**
2. **GitHub 저장소 연결**
3. **빌드 설정**:
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`

4. **환경 변수 설정**:
   - `NEXT_PUBLIC_GAS_URL`
   - `NEXT_PUBLIC_DRIVE_FOLDER_ID`
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_APP_VERSION`

5. **배포 및 확인**

## 🎯 주요 기능 사용법

### 📋 기본 워크플로우

1. **초기 설정**:
   - 조사자 등록 → 현재 조사자 설정
   - 자재 정보 등록 (코드, 명칭, 규격, 단위, 형상도)
   - 위치 정보 등록 (코드, 명칭, 위치사진)

2. **재고 조사**:
   - 자재 선택 (검색 가능)
   - 수량 입력
   - 위치 선택
   - 자동 조사일시 기록
   - 제출 후 폼 자동 초기화

3. **데이터 관리**:
   - 실시간 구글 시트 동기화
   - 이미지는 구글 드라이브에 자동 저장
   - 검색 및 필터링 기능
   - 수정/삭제 기능

### 🔧 고급 기능

- **키보드 단축키**: Ctrl+1~4로 탭 전환
- **오프라인 작업**: PWA로 네트워크 없이도 작업 가능
- **모바일 최적화**: 터치 인터페이스, 카메라 촬영
- **접근성**: 키보드 탐색, 스크린 리더 지원

## 🐛 문제 해결

### 자주 발생하는 문제들

1. **구글 시트 연결 오류**:
   - GAS 배포 URL 확인
   - CORS 설정 확인
   - 시트 이름 정확성 확인

2. **이미지 업로드 실패**:
   - 구글 드라이브 폴더 공유 설정
   - 파일 크기 제한 (5MB)
   - 지원 형식 확인 (JPG, PNG, GIF, WebP)

3. **빌드 오류**:
   - Node.js 버전 확인 (18+ 권장)
   - 의존성 재설치: `rm -rf node_modules && npm install`
   - 타입 오류 확인: `npm run type-check`

### 🔍 디버깅 팁

```bash
# 개발 도구 확인
# 1. 브라우저 Console 확인
# 2. Network 탭에서 API 호출 확인
# 3. Application 탭에서 PWA 상태 확인

# 로그 확인
npm run dev # 개발 서버 로그
```

## 🚀 성공적인 배포 완료!

모든 단계를 완료하면 다음과 같은 완전한 웹앱이 완성됩니다:

### ✨ 최종 결과물

- 📱 **모바일 친화적** 자재 재고 조사 시스템
- ☁️ **클라우드 기반** 실시간 데이터 동기화
- 🔄 **오프라인 지원** PWA 애플리케이션
- 🎨 **모던 UI/UX** 디자인
- ♿ **접근성 준수** 웹 표준
- 🔒 **안전한 데이터** 구글 서비스 연동

### 🎉 축하합니다!

이제 완전히 기능하는 자재 재고 조사 웹앱을 사용할 수 있습니다!

**추가 도움이 필요하시면 언제든 문의해주세요.** 🤝

---

### 📞 지원 및 문의

- 🐛 **버그 리포트**: 개발자 도구 콘솔 로그와 함께 문의
- 💡 **기능 제안**: 구체적인 요구사항과 함께 문의
- 🔧 **커스터마이징**: 특별한 요구사항 문의
- 📚 **교육 및 트레이닝**: 사용법 및 유지보수 교육

**Happy Coding! 🎯**
