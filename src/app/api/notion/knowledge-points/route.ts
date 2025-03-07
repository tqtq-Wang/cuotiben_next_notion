import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'
import { NotionDatabaseResponse, NotionOption } from '../../../../types/notion'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function GET() {
  try {
    const database = await notion.databases.retrieve({
      database_id: process.env.NOTION_DB_ID!
    }) as NotionDatabaseResponse

    const points = database.properties['核心知识点'].multi_select.options
      .map((opt: NotionOption) => opt.name)
      .sort()

    return NextResponse.json({ points })
  } catch (error: any) {
    console.error('Notion API Error:', error)
    return NextResponse.json(
      { error: error.message || '获取知识点失败' },
      { status: 500 }
    )
  }
} 