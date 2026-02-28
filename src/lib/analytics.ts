type AnalyticsEvent = {
    name: string;
    properties?: Record<string, any>;
    timestamp: number;
};

class AnalyticsEngine {
    private queue: AnalyticsEvent[] = [];
    private isInitialized = false;

    init() {
        if (typeof window === 'undefined') return;

        // Capture UTM parameters for marketing attribution
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams: Record<string, string> = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach(param => {
            const value = urlParams.get(param);
            if (value) utmParams[param] = value;
        });

        if (Object.keys(utmParams).length > 0) {
            localStorage.setItem('stoic_marketing_context', JSON.stringify({
                ...utmParams,
                first_touch: new Date().toISOString(),
                referrer: document.referrer
            }));
            this.track('marketing_context_captured', utmParams);
        }

        this.isInitialized = true;
        this.flush();
    }

    track(name: string, properties?: Record<string, any>) {
        if (typeof window === 'undefined') return;

        const event: AnalyticsEvent = {
            name,
            properties,
            timestamp: Date.now(),
        };

        this.queue.push(event);

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${name}`, properties);
        }

        // Simulating data send
        this.persist(event);
    }

    private persist(event: AnalyticsEvent) {
        try {
            const history = JSON.parse(localStorage.getItem('stoic_analytics') || '[]');
            history.push(event);
            // Keep last 1000 events
            if (history.length > 1000) history.shift();
            localStorage.setItem('stoic_analytics', JSON.stringify(history));
        } catch (e) {
            console.error('Analytics persistence failed', e);
        }
    }

    private flush() {
        // In a real app, this would send data to Segment/Mixpanel
    }
}

export const analytics = new AnalyticsEngine();

