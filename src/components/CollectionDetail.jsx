import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Share2 } from 'lucide-react';
import { Button } from './ui/Button';
import PromptCard from './PromptCard';
import usePromptStore from '../store/promptStore';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, getPromptsByCollection, deleteCollection } = usePromptStore();
  
  const collection = collections.find(col => col.id === id);
  const prompts = getPromptsByCollection(id);
  
  if (!collection) {
    // Handle case where collection is not found
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Collection not found</h1>
        <p className="text-muted-foreground mb-6">The collection you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/collections')}>
          View All Collections
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the "${collection.name}" collection?`)) {
      deleteCollection(id);
      navigate('/collections');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
            <p className="text-muted-foreground mb-4">
              {collection.description || `A collection of ${collection.name.toLowerCase()} prompts`}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{prompts.length} prompts</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">This collection is empty.</p>
          <p className="text-muted-foreground mb-4">Add prompts to this collection to see them here.</p>
          <Button onClick={() => navigate('/create')}>
            Create New Prompt
          </Button>
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

export default CollectionDetail; 