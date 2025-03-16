import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Copy, 
  Edit, 
  Trash, 
  Share, 
  History, 
  ArrowLeft, 
  MoreVertical,
  Clock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/Button';
import usePromptStore from '../store/promptStore';
import { formatDistanceToNow } from 'date-fns';

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getPromptById, 
    toggleFavorite, 
    favorites, 
    deletePrompt, 
    usePrompt,
    setActivePromptVersion,
    deletePromptVersion
  } = usePromptStore();
  
  const prompt = getPromptById(id);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  if (!prompt) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Prompt not found</h1>
        <p className="text-muted-foreground mb-6">
          The prompt you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isFavorite = favorites.includes(prompt.id);
  const activeVersion = prompt.versions.find(v => v.versionId === prompt.activeVersionId);
  const sortedVersions = [...prompt.versions].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleFavoriteToggle = () => {
    toggleFavorite(prompt.id);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.content);
    usePrompt(prompt.id);
    // Could add a toast notification here
  };

  const handleEditPrompt = () => {
    navigate(`/prompt/${id}/edit`);
  };

  const handleDeletePrompt = () => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt(prompt.id);
      navigate('/');
    }
  };
  
  const handleActivateVersion = (versionId) => {
    setActivePromptVersion(prompt.id, versionId);
  };
  
  const handleDeleteVersion = (versionId) => {
    if (prompt.versions.length <= 1) {
      alert("You cannot delete the only version of a prompt.");
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this version?')) {
      deletePromptVersion(prompt.id, versionId);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-muted-foreground" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold mb-2">{prompt.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary/10 text-primary">
                {prompt.category}
              </span>
              {prompt.tags && prompt.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleFavoriteToggle}
            >
              <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleCopyPrompt}
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleEditPrompt}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            <div className="relative inline-block">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="flex items-center gap-1"
              >
                <History className="h-4 w-4" />
                History
                {showVersionHistory ? 
                  <ChevronDown className="h-3 w-3 ml-1" /> :
                  <ChevronRight className="h-3 w-3 ml-1" />
                }
              </Button>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleDeletePrompt}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Version history */}
        {showVersionHistory && (
          <div className="mt-4 mb-6 border rounded-lg p-4 bg-card">
            <h3 className="text-lg font-medium mb-3">Version History</h3>
            <div className="space-y-2">
              {sortedVersions.map((version) => (
                <div 
                  key={version.versionId}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    version.versionId === prompt.activeVersionId 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <span className="text-sm font-semibold">Version {version.versionId}</span>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{version.title}</p>
                      <p className="text-xs text-muted-foreground">{version.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {version.versionId !== prompt.activeVersionId && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleActivateVersion(version.versionId)}
                      >
                        Activate
                      </Button>
                    )}
                    {prompt.versions.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteVersion(version.versionId)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border rounded-lg p-6 bg-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Prompt Content</h3>
            {prompt.versions.length > 1 && (
              <span className="text-sm text-muted-foreground">
                Version {prompt.activeVersionId} of {prompt.versions.length}
              </span>
            )}
          </div>
          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{prompt.content}</pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
            <p>{new Date(prompt.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Used</h3>
            <p>{prompt.lastUsed ? new Date(prompt.lastUsed).toLocaleDateString() : 'Never'}</p>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Usage Count</h3>
            <p>{prompt.usageCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail; 