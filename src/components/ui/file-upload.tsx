'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Upload, X, FileText, Image as ImageIcon, File, Loader2 } from 'lucide-react'
import { Button } from './button'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number // in bytes
  disabled?: boolean
  className?: string
}

export function FileUpload({
  onUpload,
  accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
  className
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File too large. Max size is ${(maxSize / (1024 * 1024)).toFixed(0)}MB`
    }
    return null
  }

  const handleFile = async (file: File) => {
    setError(null)
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [disabled])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragging && 'border-blue-500 bg-blue-50',
          !isDragging && 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          uploading && 'cursor-wait'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">
              Images, PDFs, documents up to {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

interface FilePreviewProps {
  fileName: string
  fileType?: string | null
  fileSize?: number | null
  onRemove?: () => void
  previewUrl?: string
}

export function FilePreview({
  fileName,
  fileType,
  fileSize,
  onRemove,
  previewUrl
}: FilePreviewProps) {
  const isImage = fileType?.startsWith('image/')

  const getIcon = () => {
    if (isImage) return <ImageIcon className="h-5 w-5" />
    if (fileType === 'application/pdf') return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatSize = (bytes: number | null | undefined) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
      {isImage && previewUrl ? (
        <img src={previewUrl} alt={fileName} className="w-10 h-10 object-cover rounded" />
      ) : (
        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500">
          {getIcon()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{fileName}</p>
        {fileSize && <p className="text-xs text-gray-400">{formatSize(fileSize)}</p>}
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-red-600"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
