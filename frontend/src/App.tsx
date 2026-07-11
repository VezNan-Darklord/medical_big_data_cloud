import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import { AppRouter } from './routes/AppRouter'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0ea5e9',
          borderRadius: 14,
          colorBgLayout: '#eef4fb',
          colorText: '#0f172a',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        },
      }}
    >
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  )
}
