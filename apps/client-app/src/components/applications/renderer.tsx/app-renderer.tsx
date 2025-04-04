import { apps } from "@/context/windows-context";
import React from "react";



function AppRenderer({id}:{id:keyof typeof apps}){

    

    const App = apps[id].component;
    return App?<App />:null;

}

export default AppRenderer;