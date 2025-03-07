// src/app/api/notion/route.ts
import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'
import { NotionDatabaseResponse, NotionOption, NotionMultiSelectItem } from '../../../types/notion'
import { QuestionData } from '../../../types/types'

interface RequestBody {
  meta: {
    error_reason: string
    submit_time: string
  }
  content: QuestionData
}

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function POST(request: Request) {
  try {
    const { meta, content }: RequestBody = await request.json()

    // 获取数据库的属性以检查现有知识点
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DB_ID!
    }) as NotionDatabaseResponse

    // 获取现有的知识点选项
    const existingOptions = database.properties['核心知识点'].multi_select.options
    const existingPoints = new Set(existingOptions.map((opt: NotionOption) => opt.name))

    // 检查新的知识点并添加到数据库
    for (const point of content.core_knowledge) {
      if (!existingPoints.has(point)) {
        await notion.databases.update({
          database_id: process.env.NOTION_DB_ID!,
          properties: {
            '核心知识点': {
              multi_select: {
                options: [
                  ...existingOptions,
                  { name: point } as NotionOption
                ]
              }
            }
          }
        })
        existingPoints.add(point)
      }
    }

    // 创建新的页面
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DB_ID! },
      properties: {
        '题目': {
          title: [{ text: { content: content.question } }]
        },
        '解题思路': {
          rich_text: [{ text: { content: content.solution_flow } }]
        },
        '详细解答': {
          rich_text: [{ text: { content: content.detailed_solution } }]
        },
        '核心知识点': {
          multi_select: content.core_knowledge.map((point: string): NotionMultiSelectItem => ({ name: point }))
        },
        '错误原因': {
          rich_text: [{ text: { content: meta.error_reason } }]
        },
        '提交时间': {
          date: { start: meta.submit_time }
        }
      }
    })

    return NextResponse.json({ success: true, id: response.id })
  } catch (error: any) {
    console.error('Notion API Error:', error)
    return NextResponse.json(
      { error: error.message || '创建失败' },
      { status: 500 }
    )
  }
}