import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Settings, User, Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import useSettingsStore from '../store/settingsStore';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { profile } = useSettingsStore();

  const themeIcons = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Laptop className="h-5 w-5" />,
  };

  const nextTheme = {
    light: 'dark',
    dark: 'system',
    system: 'light',
  };

  const toggleTheme = () => {
    setTheme(nextTheme[theme]);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
      <div className="flex items-center">
        <Link to="/" className="flex items-center text-xl font-semibold">
          <span className="mr-2 text-2xl">✨</span>
          Prompt Keeper
        </Link>
      </div>

      <div className="relative mx-4 flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="search"
          placeholder="Search prompts..."
          className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          title={`Current theme: ${theme}. Click to switch.`}
        >
          {themeIcons[theme]}
        </button>

        <Link
          to="/create"
          className="flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Prompt
        </Link>

        <Link
          to="/settings"
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <Link
          to="/profile"
          className="flex items-center rounded-full bg-muted p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <User className="h-6 w-6 m-1" />
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header; 