import React, { useEffect } from 'react';
import { Flame } from 'lucide-react';
import useGamificationStore from '../store/gamificationStore';
import { Progress } from './ui/Progress';

const ProfileBadge = () => {
  const {
    points,
    streakDays,
    getLevel,
    getLevelProgress,
    trackLogin
  } = useGamificationStore();

  // Track login when component mounts
  useEffect(() => {
    trackLogin();
  }, [trackLogin]);

  const level = getLevel();
  const progress = getLevelProgress();

  return (
    <div className="flex flex-col space-y-3 bg-card rounded-lg border p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Profile</h3>
        <div className="flex items-center gap-1 text-amber-500">
          <Flame className="h-5 w-5" />
          <span className="font-medium">{streakDays} day streak</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-7 h-7 text-primary font-semibold mr-2">
              {level}
            </span>
            <span className="font-medium">Level {level}</span>
          </div>
          <span className="text-muted-foreground">{points} XP</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground text-right">
          {progress}% to Level {level + 1}
        </p>
      </div>
    </div>
  );
};

export default ProfileBadge; 