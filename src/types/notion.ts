// src/types/notion.ts
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints'

export interface NotionOption {
  id: string
  name: string
  color?: string
}

export interface NotionMultiSelectProperty {
  id: string
  name: string
  type: 'multi_select'
  multi_select: {
    options: NotionOption[]
  }
}

export interface NotionDatabaseResponse {
  id: string
  properties: {
    [key: string]: NotionMultiSelectProperty | any
  }
}

export interface NotionMultiSelectItem {
  name: string
}

// 定义 Notion API 返回的页面属性类型
export interface NotionPageProperties {
  '题目': {
    id: string
    type: 'title'
    title: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
  '解题思路': {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
  '详细解答': {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
  '核心知识点': {
    id: string
    type: 'multi_select'
    multi_select: Array<{
      id: string
      name: string
      color?: string
    }>
  }
  '错误原因': {
    id: string
    type: 'rich_text'
    rich_text: Array<{
      type: 'text'
      text: { content: string }
      plain_text: string
    }>
  }
  '提交时间': {
    id: string
    type: 'date'
    date: { start: string }
  }
}

// 扩展 Notion API 的页面响应类型
export interface NotionPageResponse extends Omit<GetPageResponse, 'properties'> {
  properties: NotionPageProperties
}

// 我们的应用使用的页面类型
export interface NotionPage {
  id: string
  properties: NotionPageProperties
} 