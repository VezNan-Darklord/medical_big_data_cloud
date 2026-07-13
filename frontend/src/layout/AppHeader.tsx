import { Avatar, Badge, Button, Input } from 'antd'
import { BellOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import { useUserContext } from '../userContext'

export function AppHeader() {
  const userContext = useUserContext();

  return (
    <header className="flex h-20 items-center justify-start border-b border-slate-200/80 bg-white/75 px-6 backdrop-blur">
      <Input prefix={<SearchOutlined className="text-slate-400" />} placeholder="搜索老人、设备、报告" className="flex-1/2 rounded-xl" />
      <div className="flex items-center gap-3 ml-3">
        <Button icon={<CalendarOutlined />} className="rounded-xl">今日</Button>
        <Badge count={6}><Button shape="circle" icon={<BellOutlined />} /></Badge>
        {userContext.isLoggedIn ?
          <Avatar size={40} className="bg-cyan-600">管</Avatar> :
          <Button type="primary" onClick={()=>{}}>登录</Button>}
      </div>
    </header>
  )
}
