import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Settings, 
  Moon, 
  Sun, 
  Eye,
  Palette,
  MousePointer,
  Filter
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CustomCursor } from '@/components/CustomCursor';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

export function SerenityBrowser() {
  const { 
    theme, 
    setTheme, 
    ambientMode,
    cursorTheme,
    setCursorTheme,
    zenMode, 
    toggleZenMode,
    blueFilterEnabled,
    toggleBlueFilter
  } = useTheme();
  
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'New Tab', url: 'about:blank' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [showSettings, setShowSettings] = useState(false);
  const [addressBarValue, setAddressBarValue] = useState('');

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'New Tab',
      url: 'about:blank'
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'sepia', name: 'Sepia', icon: Eye },
    { id: 'auto', name: 'Auto', icon: Palette },
  ];

  const cursorThemes = [
    { id: 'default', name: 'Default' },
    { id: 'zen', name: 'Zen (Hidden)' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'calm', name: 'Calm' },
  ];

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden bg-background`}>
      {/* Ambient Background Overlay */}
      <div className={`ambient-overlay ambient-${ambientMode}`} />
      
      {/* Browser Chrome */}
      <motion.div 
        className="browser-chrome"
        initial={{ opacity: 1 }}
        animate={{ opacity: zenMode ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Tab Bar */}
        <div className="hover-zone flex items-center px-4 pt-2 browser-toolbar">
          <div className="hover-ui flex items-center space-x-1 flex-1">
            {/* Tabs */}
            {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-zen-accent to-zen-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{tab.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                    className="w-4 h-4 rounded-full hover:bg-destructive/20 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* New Tab Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={addNewTab}
              className="btn-zen w-8 h-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Window Controls */}
          <div className="hover-ui flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleZenMode}
              className="btn-zen"
              title="Toggle Zen Mode (Ctrl+Z)"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="btn-zen"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Address Bar */}
        <div className="hover-zone px-4 py-3 browser-toolbar">
          <div className="hover-ui max-w-2xl mx-auto">
            <div className="address-bar">
              <div className="flex items-center space-x-3">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  value={addressBarValue}
                  onChange={(e) => setAddressBarValue(e.target.value)}
                  placeholder="Search or enter address..."
                  className="border-none bg-transparent focus:ring-0 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 top-20 z-50"
          >
            <Card className="p-6 w-80 glass">
              <h3 className="text-lg font-semibold mb-4">Serenity Settings</h3>
              
              {/* Theme Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Theme</h4>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <Button
                        key={themeOption.id}
                        variant={theme === themeOption.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme(themeOption.id as any)}
                        className="btn-zen justify-start"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {themeOption.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Cursor Theme */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Cursor</h4>
                <div className="space-y-1">
                  {cursorThemes.map((cursor) => (
                    <Button
                      key={cursor.id}
                      variant={cursorTheme === cursor.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCursorTheme(cursor.id as any)}
                      className="btn-zen w-full justify-start text-xs"
                    >
                      <MousePointer className="w-3 h-3 mr-2" />
                      {cursor.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-2">
                <Button
                  variant={zenMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleZenMode}
                  className="btn-zen w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Zen Mode
                </Button>
                
                <Button
                  variant={blueFilterEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleBlueFilter}
                  className="btn-zen w-full justify-start"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Blue Light Filter
                </Button>
              </div>

              {/* Ambient Mode Display */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  Ambient: <span className="capitalize font-medium">{ambientMode}</span>
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1 
            className="text-6xl font-serif font-semibold mb-6 text-zen-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Serenity
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            A minimalist browser experience designed for focus and calm. 
            Ambient backgrounds shift with time, distractions fade away.
          </motion.p>

          <motion.div
            className="space-y-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Z</kbd> Toggle Zen Mode</p>
            <p><kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+B</kbd> Blue Light Filter</p>
            <p>Hover near edges to reveal controls</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Click overlay to close settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}
      
      {/* Custom Cursor */}
      <CustomCursor />
    </div>
  );
}