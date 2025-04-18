"use client"

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { useCodeFiles } from '@/hooks/useCodeFiles'
import { StreamingCodeFile } from './streaming-code-file'

interface CodeFilesFeedProps {
  projectId: string | null
}

export function CodeFilesFeed({ projectId }: CodeFilesFeedProps) {
  const { codeFiles, loading, error } = useCodeFiles(projectId)
  const feedEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to the bottom when new files are added or updated
  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [codeFiles])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading code files...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        Error loading code files: {error.message}
      </div>
    )
  }

  if (codeFiles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No code files generated yet. They&apos;ll appear here as they&apos;re created.
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      {codeFiles.map(file => (
        <StreamingCodeFile key={file.id} file={file} />
      ))}
      {/* Invisible element to scroll to */}
      <div ref={feedEndRef} />
    </div>
  )
} 