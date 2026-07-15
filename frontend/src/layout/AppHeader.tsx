import { useState } from 'react'
import { Button, Input, Form, message, Avatar, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { CalendarOutlined, SearchOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { useUserContext } from '../store/userContext'
import { useLoginMutation, useRegisterMutation, useGetCurrentUserQuery, useLogoutMutation } from '../../api/hooks/authHooks'
import { PopWindow } from '../components/common'
import { useQueryClient } from '@tanstack/react-query'


function LoginModal({ open, onClose, onLoginSuccess, onSwitchToRegister }: { open: boolean; onClose: () => void; onLoginSuccess: (token: string) => void; onSwitchToRegister: () => void }) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const loginMutation = useLoginMutation()

  const handleSubmit = async (values: { username: string; password: string }) => {
      await loginMutation.mutateAsync({ username: values.username, password: values.password },
        {
          onSuccess: (res) => {
            const token = res.data?.token;
            if (token) {
              onLoginSuccess(token)
              message.success('登录成功')
              queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] })
              onClose()
              form.resetFields()
            }
          },
          onError: (error) => {
            message.error(error?.message ?? '登录失败，请检查用户名和密码')
          }
        }
      )
  }

  return (
    <PopWindow open={open} onClose={onClose} title="登录" width={400}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" size="large" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="请输入密码" size="large" />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button type="primary" htmlType="submit" loading={loginMutation.isPending} block size="large">
            登录
          </Button>
        </Form.Item>
      </Form>
      <div className="mt-4 text-center text-sm text-slate-500">
        还没有账号？<button type="button" onClick={onSwitchToRegister} className="text-cyan-600 hover:underline">立即注册</button>
      </div>
    </PopWindow>
  )
}

function RegisterModal({ open, onClose, onRegisterSuccess, onSwitchToLogin }: { open: boolean; onClose: () => void; onRegisterSuccess: (token: string) => void; onSwitchToLogin: () => void }) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const registerMutation = useRegisterMutation()

  const handleSubmit = async (values: { username: string; password: string; realName: string; mobile: string }) => {
      await registerMutation.mutateAsync({
        username: values.username,
        password: values.password,
        realName: values.realName,
        mobile: values.mobile,
      }, {
        onSuccess: (data) => {
          message.success('注册成功')
          onClose()
          form.resetFields()
          onRegisterSuccess(data.data!.token!);
          queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] });
        },
        onError: (error) => {
          message.error(error?.message ?? '注册失败，请稍后重试')
        }
      })
  }

  return (
    <PopWindow open={open} onClose={onClose} title="注册老人账号" width={440}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" size="large" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, min: 6, message: '密码至少 6 位' }]}>
          <Input.Password placeholder="请输入密码" size="large" />
        </Form.Item>
        <Form.Item name="realName" label="真实姓名" rules={[{ required: true, message: '请输入真实姓名' }]}>
          <Input placeholder="请输入真实姓名" size="large" />
        </Form.Item>
        <Form.Item name="mobile" label="手机号" rules={[{ required: true, message: '请输入手机号' }]}>
          <Input placeholder="请输入手机号" size="large" />
        </Form.Item>
        <div className="-mt-2 mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          当前仅开放老人账号注册，管理员与医生账号需由系统管理员创建。
        </div>
        <Form.Item className="mb-0">
          <Button type="primary" htmlType="submit" loading={registerMutation.isPending} block size="large">
            注册
          </Button>
        </Form.Item>
      </Form>
      <div className="mt-4 text-center text-sm text-slate-500">
        已有账号？<button type="button" onClick={onSwitchToLogin} className="text-cyan-600 hover:underline">去登录</button>
      </div>
    </PopWindow>
  )
}


export function AppHeader() {
  const { isLoggedIn, setAuth, clearAuth } = useUserContext()

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: currentUserData } = useGetCurrentUserQuery();
  const { mutate: logout } = useLogoutMutation();

  const currentUser = currentUserData?.data;
  const displayName = currentUser?.realName ?? '未登录';

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <SettingOutlined />, label: '个人中心' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ]

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    setUserMenuOpen(false)
    if (key === 'logout') {
      logout()
      clearAuth()
      message.success('已退出登录');
      queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] });
    }
  };

  return (
    <header className="flex h-20 items-center justify-start border-b border-slate-200/80 bg-white/75 px-6 backdrop-blur">
      <Input prefix={<SearchOutlined className="text-slate-400" />} placeholder="搜索老人、设备、报告" className="flex-1/2 rounded-xl" />
      <div className="ml-3 flex items-center gap-3">
        <Button icon={<CalendarOutlined />} className="rounded-xl">今日</Button>

        {isLoggedIn ? (
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            open={userMenuOpen}
            onOpenChange={setUserMenuOpen}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-1.5 transition hover:bg-slate-50">
              <Avatar size={36} className="bg-cyan-600" icon={<UserOutlined />}>
                {displayName.slice(0, 1)}
              </Avatar>
              <div className="hidden text-sm font-medium text-slate-700 sm:block">{displayName}</div>
            </div>
          </Dropdown>
        ) : (
          <div className="flex items-center gap-2">
            <Button type="primary" onClick={() => setLoginOpen(true)}>登录</Button>
          </div>
        )}
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLoginSuccess={setAuth} onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onRegisterSuccess={setAuth} onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }} />
    </header>
  )
}

