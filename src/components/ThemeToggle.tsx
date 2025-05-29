
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className={`h-10 w-10 p-0 transition-all duration-300 border-2 ${
        isDarkMode 
          ? 'border-green-400 text-green-400 hover:bg-green-400/20' 
          : 'border-blue-600 text-blue-600 hover:bg-blue-600/20'
      }`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
