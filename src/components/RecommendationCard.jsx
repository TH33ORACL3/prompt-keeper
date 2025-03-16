import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import usePromptStore from '../store/promptStore';

const RecommendationCard = ({ recommendation }) => {
  const { prompts } = usePromptStore();
  
  // Get the actual prompt objects from the recommendation's prompt IDs
  const recommendedPrompts = recommendation.prompts
    .map(id => prompts.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 2); // Show max 2 prompts in the card
  
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{recommendation.icon}</div>
          <div>
            <h3 className="text-lg font-semibold">{recommendation.title}</h3>
            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          </div>
        </div>
        
        {recommendedPrompts.length > 0 && (
          <div className="mt-4 space-y-3">
            {recommendedPrompts.map(prompt => (
              <Link 
                key={prompt.id} 
                to={`/prompt/${prompt.id}`}
                className="block rounded-md border p-3 hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{prompt.title}</h4>
                    <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                      {prompt.content.substring(0, 60)}...
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Link 
            to={`/categories/${recommendation.prompts[0] ? prompts.find(p => p.id === recommendation.prompts[0])?.category : 'all'}`}
            className="text-sm text-primary hover:underline flex items-center"
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard; 