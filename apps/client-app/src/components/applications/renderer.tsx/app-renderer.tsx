import { apps } from "@/context/windows-context";
import useIsMounted from "@/hooks/useIsMounted";
import React from "react";



function AppRenderer({id}:{id:keyof typeof apps}){

    const isMounted = useIsMounted();

    if(!isMounted) return;

    const App = apps[id].component;
    return App?<App />:null;

}

export default AppRenderer;