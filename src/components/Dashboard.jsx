import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowRight } from 'lucide-react';
import PromptCard from './PromptCard';
import RecommendationCard from './RecommendationCard';
import ProfileBadge from './ProfileBadge';
import { AchievementsSection } from './AchievementCard';
import AchievementToast from './AchievementToast';
import usePromptStore from '../store/promptStore';
import { promptRecommendations, promptTips } from '../data/recommendations';

const Dashboard = () => {
  const { 
    prompts, 
    getRecentPrompts, 
    getFavoritePrompts 
  } = usePromptStore();
  
  const recentPrompts = getRecentPrompts().slice(0, 3);
  const favoritePrompts = getFavoritePrompts().slice(0, 3);
  const allPrompts = prompts.slice(0, 6);
  
  // Get a random tip
  const randomTip = promptTips[Math.floor(Math.random() * promptTips.length)];
  
  // Get 2 random recommendations
  const shuffledRecommendations = [...promptRecommendations].sort(() => 0.5 - Math.random());
  const selectedRecommendations = shuffledRecommendations.slice(0, 2);

  return (
    <div className="space-y-8">
      <AchievementToast />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Prompt Keeper</h1>
        <p className="text-muted-foreground">
          Organize and manage your AI prompts efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileBadge />
        </div>
        <div className="hidden md:block">
          <div className="h-full rounded-lg border bg-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2">Create New Prompt</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Start crafting a new prompt to add to your collection
              </p>
            </div>
            <div className="flex justify-end">
              <Link 
                to="/create" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Prompt
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AchievementsSection />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          to="/favorites"
          className="group relative overflow-hidden rounded-lg border bg-background p-6 text-center hover:border-primary"
        >
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <div className="text-3xl text-muted-foreground group-hover:text-primary">⭐</div>
            <h3 className="font-medium">Favorite Prompts</h3>
            <p className="text-sm text-muted-foreground">
              Access your favorite prompts
            </p>
          </div>
        </Link>
        <Link
          to="/collections"
          className="group relative overflow-hidden rounded-lg border bg-background p-6 text-center hover:border-primary"
        >
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <div className="text-3xl text-muted-foreground group-hover:text-primary">📁</div>
            <h3 className="font-medium">Collections</h3>
            <p className="text-sm text-muted-foreground">
              Browse prompt collections
            </p>
          </div>
        </Link>
        <Link
          to="/recent"
          className="group relative overflow-hidden rounded-lg border bg-background p-6 text-center hover:border-primary"
        >
          <div className="flex h-full flex-col items-center justify-center space-y-2">
            <div className="text-3xl text-muted-foreground group-hover:text-primary">🕒</div>
            <h3 className="font-medium">Recent Prompts</h3>
            <p className="text-sm text-muted-foreground">
              View your recently used prompts
            </p>
          </div>
        </Link>
      </div>

      {/* Prompt Tip */}
      {randomTip && (
        <div className="rounded-lg border bg-muted/50 p-6">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💡</div>
            <div className="space-y-1">
              <h3 className="font-medium">Prompt Tip: {randomTip.title}</h3>
              <p className="text-sm text-muted-foreground">{randomTip.description}</p>
              <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                <strong>Example:</strong> {randomTip.example}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Prompts */}
      {recentPrompts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Recent Prompts</h2>
            <Link to="/recent" className="flex items-center text-sm text-primary hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      )}

      {/* Favorite Prompts */}
      {favoritePrompts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Favorite Prompts</h2>
            <Link to="/favorites" className="flex items-center text-sm text-primary hover:underline">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritePrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {selectedRecommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Recommended Prompts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedRecommendations.map((recommendation, index) => (
              <RecommendationCard key={index} recommendation={recommendation} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 