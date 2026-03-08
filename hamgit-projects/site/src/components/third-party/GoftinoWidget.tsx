import React from 'react'
import Script from 'next/script'

interface GoftinoWidgetProps {
  /**
   * Goftino widget ID
   */
  widgetId: string
  /**
   * Strategy for loading the script
   * @default "afterInteractive"
   */
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload'
}

export const GoftinoWidget = ({ widgetId, strategy = 'afterInteractive' }: GoftinoWidgetProps) => {
  return (
    <Script
      id="goftino-widget"
      strategy={strategy}
      dangerouslySetInnerHTML={{
        __html: `!function(){var i="${widgetId}",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,
      }}
    />
  )
}
