import { describe, it, expect } from 'vitest';
import { calculateLevel, getLevelProgress, XP_CONSTANTS, LEVELS } from '../lib/gamification';

describe('Gamification Logic', () => {
    it('should calculate initial level correctly', () => {
        const levelInfo = calculateLevel(0);
        expect(levelInfo.level).toBe(1);
        expect(levelInfo.title).toBe('Novice');
    });

    it('should level up accurately based on XP', () => {
        // Apprentice starts at 100
        expect(calculateLevel(100).level).toBe(2);
        // Prokopton starts at 250
        expect(calculateLevel(250).level).toBe(3);
    });

    it('should calculate progress percentage within a level', () => {
        // Level 1: 0 -> 100
        expect(getLevelProgress(50)).toBe(50);

        // Level 2: 100 -> 250 (range 150)
        // 175 is 75/150 = 50%
        expect(getLevelProgress(175)).toBe(50);
    });

    it('should return 100% for max level', () => {
        const maxLevelXp = LEVELS[LEVELS.length - 1].minXp + 1000;
        expect(getLevelProgress(maxLevelXp)).toBe(100);
    });

    it('should handle XP constants correctly', () => {
        expect(XP_CONSTANTS.COMPLETE_QUIZ).toBe(50);
        expect(XP_CONSTANTS.READ_LESSON).toBe(10);
    });
});
