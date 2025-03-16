import React from 'react';
import { useParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Button } from './ui/Button';
import PromptCard from './PromptCard';
import usePromptStore from '../store/promptStore';

const Category = () => {
  const { category } = useParams();
  const { getPromptsByCategory } = usePromptStore();
  const prompts = getPromptsByCategory(category);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {category.charAt(0).toUpperCase() + category.slice(1)} Prompts
          </h1>
          <p className="text-muted-foreground">
            Browse prompts in the {category} category
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">No prompts found in this category.</p>
          <p className="text-muted-foreground">Try a different category or create a new prompt.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category; 