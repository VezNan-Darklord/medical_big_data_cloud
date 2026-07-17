import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import  AppSidebar  from './AppSidebar'
import { AIPet } from '../components/aidoctor/AIPet'

export function AppShell() {
  return (
    <div className="grid h-screen grid-cols-[264px_minmax(0,1fr)] grid-rows-[80px_minmax(0,1fr)] overflow-hidden bg-[#eef4fb]">
      <AppSidebar />
      <AppHeader />
      <main className="col-start-2 row-start-2 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full p-6">
          <Outlet />
        </div>
      </main>
      <AIPet />
    </div>
  )
}
