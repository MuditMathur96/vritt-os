"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Desktop, { initialIcons } from './desktop';

const WindowsWelcomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [showUser, setShowUser] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Simulate loading sequence
    const timer1 = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    const timer2 = setTimeout(() => {
      setShowUser(true);
    }, 4000);
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(timeInterval);
    };
  }, []);

  const handleSignIn = () => {
    setShowDesktop(true);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <AnimatePresence>
        {!showDesktop && (
          <motion.div 
            className="absolute inset-0 bg-blue-700 flex flex-col items-center justify-center text-white z-10"
            exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] } }}
          >
            {/* Windows Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="mb-16"
            >
              {/* <div className="grid grid-cols-2 gap-2">
                <div className="h-16 w-16 bg-white opacity-90"></div>
                <div className="h-16 w-16 bg-white opacity-90"></div>
                <div className="h-16 w-16 bg-white opacity-90"></div>
                <div className="h-16 w-16 bg-white opacity-90"></div>
              </div> */}
            </motion.div>
            
            {/* Loading Animation */}
            {loading && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex space-x-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="h-4 w-4 rounded-full bg-white"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* User greeting (appears after loading) */}
            {!loading && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl font-light mb-4">Welcome</h1>
                {showUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-4">
                      <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                        <svg className="h-16 w-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <p className="text-xl font-normal">User</p>
                    </div>
                    
                    <motion.button 
                      className="mt-4 px-8 py-2 bg-blue-600 rounded hover:bg-blue-500 focus:outline-none"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSignIn}
                    >
                      Sign in
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
            
           
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Screen */}
      {
        showDesktop && <Desktop icons={initialIcons} />
      }
     
    </div>
  );
};

export default WindowsWelcomeScreen;