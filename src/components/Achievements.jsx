import React from 'react';
import { Trophy, Award } from 'lucide-react';
import useGamificationStore from '../store/gamificationStore';
import { Progress } from './ui/Progress';

const AchievementItem = ({ achievement, unlocked }) => {
  return (
    <div className={`flex items-center p-5 rounded-lg border ${
      unlocked ? 'bg-card' : 'bg-muted/50 opacity-75'
    }`}>
      <div className={`flex items-center justify-center w-16 h-16 rounded-full mr-5 ${
        unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
      }`}>
        {unlocked ? (
          <span className="text-3xl">{achievement.icon}</span>
        ) : (
          <Trophy className="h-8 w-8 opacity-40" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium">{achievement.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
        {unlocked ? (
          <div className="flex items-center text-amber-500 text-sm">
            <Award className="h-4 w-4 mr-1" />
            <span>{achievement.points} XP earned</span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Unlock this achievement to earn {achievement.points} XP
          </div>
        )}
      </div>
    </div>
  );
};

const Achievements = () => {
  const { 
    achievements, 
    getUnlockedAchievements, 
    points, 
    getLevel, 
    getLevelProgress,
    streakDays,
    maxStreakDays,
    promptCount,
    usageCount 
  } = useGamificationStore();
  
  const unlockedAchievements = getUnlockedAchievements();
  const unlockedIds = unlockedAchievements.map(a => a.id);
  const level = getLevel();
  const progress = getLevelProgress();
  
  // Group achievements by type
  const achievementGroups = [
    {
      title: 'Prompt Creation',
      type: 'prompt_count',
      progress: {
        current: promptCount,
        next: getNextThreshold(promptCount, achievements.filter(a => a.type === 'prompt_count').map(a => a.threshold))
      }
    },
    {
      title: 'Daily Streaks',
      type: 'streak',
      progress: {
        current: streakDays,
        next: getNextThreshold(streakDays, achievements.filter(a => a.type === 'streak').map(a => a.threshold))
      }
    },
    {
      title: 'Prompt Usage',
      type: 'usage_count',
      progress: {
        current: usageCount,
        next: getNextThreshold(usageCount, achievements.filter(a => a.type === 'usage_count').map(a => a.threshold))
      }
    },
    {
      title: 'Other Achievements',
      type: 'other',
      progress: null
    }
  ];
  
  // Helper function to find the next threshold to reach
  function getNextThreshold(current, thresholds) {
    const sorted = [...thresholds].sort((a, b) => a - b);
    for (const threshold of sorted) {
      if (threshold > current) {
        return threshold;
      }
    }
    return null; // All thresholds reached
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock rewards
        </p>
      </div>
      
      <div className="bg-card rounded-lg border p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mr-4">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Level {level}</h2>
                <p className="text-sm text-muted-foreground">
                  {unlockedAchievements.length} of {achievements.length} achievements unlocked
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px] max-w-md space-y-2">
            <div className="flex justify-between text-sm">
              <span>XP: {points}</span>
              <span>Next level: {(level * 100)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{streakDays}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{maxStreakDays}</div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </div>
        </div>
      </div>
      
      {achievementGroups.map((group) => {
        const groupAchievements = achievements.filter(a => 
          group.type === 'other' 
            ? !['prompt_count', 'streak', 'usage_count'].includes(a.type) 
            : a.type === group.type
        );
        
        if (groupAchievements.length === 0) return null;
        
        return (
          <div key={group.title} className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{group.title}</h2>
              
              {group.progress && (
                <div className="space-y-2 mb-4 max-w-md">
                  <div className="flex justify-between text-sm">
                    <span>Current: {group.progress.current}</span>
                    {group.progress.next && (
                      <span>Next: {group.progress.next}</span>
                    )}
                  </div>
                  {group.progress.next && (
                    <Progress 
                      value={(group.progress.current / group.progress.next) * 100} 
                      className="h-2" 
                    />
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupAchievements.map((achievement) => (
                  <AchievementItem 
                    key={achievement.id} 
                    achievement={achievement} 
                    unlocked={unlockedIds.includes(achievement.id)} 
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Achievements; 