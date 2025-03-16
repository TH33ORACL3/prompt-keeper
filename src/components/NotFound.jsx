import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from './ui/Button';

const NotFound = () => {
  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground text-center mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/">
        <Button className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound; 