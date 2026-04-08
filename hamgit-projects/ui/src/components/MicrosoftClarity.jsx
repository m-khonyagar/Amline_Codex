import React from 'react'
import Script from 'next/script'
import { isProduction } from '@/utils/environment'

function MicrosoftClarity() {
  return isProduction() ? (
    <Script id="microsoft-clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "piopoack8e");
      `}
    </Script>
  ) : null
}

export default MicrosoftClarity
