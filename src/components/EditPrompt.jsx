import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, History, Wand, Loader2, ChevronDown, ChevronUp, Sparkles, Info } from 'lucide-react';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/Select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/Tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/Dialog';
import { Badge } from './ui/Badge';
import usePromptStore from '../store/promptStore';
import useSettingsStore from '../hooks/useSettingsStore';
import aiService from '../services/aiService';
import { toast } from 'sonner';

const EditPrompt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPromptById, addPromptVersion } = usePromptStore();
  const settings = useSettingsStore();
  
  const prompt = getPromptById(id);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [versionNotes, setVersionNotes] = useState('');
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  
  // AI integration states
  const isAiEnabled = settings.aiIntegration && settings.getActiveApiKey('gemini');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  
  useEffect(() => {
    // Debug logging for AI integration
    console.log('Edit Prompt - AI Integration Status:', {
      aiIntegration: settings.aiIntegration,
      hasGeminiKey: !!settings.getActiveApiKey('gemini'),
      isAiEnabled,
      defaultModel: settings.defaultModel
    });
  }, [settings.aiIntegration, isAiEnabled, settings.defaultModel]);
  
  useEffect(() => {
    if (prompt) {
      console.log('Loading prompt for editing:', prompt);
      setTitle(prompt.title || '');
      setContent(prompt.content || '');
      setCategory(prompt.category || '');
      setTags(prompt.tags || []);
    }
  }, [prompt]);
  
  if (!prompt) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Prompt not found</h1>
        <p className="text-muted-foreground mb-6">
          The prompt you're trying to edit doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleGenerateTitle = async () => {
    if (!content.trim()) {
      toast.error('Please enter prompt content first');
      return;
    }
    
    setIsGeneratingTitle(true);
    toast.info('Generating title...', { duration: 2000 });
    
    try {
      console.log('Generating title from content...');
      // Use the AI service to generate a title based on content
      const generatedTitle = await aiService.generateTitle(content);
      console.log('Generated title:', generatedTitle);
      setTitle(generatedTitle);
      toast.success('Title generated successfully');
    } catch (error) {
      console.error('Error generating title:', error);
      toast.error(`Failed to generate title: ${error.message}`);
    } finally {
      setIsGeneratingTitle(false);
    }
  };
  
  const handleGenerateTags = async () => {
    if (!content.trim()) {
      toast.error('Please enter prompt content first');
      return;
    }
    
    setIsGeneratingTags(true);
    toast.info('Generating tags...', { duration: 2000 });
    
    try {
      console.log('Generating tags from content...');
      // Use the AI service to generate tags based on content
      const generatedTags = await aiService.generateTags(content);
      console.log('Generated tags:', generatedTags);
      setTags([...new Set([...tags, ...generatedTags])]);
      toast.success('Tags generated successfully');
    } catch (error) {
      console.error('Error generating tags:', error);
      toast.error(`Failed to generate tags: ${error.message}`);
    } finally {
      setIsGeneratingTags(false);
    }
  };
  
  const handleImprovePrompt = async () => {
    if (!content.trim()) {
      toast.error('Please enter prompt content first');
      return;
    }
    
    setIsImprovingPrompt(true);
    toast.info('Improving content...', { duration: 3000 });
    
    try {
      console.log('Improving prompt content...');
      // Use the AI service to improve the prompt content
      const improvedContent = await aiService.improvePrompt(content);
      console.log('Improved content received');
      setContent(improvedContent);
      toast.success('Content improved successfully');
    } catch (error) {
      console.error('Error improving content:', error);
      toast.error(`Failed to improve content: ${error.message}`);
    } finally {
      setIsImprovingPrompt(false);
    }
  };
  
  const handleSave = () => {
    setShowVersionDialog(true);
  };
  
  const handleSaveVersion = () => {
    // Create a new version with the changes
    addPromptVersion(prompt.id, {
      title,
      content,
      category,
      tags,
      notes: versionNotes || `Updated on ${new Date().toLocaleDateString()}`
    });
    
    // Navigate back to the prompt detail page
    navigate(`/prompt/${id}`);
  };

  const handleGetAiSuggestions = async () => {
    if (!content.trim()) {
      toast.error('Please enter content before requesting suggestions');
      return;
    }
    
    toast.info('Getting AI suggestions...', { duration: 3000 });
    
    try {
      console.log('Getting AI suggestions for prompt...');
      // Use the AI service to improve the prompt
      const improvedContent = await aiService.improvePrompt(content);
      console.log('AI suggestions received');
      setContent(improvedContent);
      toast.success('AI suggestions applied');
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error(`Failed to get AI suggestions: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-muted-foreground" 
          onClick={() => navigate(`/prompt/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Prompt
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Prompt</h1>
        <p className="text-muted-foreground">
          Make changes to your prompt. A new version will be created when you save.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="title">Title</Label>
            {isAiEnabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
                onClick={handleGenerateTitle}
                disabled={isGeneratingTitle || !content.trim()}
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={setCategory}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="tags">Tags</Label>
            {isAiEnabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
                onClick={handleGenerateTags}
                disabled={isGeneratingTags || !content.trim()}
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
          <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-background">
            {tags.map((tag, index) => (
              <div 
                key={index}
                className="flex items-center bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm"
              >
                <span className="mr-1">#{tag}</span>
                <button 
                  type="button" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
            <input
              className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={tags.length === 0 ? "Add tags..." : ""}
            />
          </div>
          <p className="text-sm text-muted-foreground">Press Enter to add a tag</p>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Prompt Content</Label>
            {isAiEnabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
                onClick={handleImprovePrompt}
                disabled={isImprovingPrompt || !content.trim()}
              >
                {isImprovingPrompt ? (
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your prompt here..."
            className="min-h-[200px]"
            required
          />
          <p className="text-sm text-muted-foreground">
            Use [PLACEHOLDERS] for variables that can be customized when using the prompt.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/prompt/${id}`)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>

        {isAiEnabled && (
          <div className="flex justify-end items-center gap-3 mt-8 border-t pt-4">
            <div className="text-xs text-muted-foreground hidden md:flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Using Gemini 2.0 Flash for AI suggestions
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleGetAiSuggestions}
              disabled={!content.trim()}
            >
              <Sparkles className="h-4 w-4" />
              Get AI Suggestions
            </Button>
          </div>
        )}
      </div>

      {/* Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save New Version</DialogTitle>
            <DialogDescription>
              Add version notes to help you track changes over time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            <Label htmlFor="versionNotes">Version Notes</Label>
            <Textarea
              id="versionNotes"
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
              placeholder="Describe what changed in this version..."
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVersion} className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Save Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditPrompt; 