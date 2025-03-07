'use client'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { QuestionData, validateQuestionData } from '../types/types'
import styles from './AddQuestion.module.css'
import { normalizeContent } from '../utils/format'

interface AddQuestionProps {
  onSuccess: () => void
}

const EXAMPLE_JSON = `{
  "question": "求导数：\\( f(x) = e^{x^2} \\)",
  "solution_flow": "使用链式法则，将复合函数分解求导",
  "detailed_solution": "分解步骤：\\n1. 设外层函数为指数函数\\n2. 内层函数为二次函数\\n3. 应用链式法则：$$ f'(x) = 2x e^{x^2} $$",
  "core_knowledge": ["导数的计算", "链式法则"]
}`

export default function AddQuestion({ onSuccess }: AddQuestionProps) {
  const [data, setData] = useState<QuestionData | null>(null)
  const [errorReason, setErrorReason] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [inputError, setInputError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/json': ['.json'] },
    onDrop: files => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const parsedData = validateQuestionData(JSON.parse(e.target?.result as string))
          setData(parsedData)
          setInputError('')
        } catch (err: any) {
          setInputError(err.message)
        }
      }
      reader.readAsText(files[0])
    }
  })

  const handleJsonInput = (input: string) => {
    setJsonInput(input)
    try {
      if (input.trim()) {
        const parsed = JSON.parse(input)
        const validated = validateQuestionData(parsed)
        setData(validated)
        setInputError('')
      } else {
        setData(null)
        setInputError('')
      }
    } catch (err: any) {
      setInputError(err instanceof SyntaxError ? 'JSON 格式错误' : err.message)
      setData(null)
    }
  }

  const handleSubmit = async () => {
    if (!data) return
    setSubmitting(true)
    
    try {
      const res = await fetch('/api/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta: {
            error_reason: errorReason || '未填写',
            submit_time: new Date().toISOString()
          },
          content: data
        })
      })
      
      if (res.ok) {
        onSuccess()
      } else {
        throw new Error(`提交失败 (状态码: ${res.status})`)
      }
    } catch (err: any) {
      console.error('提交错误:', err)
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          <p>拖拽JSON文件到此区域或点击选择文件</p>
          <small>支持：.json 格式文件</small>
        </div>

        <div className={styles.jsonInputContainer}>
          <textarea
            value={jsonInput}
            onChange={(e) => handleJsonInput(e.target.value)}
            placeholder={EXAMPLE_JSON}
            className={styles.jsonEditor}
            spellCheck={false}
          />
          {inputError && <div className={styles.error}>{inputError}</div>}
        </div>

        <textarea
          value={errorReason}
          onChange={(e) => setErrorReason(e.target.value)}
          placeholder="错误原因分析（可选）"
          className={styles.reasonInput}
        />
      </div>

      {data && (
        <div className={styles.previewSection}>
          <h3>预览</h3>
          <div className={styles.preview}>
            <section className={styles.previewItem}>
              <h4>题目</h4>
              <div className={styles.previewContent}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {normalizeContent(data.question)}
                </ReactMarkdown>
              </div>
            </section>

            <section className={styles.previewItem}>
              <h4>核心知识点</h4>
              <div className={styles.tags}>
                {data.core_knowledge.map((point) => (
                  <span key={point} className={styles.tag}>{point}</span>
                ))}
              </div>
            </section>

            <section className={styles.previewItem}>
              <h4>解题思路</h4>
              <div className={styles.previewContent}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {normalizeContent(data.solution_flow)}
                </ReactMarkdown>
              </div>
            </section>

            <section className={styles.previewItem}>
              <h4>详细解答</h4>
              <div className={styles.previewContent}>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    p: ({ node, children, ...props }) => (
                      <p style={{ whiteSpace: 'pre-wrap' }} {...props}>
                        {children}
                      </p>
                    )
                  }}
                >
                  {normalizeContent(data.detailed_solution)}
                </ReactMarkdown>
              </div>
            </section>
          </div>
        </div>
      )}

      <button 
        onClick={handleSubmit}
        disabled={!data || submitting}
        className={styles.submitButton}
      >
        {submitting ? '提交中...' : '提交题目'}
      </button>
    </div>
  )
} 