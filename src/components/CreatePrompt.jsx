import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Wand, Loader2, Sparkles, Info } from 'lucide-react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { Badge } from './ui/Badge';
import { Checkbox } from './ui/Checkbox';
import usePromptStore from '../store/promptStore';
import useSettingsStore from '../hooks/useSettingsStore';
import aiService from '../services/aiService';
import { toast } from 'sonner';

const CreatePrompt = () => {
  const navigate = useNavigate();
  const promptStore = usePromptStore();
  const settingsStore = useSettingsStore();
  const { collections, categories, addPrompt } = promptStore;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if AI integration is enabled
  const isAiEnabled = settingsStore.aiIntegration && !!settingsStore.apiKeys.gemini && settingsStore.apiKeys.gemini.trim() !== '';
  
  useEffect(() => {
    // Debug logging for AI integration
    console.log('AI Integration Status:', {
      aiIntegration: settingsStore.aiIntegration,
      hasGeminiKey: !!settingsStore.apiKeys.gemini && settingsStore.apiKeys.gemini.trim() !== '',
      isAiEnabled,
      defaultModel: settingsStore.defaultModel
    });
  }, [settingsStore.aiIntegration, isAiEnabled, settingsStore.defaultModel]);
  
  // AI generation states
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isImprovingContent, setIsImprovingContent] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    model: settingsStore.defaultModel || 'gemini-2.0-flash',
    category: '',
    collectionId: '',
    tags: [],
    favorite: false,
    versionNotes: 'Initial version'
  });
  
  const [currentTag, setCurrentTag] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      favorite: checked,
    });
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title for your prompt');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Please enter content for your prompt');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Creating new prompt with data:', {
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        category: formData.category,
        collectionId: formData.collectionId,
        favorite: formData.favorite,
        model: formData.model,
        versionNotes: formData.versionNotes
      });
      
      // Create a new prompt with error handling
      if (typeof addPrompt !== 'function') {
        throw new Error('addPrompt function is not available');
      }
      
      const newPrompt = addPrompt({
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        category: formData.category,
        collectionId: formData.collectionId,
        favorite: formData.favorite,
        model: formData.model,
        versionNotes: formData.versionNotes
      });
      
      if (!newPrompt || !newPrompt.id) {
        throw new Error('Failed to create prompt: No ID returned');
      }
      
      console.log('New prompt created successfully:', newPrompt);
      
      toast.success('Prompt created successfully');
      navigate(`/prompt/${newPrompt.id}`);
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error(`Failed to create prompt: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // AI enhancement functions
  const handleGenerateTitle = async () => {
    if (!formData.content.trim()) {
      toast.error('Please enter prompt content first');
      return;
    }
    
    // Check AI integration again
    if (!isAiEnabled) {
      toast.error('AI integration is not enabled or no API key is set. Please check your settings.');
      return;
    }
    
    setIsGeneratingTitle(true);
    toast.info('Generating title...', { duration: 2000 });
    
    try {
      // Use the AI service to generate a title based on content
      const generatedTitle = await aiService.generateTitle(formData.content);
      
      if (!generatedTitle || generatedTitle.trim() === '') {
        throw new Error('Generated title is empty');
      }
      
      setFormData({
        ...formData,
        title: generatedTitle
      });
      
      toast.success('Title generated successfully');
    } catch (error) {
      console.error('Error generating title:', error);
      toast.error(`Failed to generate title: ${error.message}`);
    } finally {
      setIsGeneratingTitle(false);
    }
  };
  
  const handleGenerateTags = async () => {
    if (!formData.content.trim()) {
      toast.error('Please enter prompt content first');
      return;
    }
    
    // Check AI integration again
    if (!isAiEnabled) {
      toast.error('AI integration is not enabled or no API key is set. Please check your settings.');
      return;
    }
    
    setIsGeneratingTags(true);
    toast.info('Generating tags...', { duration: 2000 });
    
    try {
      // Use the AI service to generate tags based on content
      const generatedTags = await aiService.generateTags(formData.content);
      
      if (!Array.isArray(generatedTags) || generatedTags.length === 0) {
        throw new Error('No tags were generated');
      }
      
      setFormData({
        ...formData,
        tags: [...new Set([...formData.tags, ...generatedTags])]
      });
      
      toast.success('Tags generated successfully');
    } catch (error) {
      console.error('Error generating tags:', error);
      toast.error(`Failed to generate tags: ${error.message}`);
    } finally {
      setIsGeneratingTags(false);
    }
  };
  
  const handleImproveContent = async () => {
    if (!formData.content.trim()) {
      toast.error('Please enter prompt content first');
      return;
    }
    
    // Check AI integration again
    if (!isAiEnabled) {
      toast.error('AI integration is not enabled or no API key is set. Please check your settings.');
      return;
    }
    
    setIsImprovingContent(true);
    toast.info('Improving content...', { duration: 3000 });
    
    try {
      // Use the AI service to improve the prompt content
      const improvedContent = await aiService.improvePrompt(formData.content);
      
      if (!improvedContent || improvedContent.trim() === '') {
        throw new Error('Improved content is empty');
      }
      
      setFormData({
        ...formData,
        content: improvedContent
      });
      
      toast.success('Content improved successfully');
    } catch (error) {
      console.error('Error improving content:', error);
      toast.error(`Failed to improve content: ${error.message}`);
    } finally {
      setIsImprovingContent(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Prompt</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title</Label>
              {isAiEnabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-8 text-xs"
                  onClick={handleGenerateTitle}
                  disabled={isGeneratingTitle || !formData.content.trim()}
                >
                  {isGeneratingTitle ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Wand className="h-3 w-3 mr-1" />
                  )}
                  Generate with AI
                </Button>
              )}
            </div>
            <Input
              id="title"
              name="title"
              placeholder="Name your prompt"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Prompt Content</Label>
              {isAiEnabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-8 text-xs"
                  onClick={handleImproveContent}
                  disabled={isImprovingContent || !formData.content.trim()}
                >
                  {isImprovingContent ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Wand className="h-3 w-3 mr-1" />
                  )}
                  Improve with AI
                </Button>
              )}
            </div>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your prompt here..."
              value={formData.content}
              onChange={handleChange}
              rows={8}
              required
            />
            <p className="text-sm text-muted-foreground">
              Use [PLACEHOLDERS] for variables that can be customized when using the prompt.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Select
                value={formData.model}
                onValueChange={(value) => handleSelectChange('model', value)}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                  <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="collectionId">Collection</Label>
            <Select
              value={formData.collectionId}
              onValueChange={(value) => handleSelectChange('collectionId', value)}
            >
              <SelectTrigger id="collectionId">
                <SelectValue placeholder="Select a collection (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {collections && collections.length > 0 ? (
                  collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.icon} {collection.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No collections available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tags">Tags</Label>
              {isAiEnabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-8 text-xs"
                  onClick={handleGenerateTags}
                  disabled={isGeneratingTags || !formData.content.trim()}
                >
                  {isGeneratingTags ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Wand className="h-3 w-3 mr-1" />
                  )}
                  Generate with AI
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags (press Enter)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    &times;
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorite"
              checked={formData.favorite}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="favorite" className="cursor-pointer">
              Add to favorites
            </Label>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Prompt
          </Button>
        </div>
      </form>
      
      {isAiEnabled && (
        <div className="flex justify-end items-center gap-3 mt-6 border-t pt-4">
          <div className="text-xs text-muted-foreground hidden md:flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Using {formData.model} for AI suggestions
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePrompt; 