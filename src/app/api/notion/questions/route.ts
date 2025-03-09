// src/app/api/notion/questions/route.ts
import { Client } from '@notionhq/client'
import { NextResponse } from 'next/server'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID!,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    })

    const questions = response.results.map((page: any) => {
      // 使用页面的创建时间作为提交时间
      const createdTime = page.created_time || '';
      
      // 格式化日期为中文格式
      let submitTime = '';
      if (createdTime) {
        const date = new Date(createdTime);
        if (!isNaN(date.getTime())) {
          submitTime = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
      }
      
      return {
        id: page.id,
        question: page.properties['题目'].title[0]?.text.content,
        solution_flow: page.properties['解题思路'].rich_text[0]?.text.content,
        detailed_solution: page.properties['详细解答'].rich_text[0]?.text.content,
        core_knowledge: page.properties['核心知识点'].multi_select.map((item: any) => item.name),
        error_reason: page.properties['错误原因'].rich_text[0]?.text.content || '',
        submit_time: submitTime,
      };
    })

    return NextResponse.json({ questions })
  } catch (error: any) {
    console.error('Notion API Error:', error)
    return NextResponse.json(
      { error: error.message || '获取数据失败' },
      { status: 500 }
    )
  }
}