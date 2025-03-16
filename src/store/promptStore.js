import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { starterPrompts } from '../data/starterPrompts';
import useGamificationStore from './gamificationStore';

// Add versions to starter prompts
const starterPromptsWithVersions = starterPrompts.map(prompt => ({
  ...prompt,
  versions: [
    {
      versionId: '1',
      content: prompt.content,
      title: prompt.title,
      createdAt: prompt.createdAt,
      notes: 'Initial version'
    }
  ],
  activeVersionId: '1'
}));

const usePromptStore = create(
  persist(
    (set, get) => ({
      prompts: [...starterPromptsWithVersions],
      collections: [
        { id: 'writing', name: 'Writing', icon: '✍️' },
        { id: 'coding', name: 'Coding', icon: '💻' },
        { id: 'design', name: 'Design', icon: '🎨' },
        { id: 'business', name: 'Business', icon: '📊' },
        { id: 'academic', name: 'Academic', icon: '🎓' },
        { id: 'personal', name: 'Personal', icon: '🌟' },
      ],
      categories: [
        { id: 'writing', name: 'Writing', icon: '✍️' },
        { id: 'creative', name: 'Creative', icon: '🎨' },
        { id: 'technical', name: 'Technical', icon: '💻' },
        { id: 'business', name: 'Business', icon: '📊' },
        { id: 'academic', name: 'Academic', icon: '🎓' },
        { id: 'personal', name: 'Personal', icon: '🌟' },
      ],
      favorites: [],
      recentlyUsed: [],
      
      // Actions
      addPrompt: (prompt) => {
        const id = Date.now().toString();
        const newPrompt = {
          ...prompt,
          id,
          createdAt: new Date().toISOString(),
          lastUsed: null,
          usageCount: 0,
          versions: [
            {
              versionId: '1',
              content: prompt.content,
              title: prompt.title,
              createdAt: new Date().toISOString(),
              notes: prompt.versionNotes || 'Initial version'
            }
          ],
          activeVersionId: '1'
        };
        
        set((state) => ({ prompts: [...state.prompts, newPrompt] }));
        
        // Track gamification
        try {
          const gamificationStore = useGamificationStore.getState();
          if (gamificationStore && typeof gamificationStore.incrementPromptCount === 'function') {
            gamificationStore.incrementPromptCount();
          }
        } catch (error) {
          console.error('Failed to update gamification stats:', error);
        }
        
        return newPrompt;
      },
      
      updatePrompt: (id, updatedPrompt) => {
        set((state) => ({
          prompts: state.prompts.map((prompt) => 
            prompt.id === id ? { ...prompt, ...updatedPrompt } : prompt
          ),
        }));
      },
      
      // Add a new version to an existing prompt
      addPromptVersion: (promptId, version) => {
        const prompt = get().getPromptById(promptId);
        if (!prompt) return null;
        
        const newVersionId = (prompt.versions.length + 1).toString();
        const newVersion = {
          versionId: newVersionId,
          content: version.content,
          title: version.title || prompt.title,
          createdAt: new Date().toISOString(),
          notes: version.notes || `Version ${newVersionId}`
        };
        
        set((state) => ({
          prompts: state.prompts.map((p) => 
            p.id === promptId 
              ? { 
                  ...p, 
                  versions: [...p.versions, newVersion],
                  activeVersionId: newVersionId,
                  title: version.title || p.title,
                  content: version.content,
                  lastModified: new Date().toISOString()
                } 
              : p
          ),
        }));
        
        // Track gamification
        const gamificationStore = useGamificationStore.getState();
        gamificationStore.incrementVersionCount();
        
        return newVersionId;
      },
      
      // Set the active version of a prompt
      setActivePromptVersion: (promptId, versionId) => {
        const prompt = get().getPromptById(promptId);
        if (!prompt) return;
        
        const version = prompt.versions.find(v => v.versionId === versionId);
        if (!version) return;
        
        set((state) => ({
          prompts: state.prompts.map((p) => 
            p.id === promptId 
              ? { 
                  ...p, 
                  activeVersionId: versionId,
                  title: version.title,
                  content: version.content
                } 
              : p
          ),
        }));
      },
      
      // Delete a specific version (cannot delete if it's the only version)
      deletePromptVersion: (promptId, versionId) => {
        const prompt = get().getPromptById(promptId);
        if (!prompt || prompt.versions.length <= 1) return false;
        
        // If trying to delete the active version, set active to the most recent other version
        let newActiveVersionId = prompt.activeVersionId;
        if (prompt.activeVersionId === versionId) {
          const otherVersions = prompt.versions.filter(v => v.versionId !== versionId);
          const latestVersion = otherVersions.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          )[0];
          newActiveVersionId = latestVersion.versionId;
        }
        
        set((state) => ({
          prompts: state.prompts.map((p) => {
            if (p.id !== promptId) return p;
            
            const updatedVersions = p.versions.filter(v => v.versionId !== versionId);
            const activeVersion = updatedVersions.find(v => v.versionId === newActiveVersionId);
            
            return { 
              ...p, 
              versions: updatedVersions,
              activeVersionId: newActiveVersionId,
              title: activeVersion.title,
              content: activeVersion.content
            };
          }),
        }));
        
        return true;
      },
      
      // Delete an entire prompt with all its versions
      deletePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
          favorites: state.favorites.filter((favId) => favId !== id),
          recentlyUsed: state.recentlyUsed.filter((recentId) => recentId !== id),
        }));
      },
      
      // Clear all data (used for Delete All Data and Delete Account features)
      clearAllData: () => set({ 
        prompts: [],
        collections: [] 
      }),
      
      toggleFavorite: (id) => {
        set((state) => {
          const isFavorite = state.favorites.includes(id);
          return {
            favorites: isFavorite
              ? state.favorites.filter((favId) => favId !== id)
              : [...state.favorites, id],
          };
        });
      },
      
      usePrompt: (id) => {
        const prompt = get().prompts.find((p) => p.id === id);
        if (!prompt) return;
        
        // Update usage count and last used date
        set((state) => ({
          prompts: state.prompts.map((p) => 
            p.id === id 
              ? { 
                  ...p, 
                  usageCount: p.usageCount + 1, 
                  lastUsed: new Date().toISOString() 
                } 
              : p
          ),
          // Add to recently used (at the beginning) and remove duplicates
          recentlyUsed: [
            id,
            ...state.recentlyUsed.filter((recentId) => recentId !== id),
          ].slice(0, 10), // Keep only the 10 most recent
        }));
        
        // Track gamification
        const gamificationStore = useGamificationStore.getState();
        gamificationStore.incrementUsageCount();
        
        return prompt;
      },
      
      addCollection: (collection) => {
        const newCollection = {
          ...collection,
          id: collection.id || Date.now().toString(),
        };
        set((state) => ({ 
          collections: [...state.collections, newCollection] 
        }));
        
        // Track gamification
        const gamificationStore = useGamificationStore.getState();
        gamificationStore.incrementCollectionCount();
        
        return newCollection;
      },
      
      updateCollection: (id, updatedCollection) => {
        set((state) => ({
          collections: state.collections.map((collection) => 
            collection.id === id ? { ...collection, ...updatedCollection } : collection
          ),
        }));
      },
      
      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((collection) => collection.id !== id),
        }));
      },
      
      // Getters
      getPromptById: (id) => {
        return get().prompts.find((prompt) => prompt.id === id);
      },
      
      getPromptsByCollection: (collectionId) => {
        return get().prompts.filter((prompt) => 
          prompt.collectionId === collectionId
        );
      },
      
      getPromptsByCategory: (category) => {
        return get().prompts.filter((prompt) => 
          prompt.category === category
        );
      },
      
      getFavoritePrompts: () => {
        const { prompts, favorites } = get();
        return prompts.filter((prompt) => favorites.includes(prompt.id));
      },
      
      getRecentPrompts: () => {
        const { prompts, recentlyUsed } = get();
        // Map recentlyUsed IDs to actual prompt objects, preserving order
        return recentlyUsed
          .map((id) => prompts.find((prompt) => prompt.id === id))
          .filter(Boolean); // Remove any undefined entries
      },
      
      searchPrompts: (query) => {
        if (!query) return [];
        
        const lowerQuery = query.toLowerCase();
        return get().prompts.filter((prompt) => 
          prompt.title.toLowerCase().includes(lowerQuery) ||
          prompt.content.toLowerCase().includes(lowerQuery) ||
          prompt.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'prompt-keeper-storage',
    }
  )
);

export default usePromptStore; 