import useSettingsStore from '../hooks/useSettingsStore';

/**
 * AI Service for integrating with various AI providers
 */
class AiService {
  constructor() {
    this.settingsStore = null;
    this.initialize();
  }
  
  /**
   * Initialize the AI service with the settings store
   */
  initialize() {
    try {
      // Get the store state directly
      this.settingsStore = useSettingsStore.getState();
      console.log('[AIService] Initialized with settings:', {
        aiIntegration: this.settingsStore.aiIntegration,
        hasGeminiKey: !!this.settingsStore.apiKeys.gemini
      });
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }
  
  /**
   * Check if AI integration is enabled and an API key is available
   * @returns {boolean}
   */
  isAiEnabled() {
    if (!this.settingsStore) this.initialize();
    
    try {
      const aiIntegration = this.settingsStore.aiIntegration;
      const hasGeminiKey = !!this.settingsStore.apiKeys.gemini && this.settingsStore.apiKeys.gemini.trim() !== '';
      
      console.log('[AIService] AI Integration Status Check:', { 
        aiIntegration: aiIntegration, 
        hasGeminiKey: hasGeminiKey
      });
      
      return aiIntegration && hasGeminiKey;
    } catch (error) {
      console.error('Error checking AI enabled status:', error);
      return false;
    }
  }
  
  /**
   * Get the configuration for the specified provider
   * @param {string} provider - The AI provider to use (openai, anthropic, gemini, openrouter)
   * @returns {Object|null} - Configuration object or null if provider not available
   */
  getProviderConfig(provider) {
    if (!this.settingsStore) this.initialize();
    
    const apiKey = this.settingsStore.getActiveApiKey(provider);
    if (!apiKey) return null;
    
    switch (provider) {
      case 'openai':
        return {
          baseUrl: 'https://api.openai.com/v1',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        };
      case 'anthropic':
        return {
          baseUrl: 'https://api.anthropic.com/v1',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
            'anthropic-version': '2023-06-01'
          }
        };
      case 'gemini':
        return {
          baseUrl: `https://generativelanguage.googleapis.com/v1beta/models`,
          apiKey
        };
      case 'openrouter':
        return {
          baseUrl: 'https://openrouter.ai/api/v1',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin
          }
        };
      default:
        return null;
    }
  }
  
  /**
   * Get the active provider based on the default model
   * @returns {string} Provider name
   */
  getActiveProvider() {
    if (!this.settingsStore) this.initialize();
    
    const model = this.settingsStore.defaultModel;
    
    if (model.startsWith('gpt-')) return 'openai';
    if (model.startsWith('claude-')) return 'anthropic';
    if (model.startsWith('gemini-')) return 'gemini';
    if (model === 'openrouter') return 'openrouter';
    
    // Default to OpenAI if unrecognized
    return 'openai';
  }
  
  /**
   * Get the API key for the active provider
   * @returns {string|null} The API key or null if not found
   */
  getApiKey() {
    if (!this.settingsStore) this.initialize();
    
    const provider = this.getActiveProvider();
    const apiKey = this.settingsStore.getActiveApiKey(provider);
    
    console.log(`[AIService] Getting API key for provider: ${provider}`, 
      apiKey ? `Key exists (length: ${apiKey.length})` : 'No key found');
    
    return apiKey;
  }
  
  /**
   * Make a direct request to the Gemini API
   * @param {string} prompt - The prompt to send
   * @returns {Promise<string>} - The response from the API
   */
  async callGeminiApi(prompt) {
    if (!this.settingsStore) this.initialize();
    
    // Get the API key and ensure it exists
    const apiKey = this.settingsStore.apiKeys.gemini;
    console.log('[AIService] Calling Gemini API with key:', apiKey ? `Key length: ${apiKey.length}` : 'No key found');
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('No API key found for Gemini. Please add an API key in Settings.');
    }
    
    // Set up API endpoint and model
    const apiEndpoint = this.settingsStore.apiEndpoint || 'https://generativelanguage.googleapis.com/v1beta';
    let model = 'gemini-1.0-pro';
    
    // Select the model based on the defaultModel setting
    if (this.settingsStore.defaultModel === 'gemini-2.0-flash') {
      model = 'gemini-2.0-flash';
    } else if (this.settingsStore.defaultModel === 'gemini-flash') {
      model = 'gemini-1.0-pro-latest';
    }
    
    console.log(`[AIService] Using model: ${model} with endpoint: ${apiEndpoint}`);
    const url = `${apiEndpoint}/models/${model}:generateContent?key=${apiKey}`;
    
    try {
      // Make the API request
      console.log(`Making API request to ${model}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
            topP: 0.95,
            topK: 40
          }
        }),
      });
      
      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || 'API Error';
        } catch (e) {
          // If we can't parse the JSON, use the status text
          errorMessage = response.statusText;
        }
        throw new Error(`Gemini API Error: ${errorMessage}`);
      }
      
      const data = await response.json();
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from API');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
  
  /**
   * Test the API connection
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async testApiConnection() {
    console.log('Testing API connection - checking if AI is enabled...');
    const aiEnabled = this.isAiEnabled();
    console.log('AI enabled:', aiEnabled);
    
    if (!aiEnabled) {
      console.log('AI integration is not enabled or no API key is set');
      return {
        success: false, 
        message: 'AI integration is not enabled or no API key is set'
      };
    }
    
    try {
      console.log('Testing API connection with provider:', this.getActiveProvider());
      const apiKey = this.getApiKey();
      console.log('API key exists:', !!apiKey);
      
      const result = await this.callGeminiApi('Hello, please respond with "Connection successful" if you can read this message.');
      console.log('API test response received:', result);
      
      return { 
        success: true, 
        message: 'API connection successful!'
      };
    } catch (error) {
      console.error('API connection test failed:', error.message);
      return { 
        success: false, 
        message: `Connection failed: ${error.message}`
      };
    }
  }
  
  /**
   * Generate a title based on prompt content
   * @param {string} content - The prompt content
   * @returns {Promise<string>} - Generated title
   */
  async generateTitle(content) {
    if (!this.isAiEnabled()) {
      throw new Error('AI integration is not enabled or no API key is set');
    }
    
    const prompt = `Generate a concise, descriptive title for the following AI prompt. The title should capture the essence of what the prompt is designed to do. Just return the title with no additional text or explanation.

Prompt: ${content}`;
    
    return this.callGeminiApi(prompt);
  }
  
  /**
   * Generate tags based on prompt content
   * @param {string} content - The prompt content
   * @returns {Promise<string[]>} - Generated tags as an array
   */
  async generateTags(content) {
    if (!this.isAiEnabled()) {
      throw new Error('AI integration is not enabled or no API key is set');
    }
    
    const prompt = `Generate 3-5 relevant tags for the following AI prompt. Each tag should be a single word or short phrase. Return the tags as a comma-separated list with no additional text, explanation or formatting.

Prompt: ${content}`;
    
    try {
      const response = await this.callGeminiApi(prompt);
      
      // Process the response into an array of tags
      const tags = response
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && tag.length > 0 && tag.length <= 20); // Filter out empty tags or too long tags
      
      // Make sure we have at least one tag
      if (tags.length === 0) {
        throw new Error('No valid tags were generated');
      }
      
      return tags;
    } catch (error) {
      console.error('Error generating tags:', error);
      throw error;
    }
  }
  
  /**
   * Improve a prompt with AI suggestions
   * @param {string} content - The original prompt content
   * @returns {Promise<string>} - Improved prompt
   */
  async improvePrompt(content) {
    if (!this.isAiEnabled()) {
      throw new Error('AI integration is not enabled or no API key is set');
    }
    
    const prompt = `Improve the following AI prompt to make it more effective, clear, and likely to produce good results. Maintain the original intent and purpose, but enhance the structure, specificity, and clarity. Return only the improved prompt with no additional explanation.

Original prompt: ${content}`;
    
    return this.callGeminiApi(prompt);
  }
  
  /**
   * Make API request to the AI provider
   * @param {string} provider - The AI provider
   * @param {Object} config - Provider configuration
   * @param {Object} params - Request parameters
   * @returns {Promise<Object>} Response object
   */
  async makeRequest(provider, config, params) {
    if (provider === 'openai') {
      return this.makeOpenAIRequest(config, params);
    } else if (provider === 'anthropic') {
      return this.makeAnthropicRequest(config, params);
    } else if (provider === 'gemini') {
      return this.makeGeminiRequest(config, params);
    } else if (provider === 'openrouter') {
      return this.makeOpenRouterRequest(config, params);
    }
    
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  /**
   * Make request to OpenAI API
   */
  async makeOpenAIRequest(config, params) {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: this.settingsStore.defaultModel,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates tags, titles, and improves prompts.' },
          { role: 'user', content: params.prompt }
        ],
        max_tokens: params.maxTokens || 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error making OpenAI request');
    }
    
    return await response.json();
  }
  
  /**
   * Make request to Anthropic API
   */
  async makeAnthropicRequest(config, params) {
    const response = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: this.settingsStore.defaultModel,
        messages: [
          { role: 'user', content: params.prompt }
        ],
        max_tokens: params.maxTokens || 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error making Anthropic request');
    }
    
    return await response.json();
  }
  
  /**
   * Make request to Gemini API
   */
  async makeGeminiRequest(config, params) {
    const model = this.settingsStore.defaultModel === 'gemini-2.0-flash' 
      ? 'gemini-2.0-flash' 
      : (this.settingsStore.defaultModel === 'gemini-flash' ? 'gemini-1.0-pro-latest' : 'gemini-1.0-pro');
    
    const url = `${config.baseUrl}/${model}:generateContent?key=${config.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: params.prompt }]
          }],
          generationConfig: {
            maxOutputTokens: params.maxTokens || 1024,
            temperature: 0.7,
            topP: 0.95,
            topK: 40
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error making Gemini request:', error);
      throw error;
    }
  }
  
  /**
   * Make request to OpenRouter API
   */
  async makeOpenRouterRequest(config, params) {
    // For OpenRouter, we'll use the API to access various models
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        model: 'openai/gpt-4-turbo', // Default to GPT-4 Turbo from OpenAI
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates tags, titles, and improves prompts.' },
          { role: 'user', content: params.prompt }
        ],
        max_tokens: params.maxTokens || 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Error making OpenRouter request');
    }
    
    return await response.json();
  }
}

// Create and export an instance of the AI service
const aiService = new AiService();
export default aiService; 