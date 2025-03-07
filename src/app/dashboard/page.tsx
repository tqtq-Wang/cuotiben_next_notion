'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Dashboard from '../../components/Dashboard'
import styles from './dashboard.module.css'

interface Question {
  id: string
  core_knowledge: string[]
  submit_time: string
}

export default function DashboardPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/notion/questions')
      if (!res.ok) throw new Error('获取数据失败')
      const data = await res.json()
      setQuestions(data.questions)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>加载数据中...</p>
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
      <div className={styles.header}>
        <h1>数据看板</h1>
        <Link href="/archive" className={styles.backButton}>
          返回题目列表
        </Link>
      </div>
      <Dashboard questions={questions} />
    </div>
  )
} 