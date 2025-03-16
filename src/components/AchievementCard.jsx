import React from 'react';
import { Award, LockIcon } from 'lucide-react';
import useGamificationStore from '../store/gamificationStore';

const AchievementCard = ({ achievement, unlocked }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg border ${
      unlocked ? 'bg-card' : 'bg-muted/50 opacity-75'
    }`}>
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
        unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
      }`}>
        {unlocked ? (
          <span className="text-2xl">{achievement.icon}</span>
        ) : (
          <LockIcon className="h-6 w-6" />
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="font-medium">{achievement.name}</h3>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        {unlocked && (
          <div className="mt-1 text-xs flex items-center text-amber-500">
            <Award className="h-3 w-3 mr-1" />
            <span>+{achievement.points} XP</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const AchievementsSection = () => {
  const { achievements, getUnlockedAchievements } = useGamificationStore();
  const unlockedAchievements = getUnlockedAchievements();
  const unlockedIds = unlockedAchievements.map(a => a.id);
  
  // Display first 4 unlocked achievements, or first 4 total if less than 4 are unlocked
  const displayAchievements = unlockedAchievements.length >= 4 
    ? unlockedAchievements.slice(0, 4) 
    : [
        ...unlockedAchievements,
        ...achievements
          .filter(a => !unlockedIds.includes(a.id))
          .slice(0, 4 - unlockedAchievements.length)
      ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Achievements</h2>
        <span className="text-sm text-muted-foreground">
          {unlockedAchievements.length} / {achievements.length} unlocked
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayAchievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id}
            achievement={achievement} 
            unlocked={unlockedIds.includes(achievement.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementCard; 