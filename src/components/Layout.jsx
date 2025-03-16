import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import AchievementToast from './AchievementToast';
import useSettingsStore from '../store/settingsStore';
import useGamificationStore from '../store/gamificationStore';

const Layout = () => {
  const { settings } = useSettingsStore();
  const { trackLogin } = useGamificationStore();
  const sidebarCollapsed = settings.sidebarCollapsed;
  
  // Track login when the app loads
  useEffect(() => {
    trackLogin();
  }, [trackLogin]);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <AchievementToast />
    </div>
  );
};

export default Layout; 