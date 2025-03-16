import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Star, Clock, FolderOpen, Tag, ChevronRight, ChevronDown, Award, CreditCard } from 'lucide-react';
import usePromptStore from '../store/promptStore';
import useSettingsStore from '../store/settingsStore';
import useGamificationStore from '../store/gamificationStore';

const Sidebar = ({ collapsed = false }) => {
  const { collections, categories } = usePromptStore();
  const { settings, updateSettings } = useSettingsStore();
  const { getLevel } = useGamificationStore();
  
  const level = getLevel();
  
  const [collectionsOpen, setCollectionsOpen] = React.useState(true);
  const [categoriesOpen, setCategoriesOpen] = React.useState(true);

  const toggleCollections = () => {
    setCollectionsOpen(!collectionsOpen);
  };

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const toggleSidebar = () => {
    updateSettings({ sidebarCollapsed: !settings.sidebarCollapsed });
  };

  return (
    <aside 
      className={`border-r bg-muted/40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-2">
          <button 
            onClick={toggleSidebar}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-3">
          <div className="space-y-1">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Home className="h-5 w-5" />
              {!collapsed && <span>Home</span>}
            </NavLink>
            
            <NavLink 
              to="/favorites" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Star className="h-5 w-5" />
              {!collapsed && <span>Favorites</span>}
            </NavLink>
            
            <NavLink 
              to="/recent" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Clock className="h-5 w-5" />
              {!collapsed && <span>Recent</span>}
            </NavLink>
            
            <NavLink 
              to="/achievements" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Award className="h-5 w-5" />
              {!collapsed && (
                <div className="flex justify-between items-center w-full">
                  <span>Achievements</span>
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 w-6 h-6 text-xs text-primary font-semibold">
                    {level}
                  </span>
                </div>
              )}
            </NavLink>
            
            <NavLink 
              to="/subscription" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
              }
            >
              <CreditCard className="h-5 w-5" />
              {!collapsed && <span>Subscription</span>}
            </NavLink>
          </div>
          
          {!collapsed && (
            <>
              <div className="pt-4">
                <div 
                  className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground"
                  onClick={toggleCollections}
                >
                  <div className="flex items-center">
                    <FolderOpen className="mr-2 h-5 w-5" />
                    <span>Collections</span>
                  </div>
                  {collectionsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
                
                {collectionsOpen && (
                  <div className="mt-1 space-y-1 pl-6">
                    {collections.map((collection) => (
                      <NavLink
                        key={collection.id}
                        to={`/collections/${collection.id}`}
                        className={({ isActive }) => 
                          `sidebar-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="mr-2">{collection.icon}</span>
                        <span>{collection.name}</span>
                      </NavLink>
                    ))}
                    <NavLink
                      to="/collections"
                      className="sidebar-link text-muted-foreground"
                    >
                      <span>View all collections</span>
                    </NavLink>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <div 
                  className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground"
                  onClick={toggleCategories}
                >
                  <div className="flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    <span>Categories</span>
                  </div>
                  {categoriesOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
                
                {categoriesOpen && (
                  <div className="mt-1 space-y-1 pl-6">
                    {categories.map((category) => (
                      <NavLink
                        key={category.id}
                        to={`/categories/${category.id}`}
                        className={({ isActive }) => 
                          `sidebar-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span className="mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 