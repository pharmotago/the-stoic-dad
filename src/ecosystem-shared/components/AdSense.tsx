import React, { useEffect } from 'react';

interface AdSenseProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    fullWidthResponsive?: boolean;
    className?: string;
}

/**
 * Shared AdSense Component
 * Unified ad rendering for the ecosystem.
 */
export const AdSense: React.FC<AdSenseProps> = ({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    className = ''
}) => {
    const pubId = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID : null;

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (e) {
            console.warn('AdSense push error:', e);
        }
    }, [adSlot]);

    if (!pubId) return null;

    return (
        <div className={`adsense-container my-4 overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={pubId}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
            />
        </div>
    );
};
