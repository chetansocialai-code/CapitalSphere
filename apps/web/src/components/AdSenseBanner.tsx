'use client';

import React, { useEffect } from 'react';

interface AdSenseBannerProps {
  slot?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export function AdSenseBanner({
  slot = '8646094970',
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Ignore double push errors in React strict mode
    }
  }, []);

  return (
    <div className={`my-6 text-center overflow-hidden min-h-[90px] cs-card flex flex-col items-center justify-center p-2 border cs-border ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Sponsored Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-2416474909531167"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
