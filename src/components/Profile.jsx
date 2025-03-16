import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  Edit2, 
  Save, 
  X, 
  CreditCard, 
  Download, 
  Trash2, 
  AlertTriangle,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSettingsStore from '../hooks/useSettingsStore';
import usePromptStore from '../store/promptStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from './ui/Dialog';

const Profile = () => {
  const { profile, updateProfile } = useSettingsStore();
  const promptStore = usePromptStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
    avatar: profile.avatar
  });
  
  // Delete confirmation states
  const [showDeleteDataDialog, setShowDeleteDataDialog] = useState(false);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      avatar: profile.avatar
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleExportPrompts = () => {
    const prompts = promptStore.prompts;
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `prompt-keeper-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };
  
  const handleDeleteAllData = () => {
    // Clear all prompts, collections, etc.
    promptStore.clearAllData();
    setShowDeleteDataDialog(false);
  };
  
  const handleDeleteAccount = () => {
    // Clear all user data including profile and settings
    promptStore.clearAllData();
    updateProfile({
      name: 'User',
      email: '',
      bio: '',
      avatar: ''
    });
    setShowDeleteAccountDialog(false);
  };

  // Stats are hardcoded for demonstration
  const stats = [
    { label: 'Total Prompts', value: promptStore.prompts.length.toString() },
    { label: 'Favorites', value: promptStore.prompts.filter(p => p.favorite).length.toString() },
    { label: 'Collections', value: promptStore.collections.length.toString() },
    { label: 'Last Active', value: 'Today' }
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      {profile.avatar ? (
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                      ) : (
                        <AvatarFallback className="text-xl">
                          {profile.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <p className="text-muted-foreground">{profile.role}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  
                  {profile.bio && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                      <p>{profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:items-start">
                  <Avatar className="h-20 w-20">
                    {formData.avatar ? (
                      <AvatarImage src={formData.avatar} alt={formData.name} />
                    ) : (
                      <AvatarFallback className="text-xl">
                        {formData.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <span className="text-sm text-primary hover:underline">
                        Change avatar
                      </span>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
          
          {/* Data Management Section */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <h3 className="text-base font-medium">Export Your Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Download all your prompts as a JSON file for backup or transfer
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleExportPrompts}
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Prompts
                </Button>
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="text-base font-medium">Delete All Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Remove all your prompts, collections, and other application data
                </p>
                <Dialog open={showDeleteDataDialog} onOpenChange={setShowDeleteDataDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto text-destructive border-destructive flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete All Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete All Data</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete all your prompts, collections, and other application data? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteDataDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAllData}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete All Data
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="text-base font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Remove your account and all related data permanently
                </p>
                <Dialog open={showDeleteAccountDialog} onOpenChange={setShowDeleteAccountDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full sm:w-auto flex items-center gap-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        Are you absolutely sure you want to delete your account? This will permanently remove all your data and cannot be recovered.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="my-4 p-4 bg-destructive/10 rounded-md border border-destructive/20">
                      <p className="text-sm font-medium text-destructive">Warning: This action is permanent and cannot be undone.</p>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteAccountDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Permanently Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-2">Subscription</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Current plan: <span className="font-medium">Free</span>
            </p>
            <Link to="/subscription">
              <Button className="w-full flex items-center justify-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            </Link>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6 mt-6">
            <h2 className="text-xl font-semibold mb-2">Preferences</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Customize your app experience
            </p>
            <Link to="/settings">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Settings className="mr-2 h-4 w-4" />
                Open Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 