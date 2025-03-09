import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'
import { NotionPageResponse } from '../../../../../types/notion'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // 确保先等待 params 对象
    const params = await context.params;
    const response = await notion.pages.retrieve({
      page_id: params.id
    }) as unknown as NotionPageResponse

    // 使用页面的创建时间作为提交时间
    const submitTime = (response as any).created_time || '';
    
    // 格式化日期为中文格式
    const formattedTime = submitTime ? formatDateToChinese(new Date(submitTime)) : '';

    const question = {
      id: response.id,
      question: response.properties['题目'].title[0]?.text.content,
      solution_flow: response.properties['解题思路'].rich_text[0]?.text.content,
      detailed_solution: response.properties['详细解答'].rich_text[0]?.text.content,
      core_knowledge: response.properties['核心知识点'].multi_select.map(item => item.name),
      error_reason: response.properties['错误原因'].rich_text[0]?.text.content || '',
      submit_time: formattedTime,
    }

    return NextResponse.json({ question })
  } catch (error: any) {
    console.error('Notion API Error:', error)
    return NextResponse.json(
      { error: error.message || '获取数据失败' },
      { status: 500 }
    )
  }
}

// 辅助函数：将Date对象格式化为中文日期格式
function formatDateToChinese(date: Date) {
  if (isNaN(date.getTime())) return '';
  
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    await notion.pages.update({
      page_id: context.params.id,
      properties: {
        '题目': {
          title: [{ text: { content: data.question } }]
        },
        '解题思路': {
          rich_text: [{ text: { content: data.solution_flow } }]
        },
        '详细解答': {
          rich_text: [{ text: { content: data.detailed_solution } }]
        },
        '核心知识点': {
          multi_select: data.core_knowledge.map((point: string) => ({ name: point }))
        },
        '错误原因': {
          rich_text: [{ text: { content: data.error_reason } }]
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Notion API Error:', error)
    return NextResponse.json(
      { error: error.message || '更新失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await notion.pages.update({
      page_id: context.params.id,
      archived: true
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Notion API Error:', error)
    return NextResponse.json(
      { error: error.message || '删除失败' },
      { status: 500 }
    )
  }
}