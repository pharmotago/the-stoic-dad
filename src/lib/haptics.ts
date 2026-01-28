"use client";

/**
 * Trigger haptic feedback if supported by the device.
 * @param pattern - A single number or array of numbers representing the vibration pattern in ms.
 */
export const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(pattern);
    }
};

export const hapticFeedback = {
    light: () => triggerHaptic(10),
    medium: () => triggerHaptic(20),
    heavy: () => triggerHaptic(50),
    success: () => triggerHaptic([20, 30, 20]),
    error: () => triggerHaptic([50, 100, 50]),
    pulse: () => triggerHaptic([10, 500, 10]),
};
