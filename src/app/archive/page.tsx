// src/app/archive/page.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import styles from './archive.module.css'
import { QuestionData } from '../../types/types'
import { normalizeContent } from '../../utils/format'
import AddQuestion from '../../components/AddQuestion'
import Link from 'next/link'

interface ArchivedQuestion extends QuestionData {
  id: string
  error_reason: string
  submit_time: string
}

interface GroupedSubject {
  questionCount: number
  points: {
    point: string
    fullPoint: string
    count: number
  }[]
}

export default function Archive() {
  const [questions, setQuestions] = useState<ArchivedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  const [showCatalog, setShowCatalog] = useState(false)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes] = await Promise.all([
          fetch('/api/notion/questions'),
        ])
        
        if (!questionsRes.ok) throw new Error('获取数据失败')
        
        const questionsData = await questionsRes.json()
        setQuestions(questionsData.questions)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const groupedSubjects = useMemo(() => {
    const subjects: Record<string, GroupedSubject> = {}

    questions.forEach(question => {
      // 收集题目涉及的所有科目（去重）
      const subjectSet = new Set<string>()
      question.core_knowledge.forEach(fullPoint => {
        const [subject] = fullPoint.split('-')
        subjectSet.add(subject)
      })

      // 更新科目题目计数（每个题目在每个科目中只计1次）
      subjectSet.forEach(subject => {
        if (!subjects[subject]) {
          subjects[subject] = {
            questionCount: 0,
            points: []
          }
        }
        subjects[subject].questionCount += 1
      })

      // 更新知识点计数
      question.core_knowledge.forEach(fullPoint => {
        const [subject, ...pointParts] = fullPoint.split('-')
        const point = pointParts.join('-')

        const existingPoint = subjects[subject]?.points.find(p => p.fullPoint === fullPoint)
        if (existingPoint) {
          existingPoint.count += 1
        } else {
          subjects[subject]?.points.push({
            point,
            fullPoint,
            count: 1
          })
        }
      })
    })

    return subjects
  }, [questions])

  const handleQuestionAdded = async () => {
    const questionsRes = await fetch('/api/notion/questions')
    if (questionsRes.ok) {
      const questionsData = await questionsRes.json()
      setQuestions(questionsData.questions)
    }
    setShowAddQuestion(false)
  }

  const selectKnowledgePoint = (point: string) => {
    setSelectedPoint(currentPoint => currentPoint === point ? null : point)
  }

  const filteredQuestions = selectedPoint
    ? questions.filter(question => question.core_knowledge.includes(selectedPoint))
    : questions

  const toggleCatalog = () => {
    setShowCatalog(!showCatalog)
  }

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    )
  }

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>加载中...</p>
    </div>
  )

  if (error) return (
    <div className={styles.errorContainer}>
      <h2>出错了</h2>
      <p>{error}</p>
    </div>
  )

  return (
    <div className={styles.container}>
      {showCatalog && (
        <div 
          className={styles.overlay}
          onClick={() => setShowCatalog(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${showCatalog ? styles.show : ''}`}>
        <div className={styles.catalogHeader}>
          <h2>知识点筛选</h2>
          <div className={styles.headerControls}>
            {selectedPoint && (
              <button 
                className={styles.clearButton}
                onClick={() => setSelectedPoint(null)}
              >
                显示全部
              </button>
            )}
            <button 
              className={styles.mobileCatalogClose}
              onClick={() => setShowCatalog(false)}
            >
              ×
            </button>
          </div>
        </div>
        <div className={styles.catalogContent}>
          {Object.entries(groupedSubjects).map(([subject, subjectData]) => (
            <div key={subject} className={styles.subjectGroup}>
              <div 
                className={styles.subjectHeader}
                onClick={() => toggleSubject(subject)}
              >
                <h3>{subject}</h3>
                <span className={styles.countBadge}>
                  {subjectData.questionCount}
                </span>
              </div>
              {expandedSubjects.includes(subject) && (
                <div className={styles.pointsList}>
                  {subjectData.points.map(({ point, fullPoint, count }) => (
                    <div
                      key={fullPoint}
                      className={`${styles.pointItem} ${
                        selectedPoint === fullPoint ? styles.selectedPoint : ''
                      }`}
                      onClick={() => selectKnowledgePoint(fullPoint)}
                    >
                      <span className={styles.pointText}>{point}</span>
                      <span className={styles.pointCount}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>题目归档</h1>
          <div className={styles.headerButtons}>
            <Link 
              href="/dashboard"
              className={styles.dashboardButton}
            >
              查看数据看板
            </Link>
            <button 
              className={styles.toggleCatalog}
              onClick={toggleCatalog}
            >
              {showCatalog ? '隐藏目录' : '显示目录'}
            </button>
            <button 
              className={styles.addButton}
              onClick={() => setShowAddQuestion(true)}
            >
              添加新题目
            </button>
          </div>
        </div>

        <div className={styles.stats}>
          {selectedPoint ? (
            <p>
              {selectedPoint.split('-')[0]}: {filteredQuestions.length} 道题目
            </p>
          ) : (
            <p>共 {questions.length} 道题目</p>
          )}
        </div>

        <div className={styles.questionList}>
          {filteredQuestions.map((question) => (
            <div key={question.id} className={styles.questionCard}>
              <div className={styles.questionContent}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {normalizeContent(question.question)}
                </ReactMarkdown>
              </div>
              <div className={styles.tags}>
                {question.core_knowledge.map((fullPoint) => {
                  const [subject, ...pointParts] = fullPoint.split('-')
                  const point = pointParts.join('-')
                  return (
                    <span 
                      key={fullPoint} 
                      className={`${styles.tag} ${
                        selectedPoint === fullPoint ? styles.selectedTag : ''
                      }`}
                      onClick={() => selectKnowledgePoint(fullPoint)}
                    >
                      <span className={styles.subjectBadge}>{subject}</span>
                      {point}
                    </span>
                  )
                })}
              </div>
              <div className={styles.meta}>
                <p>错误原因: {question.error_reason || '未填写'}</p>
                <p>提交时间: {question.submit_time || '未知时间'}</p>
              </div>
              <button 
                className={styles.detailButton}
                onClick={() => window.location.href = `/archive/${question.id}`}
              >
                查看详情
              </button>
            </div>
          ))}
        </div>
      </main>

      {showAddQuestion && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>添加新题目</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddQuestion(false)}
              >
                ×
              </button>
            </div>
            <AddQuestion onSuccess={handleQuestionAdded} />
          </div>
        </div>
      )}

      <button 
        className={styles.floatingAddButton}
        onClick={() => setShowAddQuestion(true)}
        title="添加新题目"
      >
        +
      </button>
    </div>
  )
}