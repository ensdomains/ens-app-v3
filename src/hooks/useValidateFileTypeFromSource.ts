import { useQuery } from '@tanstack/react-query'

export type ValidateFileTypeOptions = {
  method?: 'HEAD' | 'GET'
  acceptedMimeTypes?: string[]
  enabled?: boolean
}

export type ValidationResult = {
  contentType: string | null
  isValid: boolean
}

const validateFileType = async (
  url: string,
  options: ValidateFileTypeOptions,
): Promise<ValidationResult> => {
  const { method = 'HEAD', acceptedMimeTypes = [] } = options

  const response = await fetch(url, {
    method,
    mode: 'cors',
    headers: {
      Accept: acceptedMimeTypes.length > 0 ? acceptedMimeTypes.join(', ') : '*/*',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const contentType = response.headers.get('Content-Type')
  const mimeType = contentType?.split(';')[0].trim().toLowerCase() || null

  // Validate MIME type
  let isValid = true
  if (acceptedMimeTypes.length > 0 && mimeType) {
    isValid = acceptedMimeTypes.some((accepted) => {
      const acceptedLower = accepted.toLowerCase()
      // Support wildcard patterns like "image/*"
      if (acceptedLower.endsWith('/*')) {
        const prefix = acceptedLower.slice(0, -2)
        return mimeType.startsWith(prefix)
      }
      return mimeType === acceptedLower
    })
  } else if (acceptedMimeTypes.length > 0 && !mimeType) {
    // If we expect specific MIME types but got none, it's invalid
    isValid = false
  }

  return {
    contentType: mimeType,
    isValid,
  }
}

export const useValidateFileTypeFromSource = (
  url: string | undefined,
  options: ValidateFileTypeOptions = {},
) => {
  const { enabled = true, ...validateOptions } = options

  const query = useQuery({
    queryKey: ['validate-file-type', url, validateOptions],
    queryFn: () => {
      if (!url) {
        throw new Error('No URL provided')
      }
      return validateFileType(url, validateOptions)
    },
    enabled: !!url && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  })

  return {
    ...query,
    isValid: query.data?.isValid ?? false,
    contentType: query.data?.contentType ?? null,
  }
}

// Convenience hook for validating images
export const useValidateImageFromSource = (url: string | undefined, enabled?: boolean) => {
  return useValidateFileTypeFromSource(url, {
    method: 'HEAD',
    acceptedMimeTypes: ['image/*'],
    enabled,
  })
}

// Convenience hook for validating documents
export const useValidateDocumentFromSource = (url: string | undefined, enabled?: boolean) => {
  return useValidateFileTypeFromSource(url, {
    method: 'HEAD',
    acceptedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    enabled,
  })
}

// Convenience hook for validating videos
export const useValidateVideoFromSource = (url: string | undefined, enabled?: boolean) => {
  return useValidateFileTypeFromSource(url, {
    method: 'HEAD',
    acceptedMimeTypes: ['video/*'],
    enabled,
  })
}

// Convenience hook for validating audio
export const useValidateAudioFromSource = (url: string | undefined, enabled?: boolean) => {
  return useValidateFileTypeFromSource(url, {
    method: 'HEAD',
    acceptedMimeTypes: ['audio/*'],
    enabled,
  })
}
