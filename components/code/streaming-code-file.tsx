"use client"

import { useEffect, useRef, useState } from 'react'
import { FileIcon } from 'lucide-react'
import { CodeFile } from '@/hooks/useCodeFiles'
import { cn } from '@/lib/utils'

// Import Prism core first
import Prism from 'prismjs'
// Then import theme and languages
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-javascript'

interface StreamingCodeFileProps {
  file: CodeFile
  className?: string
}

export function StreamingCodeFile({ file, className }: StreamingCodeFileProps) {
  const codeRef = useRef<HTMLElement>(null)
  const prevContentRef = useRef(file.content)
  const [visibleContent, setVisibleContent] = useState(file.content)
  
  // Detect new content and add it
  useEffect(() => {
    if (file.status === 'streaming' && file.content !== prevContentRef.current) {
      const newContent = file.content.substring(prevContentRef.current.length)
      prevContentRef.current = file.content
      
      if (newContent.length > 0) {
        // Update content immediately for real-time streaming
        setVisibleContent(prev => prev + newContent)
      }
    } else if (file.status === 'complete' && file.content !== visibleContent) {
      // If complete, show all content
      setVisibleContent(file.content)
      prevContentRef.current = file.content
    }
  }, [file.content, file.status, visibleContent])
  
  // Auto-scroll to keep the latest content in view
  useEffect(() => {
    if (typeof window !== 'undefined' && file.status === 'streaming') {
      window.scrollTo(0, document.body.scrollHeight)
    }
  }, [visibleContent, file.status])
  
  // Apply syntax highlighting
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined' && codeRef.current) {
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current)
      }
    }
  }, [visibleContent])
  
  // Derive language from file extension if not provided
  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase() || ''
    const langMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'tsx',
      'js': 'javascript',
      'jsx': 'jsx',
      'css': 'css',
      'json': 'json',
      'html': 'html',
      'md': 'markdown'
    }
    return langMap[extension] || 'javascript'
  }

  const language = file.language || getLanguageFromPath(file.path)
  
  return (
    <div 
      className={cn("mb-6 rounded-lg border bg-gradient-to-br from-slate-900 to-slate-800 shadow-md", className)}
    >
      <div className="bg-slate-700/70 px-4 py-3 border-b border-slate-600 flex items-center">
        <FileIcon className="h-4 w-4 mr-2 text-blue-400" />
        <span className="font-mono text-sm font-medium text-slate-200 flex-1 truncate">{file.path}</span>
        {file.status === 'streaming' && (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
            <span className="text-xs text-slate-200 font-medium">
              Streaming
            </span>
          </div>
        )}
      </div>
      <pre className={`language-${language} p-5 w-full`}>
        <code ref={codeRef} className={`language-${language} text-sm leading-relaxed`}>
          {visibleContent || '// Loading...'}
        </code>
      </pre>
    </div>
  )
} 