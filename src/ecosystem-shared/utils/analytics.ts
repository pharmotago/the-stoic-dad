/**
 * Ecosystem Analytics Utility
 * Unified tracking layer for cross-app engagement.
 */

type AnalyticsEvent = {
    app: 'the-signal' | 'pharmaclinix' | 'stoic-dad' | 'language-coach';
    event: string;
    params?: Record<string, any>;
};

export const trackEvent = ({ app, event, params }: AnalyticsEvent) => {
    const timestamp = new Date().toISOString();
    const payload = {
        timestamp,
        app,
        event,
        ...params,
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // For now, we log to console in a structured way
    // This can be easily replaced with GA4, Mixpanel, or a custom Supabase sink
    console.group(`[Ecosystem Analytics] ${app}:${event}`);
    console.log('Payload:', payload);
    console.groupEnd();

    // If a global listener exists (e.g. for a dashboard app)
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ecosystem-analytics', { detail: payload }));
    }
};

export const useAnalytics = (app: AnalyticsEvent['app']) => {
    return {
        track: (event: string, params?: Record<string, any>) => trackEvent({ app, event, params }),
        trackPageView: () => trackEvent({ app, event: 'page_view' })
    };
};
