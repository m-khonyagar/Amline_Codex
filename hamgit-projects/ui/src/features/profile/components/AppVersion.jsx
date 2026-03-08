import { useMemo } from 'react'
import { getClientInfo, isWebView } from '@/utils/webview'
import { cn } from '@/utils/dom'

function AppVersion({ className }) {
  const appInfo = useMemo(() => {
    if (!isWebView()) return null

    return getClientInfo()
  }, [])

  return appInfo?.version ? (
    <div className={cn(className, 'px-6 flex flex-col gap-1 items-center text-xs text-gray-500')}>
      <div>Amline App</div>
      <div>V {appInfo.version}</div>
    </div>
  ) : null
}

export default AppVersion
