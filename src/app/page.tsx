// 파일 위치: src/app/page.tsx
// 설명: Next.js 메인 페이지 컴포넌트
import React, { useState, useCallback, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  MapPin,
  User,
  ClipboardList,
  ClipboardCheck,
  Settings,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";

// 컴포넌트 동적 임포트 (코드 스플리팅)
const MaterialInfo = React.lazy(() =>
  import("@/components/MaterialInfo").then((module) => ({
    default: module.MaterialInfo,
  }))
);
const LocationInfo = React.lazy(() =>
  import("@/components/LocationInfo").then((module) => ({
    default: module.LocationInfo,
  }))
);
const InvestigatorInfo = React.lazy(() =>
  import("@/components/InvestigatorInfo").then((module) => ({
    default: module.InvestigatorInfo,
  }))
);
const InventoryInspection = React.lazy(() =>
  import("@/components/InventoryInspection").then((module) => ({
    default: module.InventoryInspection,
  }))
);

// 공통 컴포넌트
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

// 탭 설정 타입
interface TabConfig {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  description: string;
}

// 탭 설정
const TAB_CONFIGS: TabConfig[] = [
  {
    value: "inspection",
    label: "재고 조사",
    icon: ClipboardCheck,
    component: InventoryInspection,
    description: "자재 재고 조사 입력 및 기록 관리",
  },
  {
    value: "materials",
    label: "자재 정보",
    icon: Package,
    component: MaterialInfo,
    description: "자재 마스터 데이터 관리",
  },
  {
    value: "locations",
    label: "위치 정보",
    icon: MapPin,
    component: LocationInfo,
    description: "보관 위치 마스터 데이터 관리",
  },
  {
    value: "investigators",
    label: "조사자 정보",
    icon: User,
    component: InvestigatorInfo,
    description: "조사자 등록 및 현재 조사자 설정",
  },
];

// 상태 표시 컴포넌트
const StatusIndicator = React.memo(() => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <Badge
      variant={isOnline ? "default" : "secondary"}
      className="flex items-center gap-1"
    >
      {isOnline ? (
        <Wifi className="h-3 w-3" />
      ) : (
        <WifiOff className="h-3 w-3" />
      )}
      {isOnline ? "온라인" : "오프라인"}
    </Badge>
  );
});

StatusIndicator.displayName = "StatusIndicator";

// 탭 컴포넌트
const TabComponent = React.memo<{ config: TabConfig; isActive: boolean }>(
  ({ config, isActive }) => {
    const { component: Component } = config;

    if (!isActive) return null;

    return (
      <Suspense
        fallback={<LoadingSpinner text={`${config.label} 로딩 중...`} />}
      >
        <Component />
      </Suspense>
    );
  }
);

TabComponent.displayName = "TabComponent";

// 헤더 컴포넌트
const AppHeader = React.memo(() => {
  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              {process.env.NEXT_PUBLIC_APP_NAME || "자재 재고 조사 시스템"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              구글 시트 연동 자재 관리 웹 애플리케이션
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusIndicator />
            <div className="text-xs text-muted-foreground">
              v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
});

AppHeader.displayName = "AppHeader";

// 탭 리스트 컴포넌트
const AppTabsList = React.memo<{
  configs: TabConfig[];
  activeTab: string;
  onTabChange: (value: string) => void;
}>(({ configs, activeTab, onTabChange }) => {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto p-1">
      {configs.map((config) => {
        const Icon = config.icon;
        const isActive = activeTab === config.value;

        return (
          <TabsTrigger
            key={config.value}
            value={config.value}
            className="flex flex-col items-center gap-2 py-3 px-2 h-auto data-[state=active]:bg-white data-[state=active]:shadow-sm"
            onClick={() => onTabChange(config.value)}
          >
            <Icon
              className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-muted-foreground"}`}
            />
            <span className="text-sm font-medium">{config.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
});

AppTabsList.displayName = "AppTabsList";

// 푸터 컴포넌트
const AppFooter = React.memo(() => {
  return (
    <Card className="mt-8 shadow-sm">
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Google Apps Script 연동
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              CloudFlare Pages 호스팅
            </div>
          </div>
          <div className="text-center">
            <p>실시간 데이터 동기화 지원 • 오프라인 작업 가능</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AppFooter.displayName = "AppFooter";

// 메인 App 컴포넌트
export default function App() {
  const [activeTab, setActiveTab] = useState("inspection");

  // 탭 변경 핸들러
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // 키보드 단축키 처리
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + 숫자 키로 탭 전환
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key >= "1" &&
        event.key <= "4"
      ) {
        event.preventDefault();
        const tabIndex = parseInt(event.key) - 1;
        if (TAB_CONFIGS[tabIndex]) {
          setActiveTab(TAB_CONFIGS[tabIndex].value);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* 헤더 */}
        <AppHeader />

        {/* 메인 탭 컨텐츠 */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {/* 탭 리스트 */}
          <AppTabsList
            configs={TAB_CONFIGS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* 탭 컨텐츠 */}
          {TAB_CONFIGS.map((config) => (
            <TabsContent
              key={config.value}
              value={config.value}
              className="space-y-4 focus-visible:outline-none"
            >
              <TabComponent
                config={config}
                isActive={activeTab === config.value}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* 푸터 */}
        <AppFooter />
      </div>

      {/* 토스트 알림 */}
    </div>
  );
}
