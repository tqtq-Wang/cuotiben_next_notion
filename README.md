# 考研数学错题本 (Next.js + Notion API)

一个基于 Next.js 和 Notion API 的考研数学错题管理系统。支持 LaTeX 公式渲染、知识点分类、错题归档等功能。

## 功能特点

- 🧮 支持 LaTeX 数学公式渲染
- 📝 错题详细解析和知识点标注
- 🗂️ 按知识点分类查看
- 📊 实时统计和分析
- ✏️ 在线编辑和更新
- 🗑️ 软删除支持

## 技术栈

- Next.js 14
- TypeScript
- Notion API
- React Markdown
- KaTeX

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/tqtq-Wang/-_next_notion.git
cd -_next_notion
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_ID=your_notion_database_id
```

4. 运行开发服务器
```bash
npm run dev
```

## AI 提示词规范

系统使用专门设计的 AI Prompt 来规范化数据格式：

```json
{
    "输出规范": {
      "question": {
        "结构": "题干 + 选项（若有）",
        "示例": "函数$$f(x)$$在$$x=0$$处可导的充要条件是（  ）. (A)$$\\lim_{x\\to0}\\frac{f(x)-f(-x)}{2x}$$存在...",
        "校验规则": [
          "每个公式必须用$$包裹",
          "选项标识符使用(A)(B)(C)(D)"
        ]
      },
      "solution_flow": {
        "结构": "关键公式 + 解题路径",
        "模板": "关键公式：$$[核心公式]$$\\n1. [分析步骤1]\\n2. [分析步骤2]",
        "示例": "关键公式：$$f'(x_0)=\\lim_{\\Delta x\\to0}\\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$$\\n1. 对比选项与导数定义形式\\n2. 检验极限存在条件",
        "校验规则": [
          "不超过200字",
          "如有重点公式，必须包含关键公式"
        ]
      },
      "detailed_solution": {
        "结构": "分步解析 + 公式推导",
        "模板": "步骤1：[操作描述]\\n$$[相关公式]$$\\n步骤2：[操作描述]\\n$$[相关公式]$$",
        "示例": "步骤1：参数代换\\n令$$t=e^x-1$$，则当$$x\\to0$$时$$t\\to0$$\\n步骤2：改写极限式\\n原式=$$\\lim_{t\\to0}\\frac{f(t)-f(0)}{t}=f'(0)$$",
        "校验规则": [
          "选择题必须分析所有选项把每个选项都当做解答题分析，并举反例分析（如合适）",
          "计算题至少3个步骤"
        ]
      },
      "core_knowledge": {
        "选择范围": [
          "函数的概念及性质", "极限的定义与性质", "无穷小与无穷大", "极限存在准则", "两个重要极限",
          "函数的连续性", "间断点分类", "闭区间上连续函数的性质", "导数的定义与几何意义", "导数的计算",
          "高阶导数", "微分及其应用", "微分中值定理", "泰勒公式", "函数的单调性与极值", "曲线的凹凸性与拐点",
          "渐近线", "曲率与曲率半径", "不定积分的概念与性质", "基本积分公式", "换元积分法", "分部积分法",
          "有理函数积分", "定积分的定义与性质", "微积分基本定理", "定积分的换元法与分部法", "反常积分",
          "定积分的几何应用", "定积分的物理应用", "向量的线性运算", "向量的数量积与向量积", "平面与直线方程",
          "空间曲面与曲线", "常见二次曲面", "多元函数的极限与连续", "偏导数与全微分", "多元复合函数求导",
          "隐函数求导", "方向导数与梯度", "多元函数的极值", "条件极值", "二重积分的计算", "三重积分的计算",
          "曲线积分", "格林公式", "曲面积分", "高斯公式", "斯托克斯公式", "常数项级数的收敛性",
          "正项级数审敛法", "交错级数与莱布尼茨定理", "幂级数的收敛域", "幂级数的和函数", "函数展开成幂级数",
          "傅里叶级数", "一阶微分方程", "可降阶的高阶微分方程", "线性微分方程解的结构", "常系数线性微分方程",
          "欧拉方程", "微分方程的应用"
        ],
        "选择规则": {
          "优先策略": [
            "复合问题选择最高层级知识点（如微分方程应用优先于基础积分）",
            "选择题必须包含定义类知识点"
          ]
        }
      }
    },
    "校验机制": {
      "公式校验器": {
        "检测模式": "全文字符扫描",
        "错误类型": [
          {"code": "FE01", "pattern": "\\$(?!\\$)", "message": "检测到未闭合的$符号"},
          {"code": "FE02", "pattern": "\\\\[^()]", "message": "非法转义字符"}
        ]
      },
      "知识点校验器": {
        "检测算法": "精确匹配+相似度匹配",
        "容错机制": [
          {"原词": "泰勒展开", "可替换项": ["泰勒公式"]}
        ]
      }
    }
}
```

## 主要功能

### 1. 题目管理
- 添加新题目（支持 JSON 导入）
- 编辑已有题目
- 软删除题目

### 2. 知识点系统
- 自动提取和管理知识点
- 按知识点筛选题目
- 知识点统计分析

### 3. 解答详情
- LaTeX 公式渲染
- 分步骤解析
- 实时预览

## 项目结构

```
src/
├── app/                # Next.js 应用路由
├── components/         # React 组件
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数
```

## Notion 数据库设计

### 数据库属性

| 属性名 | 类型 | 说明 |
|--------|------|------|
| 题目 | Title | 题目内容，支持 LaTeX 公式 |
| 解题思路 | Rich Text | 解题关键思路和方法 |
| 详细解答 | Rich Text | 完整的解答过程 |
| 核心知识点 | Multi-select | 题目涉及的知识点标签 |
| 错误原因 | Rich Text | 做错的原因分析 |
| 提交时间 | Date | 题目录入时间 |

### 属性说明

1. **题目 (Title)**
   - 作为数据库的主标题
   - 支持 LaTeX 公式渲染
   - 格式：`$$公式$$` 或 `\(行内公式\)`

2. **解题思路 (Rich Text)**
   - 简要描述解题方法和关键点
   - 限制在 200 字以内
   - 包含关键公式（如有）

3. **详细解答 (Rich Text)**
   - 完整的解题步骤
   - 每个步骤配有公式说明
   - 选择题需分析所有选项

4. **核心知识点 (Multi-select)**
   - 可多选的知识点标签
   - 用于分类和统计
   - 支持动态添加新知识点

5. **错误原因 (Rich Text)**
   - 记录做错的具体原因
   - 用于后期复习和总结
   - 可选填项

6. **提交时间 (Date)**
   - 自动记录创建时间
   - 用于排序和统计

### 数据示例

```json
{
  "题目": "求导数：\\( f(x) = e^{x^2} \\)",
  "解题思路": "使用链式法则，将复合函数分解求导",
  "详细解答": "步骤1：设外层函数为指数函数\n步骤2：内层函数为二次函数\n步骤3：应用链式法则：$$ f'(x) = 2x e^{x^2} $$",
  "核心知识点": ["导数的计算", "链式法则"],
  "错误原因": "忘记使用链式法则",
  "提交时间": "2024-01-01T12:00:00Z"
}
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

项目维护者：[tqtq-Wang](https://github.com/tqtq-Wang)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

