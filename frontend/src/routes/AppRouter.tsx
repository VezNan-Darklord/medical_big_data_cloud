import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import { AppShell } from '../layout/AppShell'
import { PublicLayout } from '../layout/PublicLayout'
import { RoleGuard } from './guards'
import { useGetCurrentUserQuery } from '../../api/hooks/authHooks'
import type { User } from '../../api/models/User'
import HomePage from '../components/home/HomePage'

const DashboardPage = lazy(() => import('../components/dashboard/DashboardPage'))
const DecisionAnalysisPage = lazy(() => import('../components/decision/DecisionAnalysisPage'))
const ProfilePage = lazy(() => import('../components/profile/ProfilePage'))
import NotFoundPage from '../components/common/NotFoundPage'
import ElderlyAccountPage from '../components/elderlyAccount/ElderlyAccountPage'
import DoctorAccountPage from '../components/doctorAccount/doctorAccountPage'

const ElderProfilePage = lazy(() => import('../components/elderlyProfile/ElderProfilePage'))
const ElderlyHealthPage = lazy(() => import('../components/health/ElderlyHealthPage'))

const DoctorElderlyProfilesPage = lazy(() => import('../components/elderlyProfile/doctorElderlyProfilesPage'))
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
  admin,
}: {
  elderly: React.ReactNode
  doctor: React.ReactNode
  admin: React.ReactNode
}) {
  const { data, isLoading } = useGetCurrentUserQuery()
  const user = data?.data as User | undefined
  const role = user?.roleCode ?? ''

  if (isLoading) return <RouteFallback />
  if (role === 'elderly') return <>{elderly}</>
  if (role === 'doctor') return <>{doctor}</>
  if (role === 'admin') return <>{admin}</>
  return <NotFoundPage />
}

export function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* 公共首页 — 未登录时展示 LandingPage，已登录自动跳转 */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* 已登录后台 */}
        <Route element={<AppShell />}>
          <Route element={<RoleGuard />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/decision-analysis" element={<DecisionAnalysisPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/elderly-profiles" element={
              <RoleSwitch elderly={<ElderProfilePage />} doctor={<DoctorElderlyProfilesPage />} admin={<DoctorElderlyProfilesPage />} />
            } />
            <Route path="/health-warnings" element={
              <RoleSwitch elderly={<ElderlyHealthPage />} doctor={<DoctorHealthWarningsPage />} admin={<DoctorHealthWarningsPage />} />
            } />
            <Route path="/devices" element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<DoctorDevicesPage />} admin={<DoctorDevicesPage />} />
            } />
            <Route path="/key-populations" element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<DoctorKeyPopulationsPage />} admin={<DoctorKeyPopulationsPage />} />
            } />
            <Route path="/assessment-reports" element={
              <RoleSwitch elderly={<ElderlyAssessmentReportPage />} doctor={<AssessmentReportPage />} admin={<AssessmentReportPage />} />
            } />
            <Route path="/report-statistics" element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<NotFoundPage />} admin={<ReportStatisticsPage />} />
            } />
            <Route path='/elderly-accounts' element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<ElderlyAccountPage />} admin={<ElderlyAccountPage />} />
            } />
            <Route path='/doctor-accounts' element={
              <RoleSwitch elderly={<NotFoundPage />} doctor={<NotFoundPage />} admin={<DoctorAccountPage />} />
            } />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
