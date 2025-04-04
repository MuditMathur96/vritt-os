import { useEffect, useState } from "react";

function useTime(){

      const [currentTime,setCurrentTime] = useState<Date>(new Date());
    useEffect(() => {
    
        let timer:NodeJS.Timeout;
    
        timer = setInterval(()=>{
            setCurrentTime(new Date());
        },1000 * 60);
     
        return () => {
          clearInterval(timer);
        };
      }, []);

      return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


}

export default useTime;