'use client'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js/auto'
import { Pie, Line, Radar } from 'react-chartjs-2'
import styles from './Dashboard.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
)

interface DashboardProps {
  questions: Array<{
    id: string
    core_knowledge: string[]
    submit_time: string
  }>
}

export default function Dashboard({ questions }: DashboardProps) {
  const [knowledgeStats, setKnowledgeStats] = useState<{ [key: string]: number }>({})
  const [timelineData, setTimelineData] = useState<{ [key: string]: number }>({})
  const [radarData, setRadarData] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    // 统计知识点分布
    const knowledgeCount: { [key: string]: number } = {}
    questions.forEach(q => {
      q.core_knowledge.forEach(point => {
        knowledgeCount[point] = (knowledgeCount[point] || 0) + 1
      })
    })
    setKnowledgeStats(knowledgeCount)

    // 统计提交时间分布
    const timeCount: { [key: string]: number } = {}
    questions.forEach(q => {
      const date = new Date(q.submit_time).toLocaleDateString()
      timeCount[date] = (timeCount[date] || 0) + 1
    })
    setTimelineData(timeCount)

    // 统计知识点覆盖率
    const totalPoints = Object.keys(knowledgeCount).length
    const coverage: { [key: string]: number } = {}
    Object.entries(knowledgeCount).forEach(([point, count]) => {
      coverage[point] = (count / questions.length) * 100
    })
    setRadarData(coverage)
  }, [questions])

  const pieData = {
    labels: Object.keys(knowledgeStats),
    datasets: [
      {
        data: Object.values(knowledgeStats),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  }

  const lineData = {
    labels: Object.keys(timelineData),
    datasets: [
      {
        label: '每日提交数量',
        data: Object.values(timelineData),
        fill: true,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)'
      }
    ]
  }

  const radarChartData = {
    labels: Object.keys(radarData),
    datasets: [
      {
        label: '知识点覆盖率 (%)',
        data: Object.values(radarData),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#36A2EB',
        pointBackgroundColor: '#36A2EB'
      }
    ]
  }

  return (
    <div className={styles.dashboard}>
      <h2>错题统计看板</h2>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>总题目数</h3>
          <div className={styles.statNumber}>{questions.length}</div>
        </div>
        <div className={styles.statCard}>
          <h3>知识点数</h3>
          <div className={styles.statNumber}>{Object.keys(knowledgeStats).length}</div>
        </div>
        <div className={styles.statCard}>
          <h3>最近7天</h3>
          <div className={styles.statNumber}>
            {Object.entries(timelineData)
              .filter(([date]) => {
                const dayDiff = (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24)
                return dayDiff <= 7
              })
              .reduce((sum, [_, count]) => sum + count, 0)}
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>知识点分布</h3>
          <div className={styles.chartContainer}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>提交趋势</h3>
          <div className={styles.chartContainer}>
            <Line 
              data={lineData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>知识点覆盖率</h3>
          <div className={styles.chartContainer}>
            <Radar 
              data={radarChartData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  )
} 