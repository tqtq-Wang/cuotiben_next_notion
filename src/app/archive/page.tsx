'use client'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import styles from './archive.module.css'
import { QuestionData } from '../../types/types'
import { normalizeContent } from '../../utils/format'
import AddQuestion from '../../components/AddQuestion'

interface ArchivedQuestion extends QuestionData {
  id: string
  error_reason: string
  submit_time: string
}

export default function Archive() {
  const [questions, setQuestions] = useState<ArchivedQuestion[]>([])
  const [knowledgePoints, setKnowledgePoints] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  const [showCatalog, setShowCatalog] = useState(false)
  const [showAddQuestion, setShowAddQuestion] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [questionsRes, pointsRes] = await Promise.all([
        fetch('/api/notion/questions'),
        fetch('/api/notion/knowledge-points')
      ])
      
      if (!questionsRes.ok || !pointsRes.ok) throw new Error('获取数据失败')
      
      const questionsData = await questionsRes.json()
      const pointsData = await pointsRes.json()
      
      setQuestions(questionsData.questions)
      setKnowledgePoints(pointsData.points)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionAdded = async () => {
    await fetchData()
    setShowAddQuestion(false)
  }

  const selectKnowledgePoint = (point: string) => {
    setSelectedPoint(currentPoint => currentPoint === point ? null : point)
  }

  const getQuestionCountByPoint = (point: string) => {
    return questions.filter(q => q.core_knowledge.includes(point)).length
  }

  const filteredQuestions = selectedPoint
    ? questions.filter(question => question.core_knowledge.includes(selectedPoint))
    : questions

  const toggleCatalog = () => {
    setShowCatalog(!showCatalog)
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
          <div className={styles.pointsList}>
            {knowledgePoints.map(point => {
              const count = getQuestionCountByPoint(point)
              if (count === 0) return null
              return (
                <div
                  key={point}
                  className={`${styles.pointItem} ${selectedPoint === point ? styles.selectedPoint : ''}`}
                  onClick={() => selectKnowledgePoint(point)}
                >
                  <span className={styles.pointText}>{point}</span>
                  <span className={styles.pointCount}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>题目归档</h1>
          <div className={styles.headerButtons}>
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
              {selectedPoint}: {filteredQuestions.length} 道题目
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
                {question.core_knowledge.map((point) => (
                  <span 
                    key={point} 
                    className={`${styles.tag} ${selectedPoint === point ? styles.selectedTag : ''}`}
                    onClick={() => selectKnowledgePoint(point)}
                  >
                    {point}
                  </span>
                ))}
              </div>
              <div className={styles.meta}>
                <p>错误原因: {question.error_reason || '未填写'}</p>
                <p>提交时间: {new Date(question.submit_time).toLocaleString()}</p>
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