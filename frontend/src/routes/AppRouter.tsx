import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import { AppShell } from '../layout/AppShell'
import { workspaceConfigs } from '../pages/workspace-config'

// 路由懒加载
const DashboardPage = lazy(() => import('../components/dashboard/DashboardPage'))
const DecisionAnalysisPage = lazy(() => import('../components/decision/DecisionAnalysisPage'))
const ProfilePage = lazy(() => import('../components/profile/ProfilePage'))
const WorkspacePage = lazy(() => import('../components/common/WorkspacePage'))

function RouteFallback() {
  return (
    <div className="flex min-h-70 items-center justify-center rounded-[28px] border border-slate-200 bg-white">
      <Spin size="large" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/decision-analysis" element={<DecisionAnalysisPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {Object.entries(workspaceConfigs).map(([path, config]) => (
            <Route key={path} path={path} element={<WorkspacePage config={config} />} />
          ))}
        </Route>
      </Routes>
    </Suspense>
  )
}
