import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import { AppShell } from '../layout/AppShell'
import { workspaceConfigs } from '../pages/workspace-config'
import { RoleGuard } from './guards'
import { CUSTOM_ROUTES } from './const'
import { useGetCurrentUserQuery } from '../../api/hooks/authHooks'
import type { User } from '../../api/models/User'

const DashboardPage = lazy(() => import('../components/dashboard/DashboardPage'))
const DecisionAnalysisPage = lazy(() => import('../components/decision/DecisionAnalysisPage'))
const ProfilePage = lazy(() => import('../components/profile/ProfilePage'))
const WorkspacePage = lazy(() => import('../components/common/WorkspacePage'))
import NotFoundPage from '../components/common/NotFoundPage'

const ElderProfilePage = lazy(() => import('../components/elder/ElderProfilePage'))
const ElderlyHealthPage = lazy(() => import('../components/health/ElderlyHealthPage'))

const DoctorElderlyProfilesPage = lazy(() => import('../components/elder/doctorElderlyProfilesPage'))
const DoctorHealthWarningsPage = lazy(() => import('../components/health/doctorHealthWarningsPage'))
const DoctorDevicesPage = lazy(() => import('../components/device/DevicesPage'))
const DoctorKeyPopulationsPage = lazy(() => import('../components/keyPopulation/KeyPopulationsPage'))
const AssessmentReportPage = lazy(() => import('../components/assessmentReport/DoctorAssessmentReportPage'))
const ElderlyAssessmentReportPage = lazy(() => import('../components/assessmentReport/ElderlyAssessmentReportPage'))
const ReportStatisticsPage = lazy(() => import('../components/reportStatistics/ReportStatisticsPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-70 items-center justify-center rounded-[28px] border border-slate-200 bg-white">
      <Spin size="large" />
    </div>
  )
}

function RoleSwitch({
  elderly,
  doctor,
  operator,
  analyst,
  admin,
}: {
  elderly: React.ReactNode
  doctor: React.ReactNode
  operator?: React.ReactNode
  analyst?: React.ReactNode
  admin: React.ReactNode
}) {
  const { data, isLoading } = useGetCurrentUserQuery();
  const user = data?.data as User | undefined
  const role = user?.roleCode ?? ''

  if (isLoading) return <RouteFallback />
  if (role === 'elderly') return <>{elderly}</>
  if (role === 'doctor') return <>{doctor}</>
  if (role === 'operator') return <>{operator ?? <NotFoundPage />}</>
  if (role === 'analyst') return <>{analyst ?? <NotFoundPage />}</>
  if (role === 'admin') return <>{admin}</>
  return <NotFoundPage />
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<RoleGuard />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/decision-analysis" element={<DecisionAnalysisPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/elderly-profiles" element={
              <RoleSwitch elderly={<ElderProfilePage />} doctor={<DoctorElderlyProfilesPage />} operator={<DoctorElderlyProfilesPage />} admin={<DoctorElderlyProfilesPage />} />
            } />
            <Route path="/health-warnings" element={
              <RoleSwitch elderly={<ElderlyHealthPage />} doctor={<DoctorHealthWarningsPage />} operator={<DoctorHealthWarningsPage />} admin={<DoctorHealthWarningsPage />} />
            } />
            <Route path="/devices" element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<DoctorDevicesPage />} operator={<DoctorDevicesPage />} admin={<DoctorDevicesPage />} />
            } />
            <Route path="/key-populations" element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<DoctorKeyPopulationsPage />} operator={<DoctorKeyPopulationsPage />} admin={<DoctorKeyPopulationsPage />} />
            } />
            <Route path="/assessment-reports" element={
              <RoleSwitch elderly={<ElderlyAssessmentReportPage />} doctor={<AssessmentReportPage />} admin={<AssessmentReportPage />} />
            } />
            <Route path="/report-statistics" element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<NotFoundPage />} admin={<ReportStatisticsPage />} />
            } />

            {Object.entries(workspaceConfigs).filter(([p]) => !CUSTOM_ROUTES.has(p)).map(([path, config]) => (
              <Route key={path} path={path} element={<WorkspacePage config={config} />} />
            ))}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
