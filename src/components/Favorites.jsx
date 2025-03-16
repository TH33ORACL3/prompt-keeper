import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from './ui/Button';
import PromptCard from './PromptCard';
import usePromptStore from '../store/promptStore';

const Favorites = () => {
  const { getFavoritePrompts } = usePromptStore();
  const favoritePrompts = getFavoritePrompts();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Favorite Prompts</h1>
          <p className="text-muted-foreground">
            Your collection of favorite prompts
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {favoritePrompts.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">You don't have any favorite prompts yet.</p>
          <p className="text-muted-foreground">Star prompts to add them to your favorites.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favoritePrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 