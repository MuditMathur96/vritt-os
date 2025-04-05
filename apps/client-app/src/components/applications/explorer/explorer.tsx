import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Folder, FileText, Home, Monitor, Image, File, MoreHorizontal, Settings, PanelLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Types
interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'image';
  size?: string;
  modified?: string;
}

interface DirectoryState {
  path: string;
  items: FileItem[];
}

const WindowsFileExplorer: React.FC = () => {
  // Navigation history
  const [history, setHistory] = useState<DirectoryState[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  // Context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item?: FileItem } | null>(null);
  
  // Mock file system data
  const mockFileSystem: Record<string, FileItem[]> = {
    'This PC': [
      { id: '1', name: 'Desktop', type: 'folder' },
      { id: '2', name: 'Documents', type: 'folder' },
      { id: '3', name: 'Downloads', type: 'folder' },
      { id: '4', name: 'Pictures', type: 'folder' },
      { id: '5', name: 'Music', type: 'folder' },
      { id: '6', name: 'Videos', type: 'folder' },
      { id: '7', name: 'Local Disk (C:)', type: 'folder' },
    ],
    'Desktop': [
      { id: '8', name: 'Project Docs', type: 'folder' },
      { id: '9', name: 'Resume.docx', type: 'file', size: '25 KB', modified: '4/2/2025' },
      { id: '10', name: 'Budget.xlsx', type: 'file', size: '45 KB', modified: '4/1/2025' },
      { id: '11', name: 'Wallpaper.jpg', type: 'image', size: '1.2 MB', modified: '3/15/2025' },
    ],
    'Documents': [
      { id: '12', name: 'Work', type: 'folder' },
      { id: '13', name: 'Personal', type: 'folder' },
      { id: '14', name: 'Report.pdf', type: 'file', size: '2.5 MB', modified: '3/28/2025' },
    ],
    'Pictures': [
      { id: '15', name: 'Vacation', type: 'folder' },
      { id: '16', name: 'Family', type: 'folder' },
      { id: '17', name: 'Screenshot.png', type: 'image', size: '560 KB', modified: '4/3/2025' },
      { id: '18', name: 'Profile.jpg', type: 'image', size: '780 KB', modified: '3/20/2025' },
    ]
  };

  // Current directory state
  const [currentDirectory, setCurrentDirectory] = useState<DirectoryState>({
    path: 'This PC',
    items: mockFileSystem['This PC'],
  });

  // Initialize history with home directory
  useEffect(() => {
    setHistory([currentDirectory]);
    setCurrentHistoryIndex(0);
  }, []);

  // Handle navigation to a folder
  const navigateToFolder = (folderName: string) => {
    // Only proceed if we have data for this folder
    if (mockFileSystem[folderName]) {
      const newDirectory = {
        path: folderName,
        items: mockFileSystem[folderName],
      };
      
      // If we're not at the end of the history, truncate it
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push(newDirectory);
      
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
      setCurrentDirectory(newDirectory);
    }
  };

  // Handle back navigation
  const goBack = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setCurrentDirectory(history[newIndex]);
    }
  };

  // Handle forward navigation
  const goForward = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setCurrentDirectory(history[newIndex]);
    }
  };

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent, item?: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Handle item click (double click to navigate for folders)
  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.name);
    }
  };

  // Get file icon based on type
  const getFileIcon = (item: FileItem) => {
    switch (item.type) {
      case 'folder':
        return <Folder className="w-5 h-5 text-yellow-400" />;
      case 'image':
        return <Image className="w-5 h-5 text-blue-400" />;
      case 'file':
        if (item.name.endsWith('.pdf')) {
          return <FileText className="w-5 h-5 text-red-400" />;
        } else if (item.name.endsWith('.docx')) {
          return <FileText className="w-5 h-5 text-blue-600" />;
        } else if (item.name.endsWith('.xlsx')) {
          return <FileText className="w-5 h-5 text-green-600" />;
        }
        return <File className="w-5 h-5 text-gray-400" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 text-gray-900 overflow-hidden" onClick={closeContextMenu}>
      
      
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goBack} 
          disabled={currentHistoryIndex <= 0}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goForward} 
          disabled={currentHistoryIndex >= history.length - 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1 max-w-md relative">
          <Input 
            value={currentDirectory.path}
            readOnly
            className="h-8 pl-2 pr-8 bg-gray-50"
          />
          <Search className="h-4 w-4 absolute right-2 top-2 text-gray-400" />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-2">
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Monitor className="mr-2 h-4 w-4" />
              <span>This PC</span>
            </Button>
            <div className="pl-4 space-y-1 mt-2">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => navigateToFolder('Desktop')}>
                Desktop
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => navigateToFolder('Documents')}>
                Documents
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => navigateToFolder('Pictures')}>
                Pictures
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="flex-1 p-2 overflow-auto" onContextMenu={(e) => handleContextMenu(e)}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentDirectory.path}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
            >
              {currentDirectory.items.map((item) => (
                <Card 
                  key={item.id}
                  className="p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  onDoubleClick={() => handleItemClick(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <div className="flex items-center space-x-2">
                    {getFileIcon(item)}
                    <span className="text-sm truncate">{item.name}</span>
                  </div>
                  {item.size && (
                    <div className="mt-1 text-xs text-gray-500">
                      {item.size} • {item.modified}
                    </div>
                  )}
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="bg-white border-t border-gray-200 p-1 text-xs text-gray-500">
        {currentDirectory.items.length} items
      </div>
      
      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed bg-white shadow-lg border border-gray-200 rounded-md p-1 w-48 z-50"
            style={{ 
              left: `${contextMenu.x}px`, 
              top: `${contextMenu.y}px`,
              transformOrigin: 'top left'
            }}
          >
            <div className="text-xs p-1 text-gray-500">
              {contextMenu.item ? `${contextMenu.item.name}` : 'Background'}
            </div>
            <div className="text-sm">
              {contextMenu.item && contextMenu.item.type === 'folder' && (
                <div 
                  className="px-2 py-1 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    navigateToFolder(contextMenu.item!.name);
                    closeContextMenu();
                  }}
                >
                  Open
                </div>
              )}
              <div className="px-2 py-1 hover:bg-blue-50 cursor-pointer">
                {contextMenu.item ? 'Copy' : 'Paste'}
              </div>
              {contextMenu.item && (
                <>
                  <div className="px-2 py-1 hover:bg-blue-50 cursor-pointer">
                    Cut
                  </div>
                  <div className="px-2 py-1 hover:bg-blue-50 cursor-pointer">
                    Rename
                  </div>
                  <div className="px-2 py-1 hover:bg-blue-50 cursor-pointer text-red-500">
                    Delete
                  </div>
                </>
              )}
              <div className="border-t border-gray-200 my-1"></div>
              <div className="px-2 py-1 hover:bg-blue-50 cursor-pointer">
                Refresh
              </div>
              {!contextMenu.item && (
                <div className="px-2 py-1 hover:bg-blue-50 cursor-pointer">
                  New Folder
                </div>
              )}
              <div className="px-2 py-1 hover:bg-blue-50 cursor-pointer">
                Properties
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WindowsFileExplorer;