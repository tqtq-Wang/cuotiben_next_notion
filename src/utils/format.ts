/**
 * 格式化内容文本，处理 LaTeX 公式和换行符
 * @param content 需要格式化的文本内容
 * @returns 格式化后的文本
 */
export const normalizeContent = (content: string) => {
  return content
    // 转换所有LaTeX格式符号为$$
    .replace(/(\\\()|(\\\))|(\\\[)|(\\\])/g, '$$')
    // 处理换行符为Markdown换行
    .replace(/\\n/g, '\n\n')
    // 修复常见公式转义问题
    .replace(/\\\\/g, '\\')
} 