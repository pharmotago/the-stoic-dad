export const haptics = {
    success: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([50, 50, 100]); // Two shorts, one long
        }
    },
    error: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([50, 100, 50]); // Short, Long, Short
        }
    },
    tap: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10); // Very subtle tick
        }
    },
    impact: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(40); // Thud
        }
    },
    // Aliases for compatibility
    medium: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(40);
        }
    },
    light: () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
};
