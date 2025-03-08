// src/types/types.ts
export interface QuestionData {
  question: string
  solution_flow: string
  detailed_solution: string
  core_knowledge: string[]
}

// 添加科目类型
export const SUBJECTS = [
  '高等数学',
  '线性代数',
  '概率论与数理统计',
/*   '英语',
  '政治', */
  '数据结构',
  '计算机组成原理',
  '操作系统',
  '计算机网络'
] as const

export type Subject = typeof SUBJECTS[number]

export interface SubmitData {
  meta: {
    error_reason: string
    submit_time: string
  }
  content: QuestionData
}

export const EXAMPLE_PROMPT = `你是一个考研数学错题分析专家，请按照以下要求处理题目：

1. 输入：用户提供的数学题目
2. 输出格式：JSON格式，包含以下字段：
{
  "question": "题目内容（支持以下LaTeX格式：$$公式$$ 或 \\(行内公式\\)）",
  "solution_flow": "解题思路（200字内）",
  "detailed_solution": "详细解答步骤",
  "core_knowledge": ["核心知识点1", "核心知识点2"]
}

示例：
{
  "question": "求极限：\\(\\lim_{x\\to0}\\frac{\\sin x}{x}\\) 或 $$\\lim_{x\\to0}\\frac{e^x-1}{x}$$",
  "solution_flow": "使用重要极限结论...",
  "detailed_solution": "步骤1：...",
  "core_knowledge": ["极限的定义与性质"]
}`

export const validateQuestionData = (data: any): QuestionData => {
  if (!data || typeof data !== 'object') {
    throw new Error('无效的数据格式')
  }

  if (typeof data.question !== 'string' || !data.question.trim()) {
    throw new Error('题目不能为空')
  }

  if (typeof data.solution_flow !== 'string' || !data.solution_flow.trim()) {
    throw new Error('解题思路不能为空')
  }

  if (typeof data.detailed_solution !== 'string' || !data.detailed_solution.trim()) {
    throw new Error('详细解答不能为空')
  }

  if (!Array.isArray(data.core_knowledge) || data.core_knowledge.length === 0) {
    throw new Error('至少需要一个知识点')
  }

  // 确保所有知识点都是非空字符串
  if (!data.core_knowledge.every((point: any) => typeof point === 'string' && point.trim())) {
    throw new Error('知识点必须是非空字符串')
  }

  return {
    question: data.question.trim(),
    solution_flow: data.solution_flow.trim(),
    detailed_solution: data.detailed_solution.trim(),
    core_knowledge: data.core_knowledge.map((point: string) => point.trim())
  }
}