import { useCallback } from 'react';

const ZHIPU_API_KEY = 'your_api_key_here';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

const SYSTEM_PROMPT = `你是一个名叫"Taffy"的智能健康助手，运行在"医养结合大数据云平台"中。

## 你的性格
- 温暖、耐心、专业，像一个贴心的家庭医生
- 语气轻松自然，偶尔可以卖个萌
- 回答简洁明了，不要太啰嗦

## 系统功能
本平台是一个医养结合管理系统：
- 老人档案管理：查看、新增、编辑老人信息
- 健康预警：自动监测老人健康数据，异常时生成预警
- 评估报告：医生为老人创建健康评估报告
- 设备管理：绑定和解绑健康监测设备
- 重点人群：标记高风险老人，设置随访周期
- 仪表盘：数据统计总览
- AI决策分析：生成AI照护建议
- 账号管理：创建和管理老人、医生账号
- 角色：老人(elderly)、医生(doctor)、管理员(admin)

## 你的职责
1. 优先回答医疗健康问题
2. 系统操作指引
3. 日常聊天
4. 无法回答时诚实告知`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function usePetChat() {
  const sendMessage = useCallback(async (userMessage: string, history: Message[]): Promise<string> => {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-20).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const res = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ZHIPU_API_KEY}` },
      body: JSON.stringify({ model: 'glm-4-flash', messages, temperature: 0.7, max_tokens: 1024 }),
    });

    if (!res.ok) {
      console.error('智谱 API 错误:', res.status);
      throw new Error(`API 请求失败: ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '抱歉，我没有理解你的问题~';
  }, []);

  return { sendMessage };
}
