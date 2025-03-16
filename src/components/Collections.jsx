import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';
import { Button } from './ui/Button';
import usePromptStore from '../store/promptStore';

const Collections = () => {
  const { collections, getPromptsByCollection, addCollection } = usePromptStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      addCollection({
        name: newCollectionName.trim(),
        icon: '📁' // Default icon
      });
      setNewCollectionName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Collections</h1>
          <p className="text-muted-foreground">
            Organize your prompts into collections
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="h-4 w-4" />
          New Collection
        </Button>
      </div>

      {isCreating && (
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Create New Collection</h3>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
            />
            <Button onClick={handleCreateCollection}>Create</Button>
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {collections.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">You don't have any collections yet.</p>
          <p className="text-muted-foreground mb-4">Create a collection to organize your prompts.</p>
          <Button onClick={() => setIsCreating(true)}>
            Create Your First Collection
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => {
            const collectionPrompts = getPromptsByCollection(collection.id);
            return (
              <Link
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="group flex flex-col rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-2xl">{collection.icon || '📁'}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {collection.name}
                </h3>
                <div className="mt-auto text-sm text-muted-foreground">
                  <p>{collectionPrompts.length} prompts</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Collections; 