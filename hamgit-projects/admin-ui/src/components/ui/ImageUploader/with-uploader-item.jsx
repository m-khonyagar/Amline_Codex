import { useCallback, useEffect, useRef, useState } from 'react'

const withUploaderItem = (Component) =>
  function ImageUploaderItem({
    file,
    onChange,
    onRemove,
    uploadRequest,
    downloadRequest,
    ...props
  }) {
    const [loading, setLoading] = useState(true)
    const [src, setSrc] = useState(null)
    const hasUploadedRef = useRef(false)
    const abortRef = useRef()

    const upload = async () => {
      if (!uploadRequest || !!file.id) return

      if (['loading', 'success'].includes(file.uploadState)) {
        return
      }

      const clone = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      })

      try {
        clone.uploadState = 'loading'
        onChange?.(clone)

        abortRef.current = new AbortController()
        const response = await uploadRequest(clone, { signal: abortRef.current.signal })

        clone.uploadState = 'success'
        clone.uploadResponse = response
        onChange?.(clone)
      } catch (error) {
        clone.uploadState = 'error'
        clone.error = error
        onChange?.(clone)
      }
    }

    const handleRemove = () => {
      abortRef.current?.abort('cancel by user')
      setTimeout(() => {
        onRemove?.()
      }, 0)
    }

    const downloadFile = useCallback(async () => {
      if (file.url) {
        setSrc(file.url)
        setLoading(false)
        return
      }

      if (file instanceof File) {
        try {
          setSrc(URL.createObjectURL(file))
        } catch (er) {
          console.error(er)
        } finally {
          setLoading(false)
        }

        return
      }

      if (file.id) {
        try {
          const response = await downloadRequest(file.id)
          setSrc(URL.createObjectURL(response))
        } catch (er) {
          console.error(er)
        } finally {
          setLoading(false)
        }
      }
    }, [])

    const onFileLoad = () => {
      if (file instanceof File) {
        URL.revokeObjectURL(src)
      }
    }

    useEffect(() => {
      if (file instanceof File && !file.uploadState && !file.id && !hasUploadedRef.current) {
        hasUploadedRef.current = true
        upload()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      downloadFile()
    }, [downloadFile])

    return (
      <Component
        src={src}
        file={file}
        loading={loading}
        onRemove={handleRemove}
        onFileLoad={onFileLoad}
        {...props}
      />
    )
  }

export default withUploaderItem
