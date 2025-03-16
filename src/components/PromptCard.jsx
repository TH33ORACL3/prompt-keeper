import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Copy, MoreHorizontal, Clock, Edit, Trash, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/DropdownMenu';
import usePromptStore from '../store/promptStore';

const PromptCard = ({ prompt }) => {
  const navigate = useNavigate();
  const { toggleFavorite, favorites, usePrompt, deletePrompt } = usePromptStore();
  const isFavorite = favorites.includes(prompt.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(prompt.id);
  };

  const handleCopyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Mark as used
    usePrompt(prompt.id);
    
    // Copy to clipboard
    navigator.clipboard.writeText(prompt.content)
      .then(() => {
        // Could show a toast notification here
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/prompt/${prompt.id}/edit`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt(prompt.id);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Copy share link to clipboard
    const shareUrl = `${window.location.origin}/prompt/${prompt.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        // Could show a toast notification here
        alert('Share link copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy share link: ', err);
      });
  };

  // Format the date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never used';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Link 
      to={`/prompt/${prompt.id}`}
      className="prompt-card block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{prompt.title}</h3>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {prompt.category}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {prompt.content.substring(0, 150)}...
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags && prompt.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {prompt.lastUsed && (
          <div className="flex items-center text-xs text-muted-foreground mb-4">
            <Clock className="h-3 w-3 mr-1" />
            Last used: {formatDate(prompt.lastUsed)}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 border-t">
          <button 
            onClick={handleFavoriteClick}
            className={`flex items-center text-xs font-medium ${
              isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
            }`}
          >
            <Star className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </button>
          
          <button 
            onClick={handleCopyClick}
            className="flex items-center text-xs font-medium text-muted-foreground hover:text-primary"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Link>
  );
};

export default PromptCard; 