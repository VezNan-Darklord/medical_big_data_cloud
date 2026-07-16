export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-20 px-6 py-16">
      {/* Hero */}
      <section className="text-center">
        <div className="mx-auto inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-1.5 text-sm text-cyan-600">
          Smart Care · Cloud Platform
        </div>
        <h1 className="mt-8 text-5xl font-bold tracking-tight text-slate-900 lg:text-6xl">
          医养结合云端后台
          <span className="block bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Intelligent Healthcare Management
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
          基于 React 19 + Spring Boot 4 + ECharts 构建的新一代智慧医养管理平台。
          覆盖老人档案、健康预警、评估报告、报表统计等核心业务场景，
          为医养结合示范项目提供标准化前后端分离解决方案。
        </p>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-center text-2xl font-bold text-slate-900">技术栈</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'React 19', desc: '并发渲染 · Server Components · React Compiler', icon: '⚛️' },
            { title: 'Spring Boot 4', desc: 'JPA · Security · JWT 鉴权 · MapStruct', icon: '🍃' },
            { title: 'TypeScript 6', desc: '全链路类型安全 · verbatimModule · erasableSyntax', icon: '📘' },
            { title: 'MySQL + Redis', desc: '双 Token · Session JDBC · 软删除 · 审计留痕', icon: '🗄️' },
            { title: 'Ant Design 6', desc: '企业级 UI · 深色/浅色主题 · 响应式布局', icon: '🎨' },
            { title: 'ECharts', desc: '雷达图 · 折线趋势 · 饼图分布 · 动态渲染', icon: '📊' },
            { title: 'React Query v5', desc: '自动缓存 · 乐观更新 · 无限滚动 · 离线支持', icon: '🔄' },
            { title: 'GSAP + TailwindCSS', desc: '高性能动画 · 原子化样式 · 暗色科技风', icon: '✨' },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
              <div className="text-3xl">{item.icon}</div>
              <div className="mt-3 font-semibold text-slate-900">{item.title}</div>
              <div className="mt-2 text-sm text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-center text-2xl font-bold text-slate-900">核心优势</h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {[
            {
              title: '角色驱动的权限体系',
              desc: '老人、医生、管理员三级角色，路由守卫 + 侧边栏动态过滤，数据权限按机构和区域维度控制。',
            },
            {
              title: 'OpenAPI 驱动的接口契约',
              desc: '后端维护 openapi.yaml，前端自动生成 TypeScript Service + Model，接口变更零联调成本。',
            },
            {
              title: 'AI 决策分析引擎',
              desc: '基于业务规则引擎生成照护决策分析，包含洞察、建议动作和趋势评估，支持结构化输出。',
            },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white p-8">
              <div className="text-lg font-semibold text-slate-900">{item.title}</div>
              <div className="mt-3 text-sm leading-7 text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-400">
        © 2026 医养结合云端后台管理系统 · Smart Care Command Center
      </footer>
    </div>
  )
}
