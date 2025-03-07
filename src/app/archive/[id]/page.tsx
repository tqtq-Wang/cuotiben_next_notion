'use client'
import { useState, useEffect, useRef, use } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { normalizeContent } from '../../../utils/format'
import styles from './detail.module.css'

interface QuestionDetail {
  id: string
  question: string
  solution_flow: string
  detailed_solution: string
  core_knowledge: string[]
  error_reason: string
  submit_time: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function QuestionDetail({ params }: PageProps) {
  const { id } = use(params)
  const [question, setQuestion] = useState<QuestionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<keyof QuestionDetail | null>(null)
  const [editKnowledge, setEditKnowledge] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [newKnowledge, setNewKnowledge] = useState('')
  
  const editableRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchQuestionDetail()
  }, [id])

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current)
      }
    }
  }, [])

  const fetchQuestionDetail = async () => {
    try {
      const res = await fetch(`/api/notion/questions/${id}`)
      if (!res.ok) throw new Error('获取数据失败')
      const data = await res.json()
      setQuestion(data.question)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (field: keyof QuestionDetail) => {
    setEditing(field)
    if (field === 'core_knowledge') {
      setEditKnowledge(question?.core_knowledge || [])
    }
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditKnowledge([])
    if (editableRef.current) {
      editableRef.current.value = question?.[editing as keyof QuestionDetail]?.toString() || ''
    }
  }

  const handleContentEdit = (field: keyof QuestionDetail, value: string) => {
    if (!question) return

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }

    const updatedData = {
      ...question,
      [field]: value
    }

    saveTimeout.current = setTimeout(() => {
      handleSave(updatedData)
    }, 1000)
  }

  const handleSave = async (updatedData: QuestionDetail) => {
    if (!question) return
    setSaving(true)
    try {
      const res = await fetch(`/api/notion/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      
      if (!res.ok) throw new Error('保存失败')
      
      setQuestion(updatedData)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleKnowledgeAdd = () => {
    if (newKnowledge.trim() && !editKnowledge.includes(newKnowledge.trim())) {
      const updatedKnowledge = [...editKnowledge, newKnowledge.trim()]
      setEditKnowledge(updatedKnowledge)
      setNewKnowledge('')
      handleSave({
        ...question!,
        core_knowledge: updatedKnowledge
      })
    }
  }

  const handleKnowledgeRemove = (point: string) => {
    const updatedKnowledge = editKnowledge.filter(p => p !== point)
    setEditKnowledge(updatedKnowledge)
    handleSave({
      ...question!,
      core_knowledge: updatedKnowledge
    })
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这道题目吗？此操作不可恢复。')) return
    
    try {
      const res = await fetch(`/api/notion/questions/${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error('删除失败')
      
      window.location.href = '/archive'
    } catch (err: any) {
      alert(err.message)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    } catch (err) {
      return dateString
    }
  }

  const renderEditableContent = (field: keyof QuestionDetail, title: string) => {
    if (!question) return null

    const content = question[field]
    const isEditing = editing === field

    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>{title}</h2>
          <button 
            className={styles.editButton}
            onClick={() => isEditing ? cancelEdit() : startEdit(field)}
          >
            {isEditing ? '完成' : '编辑'}
          </button>
        </div>

        {field === 'core_knowledge' ? (
          <div className={styles.knowledgeEdit}>
            <div className={styles.tags}>
              {(isEditing ? editKnowledge : question.core_knowledge).map((point) => (
                <span key={point} className={styles.tag}>
                  {point}
                  {isEditing && (
                    <button
                      onClick={() => handleKnowledgeRemove(point)}
                      className={styles.removeTag}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className={styles.addKnowledge}>
                <input
                  type="text"
                  value={newKnowledge}
                  onChange={(e) => setNewKnowledge(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleKnowledgeAdd()}
                  placeholder="输入新知识点后按回车添加"
                  className={styles.knowledgeInput}
                />
              </div>
            )}
          </div>
        ) : isEditing ? (
          <textarea
            ref={editableRef}
            className={styles.editTextarea}
            defaultValue={content as string}
            onChange={(e) => handleContentEdit(field, e.target.value)}
          />
        ) : (
          <div className={styles.content}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {normalizeContent(content as string)}
            </ReactMarkdown>
          </div>
        )}
      </section>
    )
  }

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>加载题目详情...</p>
    </div>
  )
  
  if (error) return (
    <div className={styles.errorContainer}>
      <h2>出错了</h2>
      <p>{error}</p>
    </div>
  )

  if (!question) return (
    <div className={styles.errorContainer}>
      <h2>未找到题目</h2>
      <p>该题目可能已被删除</p>
      <button 
        className={styles.backButton}
        onClick={() => window.location.href = '/archive'}
      >
        返回列表
      </button>
    </div>
  )

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => window.location.href = '/archive'}
        >
          ← 返回列表
        </button>
        <h1>题目详情</h1>
        <button 
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          删除题目
        </button>
      </div>

      <div className={styles.content}>
        {renderEditableContent('question', '题目')}
        {renderEditableContent('core_knowledge', '核心知识点')}
        {renderEditableContent('solution_flow', '解题思路')}
        {renderEditableContent('detailed_solution', '详细解答')}
        {renderEditableContent('error_reason', '错误原因')}

        <div className={styles.meta}>
          提交时间: {question && formatDate(question.submit_time)}
        </div>
      </div>
    </main>
  )
} 