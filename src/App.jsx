import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PromptDetail from './components/PromptDetail';
import CreatePrompt from './components/CreatePrompt';
import EditPrompt from './components/EditPrompt';
import Collections from './components/Collections';
import CollectionDetail from './components/CollectionDetail';
import Category from './components/Category';
import Favorites from './components/Favorites';
import Recent from './components/Recent';
import Achievements from './components/Achievements';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Subscription from './components/Subscription';
import NotFound from './components/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="prompt/:id" element={<PromptDetail />} />
        <Route path="prompt/:id/edit" element={<EditPrompt />} />
        <Route path="create" element={<CreatePrompt />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:id" element={<CollectionDetail />} />
        <Route path="categories/:category" element={<Category />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="recent" element={<Recent />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App; 