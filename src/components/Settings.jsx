import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from './ui/Tabs';
import { Switch } from './ui/Switch';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from './ui/Select';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from './ui/Dialog';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Layout, 
  Eye, 
  Type, 
  Code, 
  Bot, 
  Shield, 
  RotateCcw,
  Lock,
  AlertCircle,
  Check,
  Loader2,
  ArrowLeft,
  Save,
  RefreshCw,
  Key
} from 'lucide-react';
import useTheme from '../hooks/useTheme';
import useSettingsStore from '../hooks/useSettingsStore';
import aiService from '../services/aiService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const settings = useSettingsStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const navigate = useNavigate();
  
  // States for API keys
  const [openaiKey, setOpenaiKey] = useState(settings.getActiveApiKey('openai'));
  const [anthropicKey, setAnthropicKey] = useState(settings.getActiveApiKey('anthropic'));
  const [geminiKey, setGeminiKey] = useState(settings.getActiveApiKey('gemini'));
  const [openrouterKey, setOpenrouterKey] = useState(settings.getActiveApiKey('openrouter'));
  
  // State for showing the API keys
  const [showApiKeys, setShowApiKeys] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
    openrouter: false
  });

  // API connection testing state
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const [localSettings, setLocalSettings] = useState({
    theme: settings.theme,
    accentColor: settings.accentColor,
    fontSize: settings.fontSize,
    defaultView: settings.defaultView,
    sidebarCollapsed: settings.sidebarCollapsed,
    showPromptPreview: settings.showPromptPreview,
    editorFontSize: settings.editorFontSize,
    editorLineHeight: settings.editorLineHeight,
    editorTabSize: settings.editorTabSize,
    aiIntegration: settings.aiIntegration,
    defaultModel: settings.defaultModel,
    apiEndpoint: settings.apiEndpoint,
    geminiApiKey: settings.apiKeys.gemini || '',
    saveHistory: settings.saveHistory,
    collectUsageData: settings.collectUsageData,
    profile: { ...settings.profile }
  });
  
  useEffect(() => {
    // Update local settings when store changes
    setLocalSettings({
      theme: settings.theme,
      accentColor: settings.accentColor,
      fontSize: settings.fontSize,
      defaultView: settings.defaultView,
      sidebarCollapsed: settings.sidebarCollapsed,
      showPromptPreview: settings.showPromptPreview,
      editorFontSize: settings.editorFontSize,
      editorLineHeight: settings.editorLineHeight,
      editorTabSize: settings.editorTabSize,
      aiIntegration: settings.aiIntegration,
      defaultModel: settings.defaultModel,
      apiEndpoint: settings.apiEndpoint,
      geminiApiKey: settings.apiKeys.gemini || '',
      saveHistory: settings.saveHistory,
      collectUsageData: settings.collectUsageData,
      profile: { ...settings.profile }
    });
  }, [settings]);
  
  const handleResetSettings = () => {
    settings.resetSettings();
    setConfirmReset(false);
  };
  
  const handleApiKeyUpdate = (provider, value) => {
    switch(provider) {
      case 'openai':
        setOpenaiKey(value);
        break;
      case 'anthropic':
        setAnthropicKey(value);
        break;
      case 'gemini':
        setGeminiKey(value);
        break;
      case 'openrouter':
        setOpenrouterKey(value);
        break;
    }
  };
  
  const saveApiKey = (provider, key) => {
    console.log(`Saving API key for ${provider}: ${key ? 'Key provided' : 'No key'}`);
    
    // Update the key in settings
    settings.updateApiKey(provider, key);
    
    // If any key is set, enable AI integration
    if (key && key.trim() !== '') {
      console.log(`Enabling AI integration because ${provider} key was set`);
      settings.setAiIntegration(true);
    }
    
    toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} API key updated`);
  };
  
  const toggleShowApiKey = (provider) => {
    setShowApiKeys({
      ...showApiKeys,
      [provider]: !showApiKeys[provider]
    });
  };

  const handleTestApiConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      // First save the current settings
      settings.updateSettings({
        aiIntegration: localSettings.aiIntegration,
        defaultModel: localSettings.defaultModel,
        apiEndpoint: localSettings.apiEndpoint
      });
      
      // Update the API key
      settings.updateApiKey('gemini', localSettings.geminiApiKey);
      
      // Wait a moment for settings to be updated
      setTimeout(async () => {
        try {
          const result = await aiService.testApiConnection();
          
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        } catch (err) {
          console.error('API connection test error:', err);
          toast.error(`API test failed: ${err.message}`);
        } finally {
          setIsTestingConnection(false);
        }
      }, 100);
    } catch (error) {
      console.error('Failed to update settings before API test:', error);
      toast.error(`Failed to test API: ${error.message}`);
      setIsTestingConnection(false);
    }
  };

  const handleSaveSettings = () => {
    // Update all settings
    settings.updateSettings({
      theme: localSettings.theme,
      accentColor: localSettings.accentColor,
      fontSize: localSettings.fontSize,
      defaultView: localSettings.defaultView,
      sidebarCollapsed: localSettings.sidebarCollapsed,
      showPromptPreview: localSettings.showPromptPreview,
      editorFontSize: localSettings.editorFontSize,
      editorLineHeight: localSettings.editorLineHeight,
      editorTabSize: localSettings.editorTabSize,
      aiIntegration: localSettings.aiIntegration,
      defaultModel: localSettings.defaultModel,
      apiEndpoint: localSettings.apiEndpoint,
      saveHistory: localSettings.saveHistory,
      collectUsageData: localSettings.collectUsageData
    });
    
    // Update API keys separately
    settings.updateApiKey('gemini', localSettings.geminiApiKey);
    
    // Update profile separately
    settings.updateProfile(localSettings.profile);
    
    toast.success('Settings saved successfully');
  };
  
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings({
      ...localSettings,
      [name]: value
    });
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings({
      ...localSettings,
      profile: {
        ...localSettings.profile,
        [name]: value
      }
    });
  };
  
  const handleSwitchChange = (name, checked) => {
    setLocalSettings({
      ...localSettings,
      [name]: checked
    });
  };
  
  const handleSelectChange = (name, value) => {
    setLocalSettings({
      ...localSettings,
      [name]: value
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="ai">AI Integration</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Theme</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                className="flex items-center gap-2"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Accent Color</h2>
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'blue', color: '#3b82f6' },
                  { name: 'green', color: '#10b981' },
                  { name: 'purple', color: '#8b5cf6' },
                  { name: 'orange', color: '#f97316' },
                  { name: 'pink', color: '#ec4899' }
                ].map((color) => (
                  <button
                    key={color.name}
                    onClick={() => settings.setAccentColor(color.name)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      settings.accentColor === color.name ? 'ring-2 ring-offset-2 ring-offset-background' : ''
                    }`}
                    style={{ backgroundColor: color.color }}
                    aria-label={`Set ${color.name} as accent color`}
                  >
                    {settings.accentColor === color.name && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Choose an accent color for buttons and interactive elements
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Font Size</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fontSize">Interface font size</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={settings.setFontSize}
                >
                  <SelectTrigger id="fontSize">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="display" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Layout</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="defaultView">Default view</Label>
                <Select
                  value={settings.defaultView}
                  onValueChange={settings.setDefaultView}
                >
                  <SelectTrigger id="defaultView">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose how prompts are displayed by default
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sidebarCollapsed">Sidebar collapsed</Label>
                  <p className="text-sm text-muted-foreground">
                    Start with the sidebar collapsed
                  </p>
                </div>
                <Switch
                  id="sidebarCollapsed"
                  checked={settings.sidebarCollapsed}
                  onCheckedChange={settings.setSidebarCollapsed}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showPromptPreview">Show prompt previews</Label>
                  <p className="text-sm text-muted-foreground">
                    Display a preview of prompt content in cards
                  </p>
                </div>
                <Switch
                  id="showPromptPreview"
                  checked={settings.showPromptPreview}
                  onCheckedChange={settings.setShowPromptPreview}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">AI Integration</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect with AI services to enhance prompt creation and management
                </p>
              </div>
              <Switch
                id="aiIntegration"
                checked={settings.aiIntegration}
                onCheckedChange={settings.setAiIntegration}
              />
            </div>
            
            <div className="grid gap-4 mt-6">
              <div className="grid gap-2">
                <Label htmlFor="apiEndpoint">Custom API endpoint</Label>
                <Input
                  id="apiEndpoint"
                  placeholder="https://api.example.com"
                  value={settings.apiEndpoint}
                  onChange={(e) => settings.setApiEndpoint(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to use the default endpoint
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">API Keys</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your API keys are stored securely and never sent to our servers.
                They are only used to make requests to the respective AI services.
              </p>
              
              <div className="space-y-6">
                {/* OpenAI API Key */}
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="openaiKey" className="text-base font-medium">OpenAI</Label>
                    {openaiKey && openaiKey.trim() !== '' && (
                      <div className="flex items-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Connected</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="openaiKey"
                        type={showApiKeys.openai ? "text" : "password"}
                        value={openaiKey}
                        onChange={(e) => handleApiKeyUpdate('openai', e.target.value)}
                        placeholder="sk-..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => toggleShowApiKey('openai')}
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      onClick={() => saveApiKey('openai', openaiKey)}
                      disabled={!openaiKey || openaiKey === settings.getActiveApiKey('openai')}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For models like GPT-4 and GPT-3.5-Turbo
                  </p>
                </div>
                
                {/* Anthropic API Key */}
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="anthropicKey" className="text-base font-medium">Anthropic</Label>
                    {anthropicKey && anthropicKey.trim() !== '' && (
                      <div className="flex items-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Connected</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="anthropicKey"
                        type={showApiKeys.anthropic ? "text" : "password"}
                        value={anthropicKey}
                        onChange={(e) => handleApiKeyUpdate('anthropic', e.target.value)}
                        placeholder="sk-ant-..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => toggleShowApiKey('anthropic')}
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      onClick={() => saveApiKey('anthropic', anthropicKey)}
                      disabled={!anthropicKey || anthropicKey === settings.getActiveApiKey('anthropic')}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For Claude 3 models (Opus, Sonnet, Haiku)
                  </p>
                </div>
                
                {/* Google Gemini API Key */}
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="geminiKey" className="text-base font-medium">Google Gemini</Label>
                    {geminiKey && geminiKey.trim() !== '' && (
                      <div className="flex items-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Connected</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="geminiKey"
                        type={showApiKeys.gemini ? "text" : "password"}
                        value={geminiKey}
                        onChange={(e) => handleApiKeyUpdate('gemini', e.target.value)}
                        placeholder="AIza..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => toggleShowApiKey('gemini')}
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      onClick={() => saveApiKey('gemini', geminiKey)}
                      disabled={!geminiKey || geminiKey === settings.getActiveApiKey('gemini')}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For Gemini Pro and Gemini Flash models
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                    <p className="font-medium mb-1">Example API call:</p>
                    <pre className="bg-muted p-2 rounded text-[10px] overflow-x-auto">
                      {`curl "${settings.apiEndpoint}/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY" \\
-H 'Content-Type: application/json' \\
-X POST \\
-d '{
  "contents": [{
    "parts":[{"text": "Your prompt here"}]
  }]
}'`}
                    </pre>
                  </div>
                </div>
                
                {/* OpenRouter API Key */}
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="openrouterKey" className="text-base font-medium">OpenRouter</Label>
                    {openrouterKey && openrouterKey.trim() !== '' && (
                      <div className="flex items-center text-sm text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span>Connected</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="openrouterKey"
                        type={showApiKeys.openrouter ? "text" : "password"}
                        value={openrouterKey}
                        onChange={(e) => handleApiKeyUpdate('openrouter', e.target.value)}
                        placeholder="sk-or-..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => toggleShowApiKey('openrouter')}
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      onClick={() => saveApiKey('openrouter', openrouterKey)}
                      disabled={!openrouterKey || openrouterKey === settings.getActiveApiKey('openrouter')}
                    >
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Access to multiple models through a single API
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Default Model</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select the default AI model to use for suggestions and recommendations
              </p>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="defaultModel">Model</Label>
                  <Select
                    value={settings.defaultModel}
                    onValueChange={settings.setDefaultModel}
                  >
                    <SelectTrigger id="defaultModel">
                      <SelectValue placeholder="Select default model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">OpenAI - GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">OpenAI - GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3-opus">Anthropic - Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Anthropic - Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Anthropic - Claude 3 Haiku</SelectItem>
                      <SelectItem value="gemini-pro">Google - Gemini Pro</SelectItem>
                      <SelectItem value="gemini-flash">Google - Gemini Flash</SelectItem>
                      <SelectItem value="gemini-2.0-flash">Google - Gemini 2.0 Flash</SelectItem>
                      <SelectItem value="openrouter">OpenRouter - Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-4 mt-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-400">Important Note</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    API keys are stored locally in your browser and are never transmitted to our servers.
                    Make sure you have sufficient credits with your AI provider to use these features.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mt-6">
                <h3 className="text-md font-semibold">Test API Connection</h3>
                <Button 
                  onClick={handleTestApiConnection} 
                  disabled={
                    !settings.aiIntegration || 
                    (!settings.hasSpecificApiKey('gemini') && 
                     (!geminiKey || geminiKey.trim() === ''))
                  }
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Editor Settings</h2>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editorFontSize">Editor font size</Label>
                <Input
                  id="editorFontSize"
                  type="number"
                  value={settings.editorFontSize}
                  onChange={(e) => settings.setEditorFontSize(Number(e.target.value))}
                  min={10}
                  max={24}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="editorLineHeight">Line height</Label>
                <Select
                  value={settings.editorLineHeight.toString()}
                  onValueChange={(value) => settings.setEditorLineHeight(Number(value))}
                >
                  <SelectTrigger id="editorLineHeight">
                    <SelectValue placeholder="Select line height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Compact (1.0)</SelectItem>
                    <SelectItem value="1.5">Normal (1.5)</SelectItem>
                    <SelectItem value="2">Relaxed (2.0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="editorTabSize">Tab size</Label>
                <Select
                  value={settings.editorTabSize.toString()}
                  onValueChange={(value) => settings.setEditorTabSize(Number(value))}
                >
                  <SelectTrigger id="editorTabSize">
                    <SelectValue placeholder="Select tab size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Privacy</h2>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="saveHistory">Save prompt history</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep a record of your prompt usage history
                  </p>
                </div>
                <Switch
                  id="saveHistory"
                  checked={settings.saveHistory}
                  onCheckedChange={settings.setSaveHistory}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collectUsageData">Collect anonymous usage data</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve the app by sharing anonymous usage statistics
                  </p>
                </div>
                <Switch
                  id="collectUsageData"
                  checked={settings.collectUsageData}
                  onCheckedChange={settings.setCollectUsageData}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset all settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Settings</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset all settings to their default values? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleResetSettings}>
                    Reset Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 