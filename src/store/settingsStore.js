import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      // User profile
      profile: {
        name: 'Guest User',
        email: '',
        avatar: null,
        bio: '',
        role: 'user',
      },
      
      // App settings
      settings: {
        // Theme settings
        theme: 'system', // 'light', 'dark', 'system'
        accentColor: 'blue', // 'blue', 'purple', 'green', 'orange', 'red'
        
        // Display settings
        sidebarCollapsed: false,
        defaultView: 'grid', // 'grid', 'list'
        cardsPerRow: 3, // 2, 3, 4
        
        // Editor settings
        editorFontSize: 16, // in px
        editorLineHeight: 1.5,
        editorTabSize: 2,
        
        // Notification settings
        notificationsEnabled: true,
        emailNotifications: false,
        
        // Privacy settings
        shareUsageData: true,
        
        // AI model preferences
        defaultModel: 'gpt-4',
        
        // Language settings
        language: 'en', // 'en', 'es', 'fr', etc.
      },
      
      // Actions
      updateProfile: (updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        }));
      },
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...updates,
          },
        }));
      },
      
      resetSettings: () => {
        set((state) => ({
          settings: {
            // Theme settings
            theme: 'system',
            accentColor: 'blue',
            
            // Display settings
            sidebarCollapsed: false,
            defaultView: 'grid',
            cardsPerRow: 3,
            
            // Editor settings
            editorFontSize: 16,
            editorLineHeight: 1.5,
            editorTabSize: 2,
            
            // Notification settings
            notificationsEnabled: true,
            emailNotifications: false,
            
            // Privacy settings
            shareUsageData: true,
            
            // AI model preferences
            defaultModel: 'gpt-4',
            
            // Language settings
            language: 'en',
          },
        }));
      },
    }),
    {
      name: 'prompt-keeper-settings',
    }
  )
);

export default useSettingsStore; 