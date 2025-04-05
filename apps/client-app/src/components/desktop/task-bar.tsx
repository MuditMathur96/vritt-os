import React, { useState, useEffect } from 'react';
import { Search, Settings, Power, User, FileText, Image, Mail, Calendar, Store, Folder, Play, ChevronRight, Wifi, BatteryFull, Speaker, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useTime from '@/hooks/useTime';
import { apps, useWindowContext } from '@/context/windows-context';
import { createPortal } from 'react-dom';

const Taskbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentTime = useTime();

  const {windows,bringToFront,addWindow,minimizeWindow,maximizeWindow} = useWindowContext();



  // Toggle start menu
  const toggleStartMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      const startButton = document.getElementById('start-button');
      const startMenu = document.getElementById('start-menu');
      
      if (isOpen && 
          startButton && 
          startMenu && 
          !startButton.contains(event.target) && 
          !startMenu.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <motion.div 
    className="h-12 bg-gray-800 flex items-center px-2 fixed bottom-0 w-screen"
    initial={{ y: 50 }}
    animate={{ y: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
    >
      {/* Taskbar */}
      <div className="w-full h-12 bg-slate-800 bg-opacity-90 backdrop-blur flex justify-between items-center px-2 z-10">
       
        <div className='w-1/3'></div>
        <div className='w-1/3 flex items-center gap-2'>
        <button 
          id="start-button" 
          onClick={toggleStartMenu}
          className="w-10 h-10 flex items-center justify-center text-white rounded hover:bg-slate-700 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 88 88" className="text-blue-500">
            <path d="M0,12.4V38.9H41.7V0H0V12.4Z" fill="currentColor"/>
            <path d="M46.3,0V38.9H88V0H46.3Z" fill="currentColor"/>
            <path d="M0,43.5V88H41.7V43.5H0Z" fill="currentColor"/>
            <path d="M46.3,43.5V88H88V43.5H46.3Z" fill="currentColor"/>
          </svg>

        </button>
          {
            windows.map((win)=>{
              
              return <div
              className='cursor-pointer hover:bg-gray-700 p-2 rounded' 
              >
                <win.icon color="white"
             
             onClick={()=>{
                if(win.isMaximized) {
                  minimizeWindow(win.id);
                  return;
                }

                if(win.isMinimized){
                  maximizeWindow(win.id);
                }

                bringToFront(win.id);
                
            
            }}
             />

              </div>
            })
          }
        </div>
        
         {/* System tray */}
         <div className="ml-auto flex items-center gap-2 ">
              <div className="text-white text-sm mr-4">
                {currentTime}
              </div>
              <div>
                <Wifi color='white'/>  
              </div>
              <div>
                <BatteryFull color="white" />
              </div>
              <div>
                <Volume2  color='white'/>
              </div>
             
            </div>
      </div>
      
      {/* Start Menu */}
      {
        createPortal(  <div 
          style={{
            zIndex:"99999"
          }}
            id="start-menu"
            className={`fixed left-1/4 bottom-14 w-full max-w-lg bg-slate-800 text-white bg-opacity-95 backdrop-blur-xl rounded-lg shadow-xl p-4 pb-6 
              
              transform origin-bottom-left transition-all duration-300 ease-in-out
             z-[9999999] 
             ${isOpen?"opacity-100 bottom-[55px]":"opacity-0 bottom-[-350px]"}
           ` }
          >
            {/* Search bar */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Type to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-10 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-slate-500" />
            </div>
            
            {/* Pinned section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Pinned</h3>
                <button className="text-xs text-blue-500 flex items-center hover:underline">
                  All apps <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {Object.keys(apps).map(key => {
                  const Icon = apps[key].icon;
    
                 return (  <div
                  onClick={()=>{
                    addWindow(key);
                    setIsOpen(false);
                  }} 
                    key={key}
                    className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-slate-300 cursor-pointer transition-colors"
                  >
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-1.5 rounded-md mb-1">
                        <Icon />
                    </div>
                    <span className="text-xs text-center">{apps[key].title}</span>
                  </div>)
                }
                )}
              </div>
            </div>
            
         
            
            {/* User and power section */}
            <div className="absolute bottom-2 left-0 w-full px-4 flex justify-between items-center">
              {/* <div className="flex items-center cursor-pointer rounded-md p-1 hover:bg-slate-300">
                <div className="bg-slate-400 rounded-full p-1 mr-2">
                  <User size={18} />
                </div>
                <span className="text-sm">User</span>
              </div> */}
              
              <div className="flex items-center cursor-pointer rounded-md p-1 hover:bg-slate-300 ml-auto">
                <Power size={18} className="text-slate-600" />
              </div>
            </div>
          </div>,document.body)
      }
    
    </motion.div>
  );
};

export default Taskbar;