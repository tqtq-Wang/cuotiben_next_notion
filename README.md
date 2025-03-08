# 考研数学错题本 (Next.js + Notion API)

一个基于 Next.js 和 Notion API 的考研数学错题管理系统。支持 LaTeX 公式渲染、知识点分类、错题归档等功能。

## 功能特点

-   🧮 支持 LaTeX 数学公式渲染
-   📝 错题详细解析和知识点标注
-   🗂️ 按知识点分类查看
-   📈 **进度追踪**：通过统计图表展示学习进度和薄弱环节
-   📊 实时统计和分析
-   ✏️ 在线编辑和更新
-   🗑️ 软删除支持

## 技术栈

-   **前端框架**: Next.js 14 (App Router)
-   **UI 组件**: React
-   **数据存储**: Notion API
-   **样式方案**: CSS Modules
-   **图表库**: Chart.js
-   **公式渲染**: KaTeX

## 快速开始

1. 克隆仓库

```bash
git clone https://github.com/tqtq-Wang/cuotiben_next_notion.git
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

````json
  "高等数学":
  {
    "输出规范（要求整个回复包裹在json代码块中）": {
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
          "选择题必须分析所有选项，把每个选项都当做解答题分析，并举反例分析（如合适）",
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
    },
    "示例系统": {
      "合格样例": {
        "question": "设曲线L为$$x^2+y^2=1$$取逆时针方向，则曲线积分$$\\oint_L (x^3+y^5)ds=$$______",
        "solution_flow": "关键公式：$$ds=\\sqrt{(dx)^2+(dy)^2}$$\\n1. 参数化曲线\\n2. 代入积分计算",
        "detailed_solution": "步骤1：令$$x=\\cosθ,y=\\sinθ$$\\n$$ds=\\sqrt{(-\\sinθ)^2+(\\cosθ)^2}dθ=dθ$$\\n步骤2：积分转换\\n原式=$$\\int_0^{2π}(\\cos^3θ+\\sin^5θ)dθ=0$$",
        "core_knowledge": ["曲线积分"]
      },
      "错误样例": {
        "code": "FE01",
        "原始输入": "使用洛必塔法则求极限",
        "修正建议": "知识点应为'洛必达法则'"
      }
    }
  }

  "线性代数":
  {
    "输出规范": {
      "question": {
        "结构": "矩阵表达式或线性方程组描述",
        "示例": "设矩阵$$A=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$$，求$$A^{-1}$$",
        "校验规则": [
          "矩阵用大写字母表示，使用$$包裹的pmatrix环境",
          "向量使用\\vec{}或\\mathbf{}表示"
        ]
      },
      "solution_flow": {
        "结构": "关键定理 + 矩阵变换步骤",
        "模板": "关键定理：$$[定理名称]$$\\n1. [初等行变换步骤]\\n2. [特征值计算步骤]",
        "示例": "关键定理：$$A^{-1}=\\frac{1}{|A|}A^*$$\\n1. 计算行列式$$|A|=1×4-2×3=-2$$\\n2. 求伴随矩阵$$A^*=\\begin{pmatrix}4&-2\\\\-3&1\\end{pmatrix}$$",
        "校验规则": [
          "必须标注使用的定理名称",
          "矩阵运算步骤不超过4步"
        ]
      },
      "detailed_solution": {
        "结构": "分步矩阵运算过程",
        "模板": "步骤1：[操作描述]\\n$$[矩阵运算]$$\\n步骤2：[操作描述]\\n$$[行列式计算]$$",
        "示例": "步骤1：构造增广矩阵\\n$$(A|I)=\\begin{pmatrix}1&2&1&0\\\\3&4&0&1\\end{pmatrix}$$\\n步骤2：行变换化为阶梯形\\n$$R2-3R1\\rightarrow\\begin{pmatrix}1&2&1&0\\\\0&-2&-3&1\\end{pmatrix}$$",
        "校验规则": [
          "必须展示完整的矩阵变换过程",
          "特征值问题必须验证特征方程"
        ]
      },
      "core_knowledge": {
        "选择范围": [
          "矩阵的秩", "行列式计算", "特征值与特征向量",
          "线性方程组解的结构", "向量空间与子空间",
          "正交矩阵", "相似对角化", "二次型标准化"
        ],
        "选择规则": {
          "优先策略": [
            "矩阵运算问题必须包含相关运算规则",
            "证明题必须包含定理名称"
          ]
        }
      }
    },
    "校验机制": {
      "公式校验器": {
        "检测模式": "矩阵环境检测",
        "错误类型": [
          {"code": "LE01", "pattern": "\\begin{pmatrix}.*?\\end{pmatrix", "message": "矩阵未正确使用pmatrix环境"},
          {"code": "LE02", "pattern": "\\|A\\|", "message": "行列式应使用det(A)表示"}
        ]
      },
      "知识点校验器": {
        "容错机制": [
          {"原词": "逆矩阵", "可替换项": ["矩阵求逆"]},
          {"原词": "特征根", "可替换项": ["特征值"]}
        ]
      }
    },
    "示例系统": {
      "合格样例": {
        "question": "求矩阵$$B=\\begin{pmatrix}2&-1\\\\1&1\\end{pmatrix}$$的特征多项式",
        "solution_flow": "关键公式：$$|λI-B|=0$$\\n1. 构造特征矩阵\\n2. 计算行列式",
        "detailed_solution": "步骤1：构造特征矩阵\\n$$λI-B=\\begin{pmatrix}λ-2&1\\\\-1&λ-1\\end{pmatrix}$$\\n步骤2：计算行列式\\n$$|λI-B|=(λ-2)(λ-1)+1=λ²-3λ+3$$",
        "core_knowledge": ["特征值与特征向量"]
      },
      "错误样例": {
        "code": "LE01",
        "原始输入": "矩阵A=[[1,2],[3,4]]",
        "修正建议": "应使用$$\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$$"
      }
    }
  },

  "概率论与数理统计":
  {
    "输出规范": {
      "question": {
        "结构": "概率场景描述 + 问题陈述",
        "示例": "设随机变量X~N(0,1)，Y=X²，求Y的概率密度函数",
        "校验规则": [
          "分布类型必须使用标准符号（如N(μ,σ²)）",
          "复杂事件用集合符号表示"
        ]
      },
      "solution_flow": {
        "结构": "关键分布性质 + 计算路径",
        "模板": "关键性质：$$[分布性质]$$\\n1. [变量替换步骤]\\n2. [积分计算步骤]",
        "示例": "关键公式：$$F_Y(y)=P(Y≤y)=P(-\\sqrt{y}≤X≤\\sqrt{y})$$\\n1. 计算累积分布函数\\n2. 求导得密度函数",
        "校验规则": [
          "必须标注使用的分布类型",
          "连续型问题必须包含积分运算"
        ]
      },
      "detailed_solution": {
        "结构": "概率公式推导过程",
        "模板": "步骤1：[概率转换]\\n$$[概率公式]$$\\n步骤2：[积分/微分运算]\\n$$[计算过程]$$",
        "示例": "步骤1：计算分布函数\\n$$F_Y(y)=P(X²≤y)=2Φ(\\sqrt{y})-1$$\\n步骤2：求导得密度函数\\n$$f_Y(y)=\\frac{d}{dy}F_Y(y)=\\frac{1}{\\sqrt{y}}φ(\\sqrt{y})$$",
        "校验规则": [
          "假设检验必须包含原假设和备择假设",
          "参数估计必须给出估计量表达式"
        ]
      },
      "core_knowledge": {
        "选择范围": [
          "随机变量分布", "期望与方差", "大数定律",
          "中心极限定理", "参数估计方法", "假设检验",
          "回归分析", "协方差与相关系数"
        ],
        "选择规则": {
          "优先策略": [
            "多维问题必须包含联合分布",
            "检验问题必须包含检验统计量"
          ]
        }
      }
    },
    "校验机制": {
      "公式校验器": {
        "检测模式": "概率符号检测",
        "错误类型": [
          {"code": "PE01", "pattern": "P\\([^)]+\\|", "message": "条件概率应使用P(·|·)"},
          {"code": "PE02", "pattern": "N\\(μ,σ\\)", "message": "正态分布参数应写为N(μ,σ²)"}
        ]
      },
      "知识点校验器": {
        "容错机制": [
          {"原词": "几率", "可替换项": ["概率"]},
          {"原词": "离散系数", "可替换项": ["变异系数"]}
        ]
      }
    },
    "示例系统": {
      "合格样例": {
        "question": "设X~Poisson(λ)，证明E(X)=λ",
        "solution_flow": "关键公式：$$E(X)=\\sum_{k=0}^∞k\\frac{λ^k e^{-λ}}{k!}$$\\n1. 化简求和式\\n2. 利用指数展开式",
        "detailed_solution": "步骤1：展开期望表达式\\n$$E(X)=\\sum_{k=1}^∞\\frac{λ^k e^{-λ}}{(k-1)!}$$\\n步骤2：变量替换m=k-1\\n$$E(X)=λe^{-λ}\\sum_{m=0}^∞\\frac{λ^m}{m!}=λ$$",
        "core_knowledge": ["期望计算"]
      },
      "错误样例": {
        "code": "PE01",
        "原始输入": "P(A且B)=0.3",
        "修正建议": "应使用P(A∩B)=0.3"
      }
    }
  },

  "计算机408":
  {
    "输出规范": {
      "question": {
        "结构": "场景描述 + 具体问题",
        "示例": "给定二叉树前序序列ABDECFG和中序序列DBEAFCG，请重建该二叉树",
        "校验规则": [
          "算法问题必须标注时间/空间复杂度要求",
          "网络问题必须注明协议版本"
        ]
      },
      "solution_flow": {
        "结构": "关键算法 + 实现步骤",
        "模板": "关键算法：$$[算法名称]$$\\n1. [数据预处理步骤]\\n2. [核心操作步骤]",
        "示例": "关键算法：Dijkstra算法\\n1. 初始化距离数组\\n2. 每次选取最近节点更新邻接点距离",
        "校验规则": [
          "必须注明算法时间复杂度",
          "并发问题必须包含同步机制"
        ]
      },
      "detailed_solution": {
        "结构": "算法步骤实现细节",
        "模板": "步骤1：[数据结构初始化]\\n$$[伪代码/示意图]$$\\n步骤2：[核心逻辑实现]\\n$$[代码片段]$$",
        "示例": "步骤1：构建哈希表\\n```python\ndict = {A:0, B:inf, ...}\n```\\n步骤2：松弛操作\\n```python\nfor edge in edges:\n    if dist[v] > dist[u] + w:\n        update dist[v]```",
        "校验规则": [
          "排序算法必须给出每趟结果",
          "网络协议必须分层说明"
        ]
      },
      "core_knowledge": {
        "选择范围": {
          "数据结构": ["二叉树", "图遍历", "排序算法"],
          "操作系统": ["进程调度", "虚拟内存", "文件系统"],
          "组成原理": ["指令流水线", "Cache映射", "中断机制"],
          "计算机网络": ["TCP拥塞控制", "IP路由", "HTTP协议"]
        },
        "选择规则": {
          "优先策略": [
            "系统设计题必须包含模块划分",
            "性能问题必须分析时间/空间复杂度"
          ]
        }
      }
    },
    "校验机制": {
      "公式校验器": {
        "检测模式": "代码规范检测",
        "错误类型": [
          {"code": "CE01", "pattern": "O\\(n\\)", "message": "时间复杂度应使用$$O(n)$$格式"},
          {"code": "CE02", "pattern": "TCP/IP", "message": "协议栈应分层说明（如TCP属于传输层）"}
        ]
      },
      "知识点校验器": {
        "容错机制": [
          {"原词": "堆栈", "可替换项": ["栈"]},
          {"原词": "哈希", "可替换项": ["散列"]}
        ]
      }
    },
    "示例系统": {
      "合格样例": {
        "question": "用Prim算法构造下图的最小生成树（附邻接矩阵）",
        "solution_flow": "关键步骤：\\n1. 任选起始顶点加入集合\\n2. 每次选取权值最小的跨集合边",
        "detailed_solution": "步骤1：初始化\\n选中顶点A，候选边：AB(6), AD(5)\\n步骤2：选择AD(5)，新增顶点D\\n候选边更新为：AB(6), DC(4), DE(3)...",
        "core_knowledge": ["图算法"]
      },
      "错误样例": {
        "code": "CE01",
        "原始输入": "时间复杂度O(n)",
        "修正建议": "应使用$$O(n)$$格式"
      }
    }
  }
````

## 主要功能

-   `/archive`: 错题归档列表页面
    -   支持按知识点筛选
    -   支持查看详细解答
    -   支持添加新题目
-   `/dashboard`: 数据统计看板
    -   知识点分布统计
    -   错题趋势分析
    -   重点难点可视化

## 使用说明

1. **添加新题目**
    - 点击右下角的"+"按钮
    - 输入题目内容（支持 LaTeX 公式）
    - 选择相关知识点
    - 填写解题思路和详细解答
2. **查看统计数据**
    - 点击顶部的"数据看板"按钮
    - 查看各类统计图表
    - 分析学习进度和薄弱环节

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

| 属性名     | 类型         | 说明                      |
| ---------- | ------------ | ------------------------- |
| 题目       | Title        | 题目内容，支持 LaTeX 公式 |
| 解题思路   | Rich Text    | 解题关键思路和方法        |
| 详细解答   | Rich Text    | 完整的解答过程            |
| 核心知识点 | Multi-select | 题目涉及的知识点标签      |
| 错误原因   | Rich Text    | 做错的原因分析            |
| 提交时间   | Date         | 题目录入时间              |

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

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
