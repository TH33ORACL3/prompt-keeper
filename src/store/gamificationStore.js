import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Achievement definitions
const achievements = [
  {
    id: 'first_prompt',
    name: 'Prompt Beginner',
    description: 'Create your first prompt',
    icon: '🏆',
    points: 10,
    type: 'prompt_count',
    threshold: 1
  },
  {
    id: 'prompt_master',
    name: 'Prompt Master',
    description: 'Create 10 prompts',
    icon: '🎯',
    points: 50,
    type: 'prompt_count',
    threshold: 10
  },
  {
    id: 'prompt_champion',
    name: 'Prompt Champion',
    description: 'Create 50 prompts',
    icon: '👑',
    points: 100,
    type: 'prompt_count',
    threshold: 50
  },
  {
    id: 'first_collection',
    name: 'Collector',
    description: 'Create your first collection',
    icon: '📁',
    points: 10,
    type: 'collection_count',
    threshold: 1
  },
  {
    id: 'organization_master',
    name: 'Organization Master',
    description: 'Create 5 collections',
    icon: '🗂️',
    points: 30,
    type: 'collection_count',
    threshold: 5
  },
  {
    id: 'daily_streak_3',
    name: 'Regular User',
    description: 'Use the app for 3 days in a row',
    icon: '📆',
    points: 15,
    type: 'streak',
    threshold: 3
  },
  {
    id: 'daily_streak_7',
    name: 'Committed User',
    description: 'Use the app for 7 days in a row',
    icon: '🔥',
    points: 30,
    type: 'streak',
    threshold: 7
  },
  {
    id: 'daily_streak_30',
    name: 'Power User',
    description: 'Use the app for 30 days in a row',
    icon: '⚡',
    points: 100,
    type: 'streak',
    threshold: 30
  },
  {
    id: 'first_version',
    name: 'Versioning Rookie',
    description: 'Create your first prompt version',
    icon: '🔄',
    points: 10,
    type: 'version_count',
    threshold: 1
  },
  {
    id: 'version_master',
    name: 'Versioning Pro',
    description: 'Create 10 prompt versions',
    icon: '⏱️',
    points: 25,
    type: 'version_count',
    threshold: 10
  },
  {
    id: 'prompt_usage_10',
    name: 'Prompt User',
    description: 'Use prompts 10 times',
    icon: '🚀',
    points: 15,
    type: 'usage_count',
    threshold: 10
  },
  {
    id: 'prompt_usage_50',
    name: 'Productivity Guru',
    description: 'Use prompts 50 times',
    icon: '💯',
    points: 50,
    type: 'usage_count',
    threshold: 50
  },
  {
    id: 'prompt_usage_100',
    name: 'AI Whisperer',
    description: 'Use prompts 100 times',
    icon: '🤖',
    points: 100,
    type: 'usage_count',
    threshold: 100
  }
];

// Calculate level from points
const calculateLevel = (points) => {
  // Simple level formula: level = 1 + floor(points / 100)
  return 1 + Math.floor(points / 100);
};

// Calculate XP progress to the next level (0-100)
const calculateLevelProgress = (points) => {
  const currentLevel = calculateLevel(points);
  const pointsForCurrentLevel = (currentLevel - 1) * 100;
  const pointsToNextLevel = currentLevel * 100;
  const pointsInCurrentLevel = points - pointsForCurrentLevel;
  return Math.round((pointsInCurrentLevel / (pointsToNextLevel - pointsForCurrentLevel)) * 100);
};

const useGamificationStore = create(
  persist(
    (set, get) => ({
      // User stats
      points: 0,
      streakDays: 0,
      lastLogin: null,
      maxStreakDays: 0,
      promptCount: 0,
      collectionCount: 0,
      versionCount: 0,
      usageCount: 0,
      unlockedAchievements: [],
      recentAchievements: [], // Store recently unlocked achievements to show in UI
      
      // All possible achievements
      achievements,
      
      // Clear recent achievements
      clearRecentAchievements: () => {
        set({ recentAchievements: [] });
      },
      
      // Track a login (updates streak)
      trackLogin: () => {
        const { lastLogin, streakDays, maxStreakDays } = get();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // If no previous login, start streak
        if (!lastLogin) {
          set({ 
            lastLogin: today.toISOString(),
            streakDays: 1
          });
          return;
        }
        
        const lastDate = new Date(lastLogin);
        const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          // Already logged in today, do nothing
          return;
        } else if (diffDays === 1) {
          // Consecutive day, increase streak
          const newStreakDays = streakDays + 1;
          set({ 
            lastLogin: today.toISOString(),
            streakDays: newStreakDays,
            maxStreakDays: Math.max(newStreakDays, maxStreakDays)
          });
          
          // Check streak achievements
          get().checkAchievements();
        } else {
          // Streak broken
          set({ 
            lastLogin: today.toISOString(),
            streakDays: 1
          });
        }
      },
      
      // Increment prompt count
      incrementPromptCount: () => {
        set((state) => ({
          promptCount: state.promptCount + 1
        }));
        get().checkAchievements();
      },
      
      // Increment collection count
      incrementCollectionCount: () => {
        set((state) => ({
          collectionCount: state.collectionCount + 1
        }));
        get().checkAchievements();
      },
      
      // Increment version count
      incrementVersionCount: () => {
        set((state) => ({
          versionCount: state.versionCount + 1
        }));
        get().checkAchievements();
      },
      
      // Increment usage count
      incrementUsageCount: () => {
        set((state) => ({
          usageCount: state.usageCount + 1
        }));
        get().checkAchievements();
      },
      
      // Check and unlock achievements
      checkAchievements: () => {
        const { 
          promptCount, 
          collectionCount, 
          streakDays, 
          versionCount, 
          usageCount, 
          unlockedAchievements 
        } = get();
        
        const newAchievements = [];
        
        // Check all achievements
        achievements.forEach((achievement) => {
          // Skip already unlocked achievements
          if (unlockedAchievements.includes(achievement.id)) return;
          
          let unlocked = false;
          
          // Check if the achievement should be unlocked
          switch (achievement.type) {
            case 'prompt_count':
              unlocked = promptCount >= achievement.threshold;
              break;
            case 'collection_count':
              unlocked = collectionCount >= achievement.threshold;
              break;
            case 'streak':
              unlocked = streakDays >= achievement.threshold;
              break;
            case 'version_count':
              unlocked = versionCount >= achievement.threshold;
              break;
            case 'usage_count':
              unlocked = usageCount >= achievement.threshold;
              break;
            default:
              break;
          }
          
          if (unlocked) {
            newAchievements.push(achievement);
          }
        });
        
        // If new achievements, update state
        if (newAchievements.length > 0) {
          const newUnlockedIds = newAchievements.map(a => a.id);
          const additionalPoints = newAchievements.reduce((sum, a) => sum + a.points, 0);
          
          set((state) => ({
            unlockedAchievements: [...state.unlockedAchievements, ...newUnlockedIds],
            recentAchievements: [...newAchievements],
            points: state.points + additionalPoints
          }));
        }
      },
      
      // Get level and progress
      getLevel: () => {
        return calculateLevel(get().points);
      },
      
      getLevelProgress: () => {
        return calculateLevelProgress(get().points);
      },
      
      // Get all unlocked achievement objects
      getUnlockedAchievements: () => {
        const { unlockedAchievements } = get();
        return achievements.filter(a => unlockedAchievements.includes(a.id));
      },
      
      // Reset all gamification data (for testing)
      resetGamification: () => {
        set({
          points: 0,
          streakDays: 0,
          lastLogin: null,
          maxStreakDays: 0,
          promptCount: 0,
          collectionCount: 0,
          versionCount: 0,
          usageCount: 0,
          unlockedAchievements: [],
          recentAchievements: []
        });
      }
    }),
    {
      name: 'prompt-keeper-gamification'
    }
  )
);

export default useGamificationStore; 