'use client';

import { useEffect, useRef } from 'react';

type AdUnitProps = {
    slotId: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
    responsive?: boolean;
};

export function AdUnit({ slotId, format = 'auto', className = '', responsive = true }: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
    if (!pId) return null; // Don't render empty block if no ID

    return (
        <div className={`ad-container overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={pId}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
}
