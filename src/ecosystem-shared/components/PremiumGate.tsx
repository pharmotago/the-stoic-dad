import React from 'react';
import { useLicensing } from '../utils/licensing';

interface PremiumGateProps {
    children: React.ReactNode;
    fallback: React.ReactNode;
}

/**
 * Premium Gate Component
 * Controls visibility of features based on licensing status.
 */
export const PremiumGate: React.FC<PremiumGateProps> = ({ children, fallback }) => {
    const { isPremium, isLoaded } = useLicensing();

    if (!isLoaded) return null;

    if (isPremium) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
