import React, { act, useEffect, useState } from 'react'
import WindowContainer from '../window-container';
import {File,Folder,CopyPlus,CopyMinus,Cross ,X} from 'lucide-react';
import  MonacoEditor,{useMonaco,loader} from '@monaco-editor/react';

type Props = {}

const files ={
   
        "index.js":null,
        "public":{
            "favicon.png":null
        },
        "src":{
            "App.tsx":null,
            "index.css":null,
            "components":{
                "ui":{
                    "button.tsx":null,
                    "dropdown.tsx":null
                }
            }
        }
    
}

const FileOrDirectory =({name,item,onClick}:{name:string,
    item:any,
    onClick:(name:string,path:string)=>void})=>{

    const [isMinimized,setIsMinimized] = useState(name!=="/");

    if(!item){
        return <div className='flex items-center justify-start space-x-2 p-1
          hover:bg-gray-800 
        cursor-pointer
        '
        onClick={()=>onClick(name,"/")}
        >
            <File className='w-4 h-4' />
            <span>{name}</span>
        </div>
    }
    
    return (<div className=' select-none p-1'>
        <div className='flex items-center justify-start space-x-2 
        border border-transparent hover:border-blue-900 
        cursor-pointer'
        onClick={()=>setIsMinimized(prev=>!prev)}
        >
            <Folder className='w-4 h-4' />
            <span>{name}</span>
            <div
            className='ml-auto px-2 '>
            {
                !isMinimized?<CopyMinus className='w-3 h-3  ' />
                :<CopyPlus className='w-3 h-3' />
            }
            
            </div>
            
        </div>
        <div className='pl-3 overflow-hidden'>

        {
            
           !isMinimized && Object.keys(item).map((key)=>{
                return <FileOrDirectory key={key} name={key} item={item[key]} onClick={onClick} />
            })
        }
        </div>
    </div>)
}

const FileExplorer=({fileStructure,onClick}:{fileStructure:any,onClick:(name:string,path:string)=>void})=>{

    return (<div className=''>
        <div className='h-10 flex items-center p-2 border-b'>
        <div className='    border-gray-800 '>File Explorer</div>
        </div>
        <div className='p-2 '>
            <FileOrDirectory name={"/"} item={fileStructure} onClick={onClick} />
        </div>
    </div>)
}

function Editor({tabs,setTabs}:{tabs:any[],setTabs:(data:any)=>void}){

    const [activeTab,setActiveTab] = useState<any>({
        name:"",
        path:"",
    }); // use path as unique id

    const [fileData,setFileData] = useState<any>({
        "index.js":"const this is default data"
    });

    useEffect(()=>{
        if(tabs.length ===0){
             setActiveTab(null)
            return;
            };

            
            setActiveTab({
                name:tabs[tabs.length-1].name,
                path:tabs[tabs.length-1].name
            });
        
    },[tabs]);

    return ( <div 
    className='flex flex-col h-full'>
        <div className='h-10 flex items-center border-b'>
        {/* Tabs */}
        <div className='border-b flex w-full
        border-gray-800 h-full '>
            {
                tabs.map((tab)=>{
                    return <div 
                    className={`bg-gray-800 h-full w-40 
                         border-transparent border
                    ${activeTab?.path === tab.name ?"bg-gray-900 ":" border-r-gray-950"}
                        px-4 
                    flex items-center justify-between`}>
                        <span
                        onClick={()=>setActiveTab({
                            name:tab?.name,
                            path:tab?.name
                        })}
                        >{tab.name}</span>
                        <X className='w-4 h-4 cursor-pointer hover:bg-gray-600' 
                        onClick={()=>{
                            setTabs(tabs.filter((sTab)=>sTab.name!==tab.name))}
                        }
                        
                        />
                        </div>
                })
            }
        </div>
        </div>
        {/* Monaco Editor */}
        <div className='p-2 h-full '>
            {
              activeTab &&   <MonacoEditor 
                defaultLanguage='typescript'
                defaultValue={fileData[activeTab.path]}
                onChange={(data)=>{
                    setFileData((prev:any)=>({
                        ...prev,
                        [activeTab.path]:data
                    }))
                }}
                value={fileData[activeTab.path]}
                key={activeTab.path}
                theme={'vs-dark'}
                height={"100%"}
                />
            }
        </div>
        </div>
)

}


const CoderRoot = (props: Props) => {

    const [tabs,setTabs] = useState<any[]>([]);
    console.log("tabs",tabs);


  return (
    <WindowContainer
    title='Code Editor'
    >
        <div className='w-full h-full flex items-start justify-start '>
            <div className='w-[20%] border-r border-gray-800 h-full'>
            <FileExplorer 
             fileStructure={files}
             onClick={(name,path)=>{
                if(tabs.find(tab=>tab.name === name)) return;
                setTabs(prev=>[...prev,{
                    path,
                    name,
                    content:""
                }]);
            }} /></div>
            <div className='w-[80%] h-full flex flex-col  '>
                
                <div className='h-[60%] border border-gray-700'>
                    <Editor tabs={tabs} setTabs={(tabs)=>{ setTabs(tabs)}} />
                </div>
                <div className='h-[40%] border border-gray-700'>Footer</div>
               
            </div>
        </div>
    </WindowContainer>
  )
}

export default CoderRoot