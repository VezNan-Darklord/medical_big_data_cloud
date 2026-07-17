import { Outlet } from 'react-router-dom'
import { AppHeader } from '../layout/AppHeader'
import { AIPet } from '../components/aidoctor/AIPet'

export function PublicLayout() {
  return (
    <div className="grid h-screen grid-rows-[80px_minmax(0,1fr)] overflow-hidden bg-[#eef4fb]">
      <AppHeader />
      <main className="min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
      <AIPet />
    </div>
  )
}
