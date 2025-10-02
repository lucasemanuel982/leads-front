'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { trackingService } from '@/lib/tracking';
import trackingConfig from '@/lib/trackingConfig';

interface GTMProviderProps {
  children: React.ReactNode;
}

export default function GTMProvider({ children }: GTMProviderProps) {
  useEffect(() => {
    // Inicializa o tracking quando o componente monta
    trackingService.initializeGTM();
  }, []);

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${trackingConfig.gtmId}');
          `,
        }}
      />

      {/* Meta Pixel */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${trackingConfig.metaPixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Noscript tags para GTM */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${trackingConfig.gtmId}`}
          height="0"
          width="0"
          className="hidden"
        />
      </noscript>

      {children}
    </>
  );
}
