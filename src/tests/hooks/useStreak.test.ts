import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useStreak } from '@/hooks/useStreak';

describe('useStreak', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.useFakeTimers();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useStreak());
        expect(result.current.currentStreak).toBe(0);
        expect(result.current.longestStreak).toBe(0);
    });

    it('should increment streak if checking in today', () => {
        const { result } = renderHook(() => useStreak());

        act(() => {
            result.current.updateStreak();
        });

        expect(result.current.currentStreak).toBe(1);
        const saved = JSON.parse(localStorage.getItem('stoic-dad-streak-v2') || '{}');
        expect(saved.currentStreak).toBe(1);
    });

    it('should reset streak if missed a day', async () => {
        // Mock data from 2 days ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const oldData = {
            currentStreak: 5,
            longestStreak: 5,
            lastCheckIn: twoDaysAgo.toDateString()
        };
        localStorage.setItem('stoic-dad-streak-v2', JSON.stringify(oldData));

        const { result } = renderHook(() => useStreak());

        // Note: The hook doesn't internally reset on load, it just loads state.
        // The reset logic is in updateStreak when it compares lastCheckIn.
        act(() => {
            result.current.updateStreak();
        });

        expect(result.current.currentStreak).toBe(1); // Reset to 1 (new start)
    });
});
