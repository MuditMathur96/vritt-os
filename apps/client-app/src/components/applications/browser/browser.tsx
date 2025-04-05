import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronLeft, ChevronRight, RotateCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  paths?:string[];
}

const Browser: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  // Initialize with a Google tab
  useEffect(() => {
    const initialTab = {
      id: '1',
      title: 'Google',
      url: 'https://www.google.com/webhp?igu=1',
      favicon: '🌐',
      path:[]
    };
    setTabs([initialTab]);
    setActiveTabId('1');
    setInputValue('https://www.google.com/webhp?igu=1');
  }, []);

 // const activeTab = tabs.find(tab => tab.id === activeTabId);

  const handleAddTab = () => {
    if (tabs.length < 5) {
      const newTab = {
        id: Date.now().toString(),
        title: 'New Tab',
        url: '',
        favicon: '🌐'
      };
      setTabs([...tabs, newTab]);
      setActiveTabId(newTab.id);
      setInputValue('');
    }
  };

  const handleRemoveTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If we're removing the active tab, select another tab
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
      setInputValue(newTabs[0].url);
    }
    
    // If we're removing the last tab, add a new tab
    if (newTabs.length === 0) {
      const newTab = {
        id: Date.now().toString(),
        title: 'Google',
        url: 'https://www.google.com/webhp?igu=1',
        favicon: '🌐'
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
      setInputValue('https://www.google.com/webhp?igu=1');
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find(tab => tab.id === tabId);
    if (tab) {
      setInputValue(tab.url);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTabId) {
      let url = inputValue;
      
      // Add https:// if not present and it's not empty
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      
      // Update the title based on URL
      let title = 'New Tab';
      if (url) {
        try {
          const urlObj = new URL(url);
          title = urlObj.hostname.replace('www.', '');
        } catch {
          title = url;
        }
      }
      
      setTabs(tabs.map(tab => 
        tab.id === activeTabId ? { ...tab, url, title } : tab
      ));
      
      setInputValue(url);
    }
  };

  const handleReload = () => {
    // Simulate reload by doing nothing but showing animation
    console.log('Reloading...');
  };

  const handleGoHome = () => {
    if (activeTabId) {
      //const googleUrl = 'https://www.google.com';
      const googleUrl = 'https://www.google.com/webhp?igu=1';
      setTabs(tabs.map(tab => 
        tab.id === activeTabId ? { ...tab, url: googleUrl, title: 'Google' } : tab
      ));
      setInputValue(googleUrl);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-lg">
      {/* Browser Chrome */}
      <div className="bg-gray-200 p-2">
        {/* Tabs Bar */}
        <div className="flex items-center">
          <div className=" flex overflow-x-hidden">
            <AnimatePresence>
              {tabs.map(tab => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center h-8 pl-3 pr-2 max-w-xs rounded-t-lg ${
                    tab.id === activeTabId ? 'bg-white' : 'bg-gray-200'
                  } cursor-pointer`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <span className="mr-2">{tab.favicon}</span>
                  <span className="truncate text-sm">{tab.title}</span>
                  <Button
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 h-5 w-5 p-0 rounded-full hover:bg-gray-300"
                    onClick={(e) => handleRemoveTab(tab.id, e)}
                  >
                    <X size={12} />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* New Tab Button */}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 px-2 h-8 rounded-full"
            onClick={handleAddTab}
            disabled={tabs.length >= 5}
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center space-x-2 bg-white rounded-lg p-1">
          <Button variant="ghost" size="sm" className="p-1 rounded-full">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 rounded-full">
            <ChevronRight size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 rounded-full" onClick={handleReload}>
            <RotateCw size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 rounded-full" onClick={handleGoHome}>
            <Home size={16} />
          </Button>
          
          <form onSubmit={handleUrlSubmit} className="flex-1">
            <Input
              type="text"
              value={inputValue}
              onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              className="h-8 text-xs"
            />
          </form>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white overflow-auto">
        {
            tabs.map((tab)=>{
               
                return <TabElement key={tab.id} 
                tab={tab} 
                activeTabId={activeTabId} />
                
            })
        }
      </div>
    </div>
  );
};


function TabElement({tab,activeTabId}:{tab:Tab,activeTabId:string | null}){

 //   const [error,setError] = useState<string | null >(null);

    return (<div key={tab.id} className={`${activeTabId === tab.id?"":"hidden"} w-full h-full`}>
        {tab && tab.url ? (
          <div className="w-full h-full overflow-auto flex flex-col items-center justify-center">
                <iframe
                className='w-full h-full'
                src={tab.url}
                allowFullScreen
                onError={(e)=>console.log("error in iframe:",e)}
                sandbox="allow-scripts allow-forms allow-same-origin"
                >

                </iframe>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold">New Tab</h2>
              <p className="text-gray-500">Type a URL in the address bar to get started</p>
            </div>
          </div>
        )}
        </div>)

}

export default Browser;