import { imageUrlUnknownRecord } from '@app/utils/utils'
import { useEffect, useState } from 'react'

export const useAvatar = (name: string | undefined, network: string) => {
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const run = async () => {
      const response = await fetch(imageUrlUnknownRecord(name!, network))
      const imgBlob = response && (await response.blob())
      const _src = URL.createObjectURL(imgBlob)
      if (imgBlob?.type.startsWith('image/')) {
        setAvatar(_src)
      }
    }
    if (name) {
      run()
    } else {
      setAvatar('')
    }
  }, [name, network])

  return avatar
}
