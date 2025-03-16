import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultSettings = {
  // Appearance
  theme: 'system', // 'light', 'dark', 'system'
  accentColor: 'blue', // 'blue', 'green', 'purple', 'orange', 'pink'
  fontSize: 'medium', // 'small', 'medium', 'large'
  
  // Display
  defaultView: 'grid', // 'grid', 'list'
  sidebarCollapsed: false,
  showPromptPreview: true,
  
  // Editor
  editorFontSize: 14,
  editorLineHeight: 1.5,
  editorTabSize: 2,
  
  // AI
  aiIntegration: true,
  defaultModel: 'gemini-2.0-flash',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
  apiKeys: {
    openai: '',
    anthropic: '',
    gemini: '',
    openrouter: ''
  },
  
  // Privacy
  saveHistory: true,
  collectUsageData: false,
  
  // Profile
  profile: {
    name: 'User',
    email: 'user@example.com',
    avatar: '',
    bio: 'AI prompt enthusiast',
    role: 'User'
  }
};

const useSettingsStore = create(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      updateSettings: (settings) => set((state) => ({
        ...state,
        ...settings
      })),
      
      updateProfile: (profile) => set((state) => ({
        ...state,
        profile: {
          ...state.profile,
          ...profile
        }
      })),
      
      resetSettings: () => set((state) => ({
        ...defaultSettings,
        // Preserve API keys and profile when resetting
        apiKeys: state.apiKeys,
        profile: state.profile
      })),
      
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontSize: (fontSize) => set({ fontSize }),
      setDefaultView: (defaultView) => set({ defaultView }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setShowPromptPreview: (showPromptPreview) => set({ showPromptPreview }),
      setEditorFontSize: (editorFontSize) => set({ editorFontSize }),
      setEditorLineHeight: (editorLineHeight) => set({ editorLineHeight }),
      setEditorTabSize: (editorTabSize) => set({ editorTabSize }),
      setDefaultModel: (defaultModel) => set({ defaultModel }),
      setApiEndpoint: (apiEndpoint) => set({ apiEndpoint }),
      setSaveHistory: (saveHistory) => set({ saveHistory }),
      setCollectUsageData: (collectUsageData) => set({ collectUsageData }),
      
      // AI integration methods
      setAiIntegration: (aiIntegration) => set({ aiIntegration }),
      updateApiKey: (provider, key) => set((state) => ({
        apiKeys: {
          ...state.apiKeys,
          [provider]: key
        }
      })),
      
      hasApiKey: () => {
        const state = get();
        console.log('[SettingsStore] Checking for any API keys...');
        
        // Log masked keys for debugging
        console.log('[SettingsStore] API Keys:', Object.fromEntries(
          Object.entries(state.apiKeys).map(([key, value]) => 
            [key, value && value.trim() !== '' ? 
              `${value.substring(0, 3)}...${value.substring(value.length - 3)} (length: ${value.length})` : 
              'none']
          )
        ));
        
        const hasAnyKey = Object.values(state.apiKeys).some(key => key && key.trim() !== '');
        console.log('[SettingsStore] Has any API key:', hasAnyKey);
        return hasAnyKey;
      },
      
      hasSpecificApiKey: (provider) => {
        const state = get();
        const key = state.apiKeys[provider] || '';
        const hasKey = key && key.trim() !== '';
        console.log(`[SettingsStore] Has ${provider} API key:`, hasKey);
        return hasKey;
      },
      
      getActiveApiKey: (provider) => {
        const state = get();
        const key = state.apiKeys[provider] || '';
        console.log(`[SettingsStore] Getting API key for ${provider}: ${key ? 'Key exists' : 'No key'}`);
        return key;
      }
    }),
    {
      name: 'prompt-keeper-settings',
      partialize: (state) => {
        // Keep API keys in localStorage to maintain them between sessions
        return state;
      }
    }
  )
);

export default useSettingsStore; 