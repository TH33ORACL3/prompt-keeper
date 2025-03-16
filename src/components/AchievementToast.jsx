import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import useGamificationStore from '../store/gamificationStore';

const AchievementToast = () => {
  const { recentAchievements, clearRecentAchievements } = useGamificationStore();
  const [visibleAchievement, setVisibleAchievement] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  // Process achievements that come in
  useEffect(() => {
    if (recentAchievements.length > 0) {
      setQueue(prevQueue => [...prevQueue, ...recentAchievements]);
      clearRecentAchievements();
    }
  }, [recentAchievements, clearRecentAchievements]);
  
  // Process the queue
  useEffect(() => {
    if (queue.length > 0 && !visibleAchievement) {
      const [next, ...rest] = queue;
      setVisibleAchievement(next);
      setQueue(rest);
      setIsVisible(true);
      
      // Hide the toast after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        
        // After animation out, clear the achievement
        const clearTimer = setTimeout(() => {
          setVisibleAchievement(null);
        }, 500); // Match this to the CSS transition time
        
        return () => clearTimeout(clearTimer);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [queue, visibleAchievement]);
  
  if (!visibleAchievement) return null;
  
  return (
    <div 
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg border bg-card shadow-lg transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mr-4">
        <span className="text-2xl">{visibleAchievement.icon}</span>
      </div>
      <div>
        <div className="flex items-center mb-1">
          <Award className="h-4 w-4 text-amber-500 mr-2" />
          <h3 className="font-semibold">Achievement Unlocked!</h3>
        </div>
        <p className="font-medium">{visibleAchievement.name}</p>
        <p className="text-sm text-muted-foreground">{visibleAchievement.description}</p>
        <p className="text-xs text-amber-500 mt-1">+{visibleAchievement.points} XP</p>
      </div>
    </div>
  );
};

export default AchievementToast; 