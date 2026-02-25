import { useState, useEffect } from 'react';

/**
 * Shared Licensing Engine
 * Manages premium status across all consumer applications.
 */

const PREMIUM_KEY = 'ecosystem_premium_status';
const ACCESS_CODE_KEY = 'ecosystem_access_code';

// Hardcoded master code for now (can be replaced with API check)
const MASTER_ACCESS_CODE = 'FLUENT2026';

export const useLicensing = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedStatus = localStorage.getItem(PREMIUM_KEY);
        const storedCode = localStorage.getItem(ACCESS_CODE_KEY);

        if (storedStatus === 'true' || storedCode === MASTER_ACCESS_CODE) {
            setIsPremium(true);
        }
        setIsLoaded(true);

        // Listen for changes from other tabs/apps
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === PREMIUM_KEY) {
                setIsPremium(e.newValue === 'true');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const unlockPremium = (code?: string) => {
        if (code && code.toUpperCase() === MASTER_ACCESS_CODE) {
            setIsPremium(true);
            localStorage.setItem(PREMIUM_KEY, 'true');
            localStorage.setItem(ACCESS_CODE_KEY, code.toUpperCase());
            return true;
        } else if (!code) {
            // Direct unlock (e.g. after successful payment)
            setIsPremium(true);
            localStorage.setItem(PREMIUM_KEY, 'true');
            return true;
        }
        return false;
    };

    const revokePremium = () => {
        setIsPremium(false);
        localStorage.removeItem(PREMIUM_KEY);
        localStorage.removeItem(ACCESS_CODE_KEY);
    };

    return {
        isPremium,
        isLoaded,
        unlockPremium,
        revokePremium
    };
};
