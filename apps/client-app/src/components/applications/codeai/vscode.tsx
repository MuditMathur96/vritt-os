import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

import { Folder, File, ChevronRight, ChevronDown, X, Code, Settings, Search, Terminal } from 'lucide-react';

// Define types for our file system
type FileType = {
  id: string;
  name: string;
  type: 'file';
  content: string;
  path?:string
};

type FolderType = {
  id: string;
  name: string;
  type: 'folder';
  children: (FileType | FolderType)[];
  isOpen?: boolean;
};

type FileSystemItem = FileType | FolderType;

// Define type for open tabs
type TabType = {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  path?:string
};

const fileTypes:Record<string,string>={
  "tsx":"typescript",
  "jsx":"javscript",
  "ts":"typescript",
  "js":"javascript",
  "html":"html",
  "py":"python",
  "go":'golang',
  "json":"json"
}

function Editor({data,onChange,tabName}:{tabName:string,data:string,onChange:(data:string)=>void}){
   
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<any>(null);

    function getLanguageFromName(name:string){

      const arr = name.split(".");
      const ext = arr[arr.length-1];
      console.log("language: ",fileTypes[ext]);
      return fileTypes[ext] || "javascript";
    }

    useEffect(()=>{
        if(monacoRef.current && editorRef.current){
            
            console.log(tabName)
            const model = monacoRef.current.editor.createModel( data,getLanguageFromName(tabName) );
            console.log("model:",model);
            editorRef.current.setModel(model);

        }


    },[tabName,editorRef.current]);

    return ( <div 
    className='flex flex-col h-full'>
      
        {/* Monaco Editor */}
        <div className=' h-full '>
            {
            <MonacoEditor 
                keepCurrentModel={false}
                onMount={(editor,monaco)=>{
                    editorRef.current = editor;
                    monacoRef.current=monaco;
                }}
                defaultLanguage='typescript'
                defaultValue={data}
                onChange={(data)=>onChange(data || "")}
                value={data}

                theme={'vs-dark'}
                height={"100%"}
                />
            }
        </div>
        </div>
)

}


const VSCodeUI = () => {
  // Sample file system structure

  const [fileData,setFileData] = useState<Record<string,string>>({
    "index.js":"const this is default data"
});
  const initialFileSystem: FolderType[] = [
    {
      id: 'root-1',
      name: 'project',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'folder-1',
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            {
              id: 'file-1',
              name: 'App.tsx',
              type: 'file',
              content: 'import React from "react";\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <h1>Hello World</h1>\n      </header>\n    </div>\n  );\n}\n\nexport default App;'
            },
            {
              id: 'file-2',
              name: 'index.tsx',
              type: 'file',
              content: 'import React from "react";\nimport ReactDOM from "react-dom";\nimport App from "./App";\n\nReactDOM.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n  document.getElementById("root")\n);'
            }
          ]
        },
        {
          id: 'folder-2',
          name: 'public',
          type: 'folder',
          isOpen: false,
          children: [
            {
              id: 'file-3',
              name: 'index.html',
              type: 'file',
              content: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <title>React App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>'
            }
          ]
        },
        {
          id: 'file-4',
          name: 'package.json',
          type: 'file',
          content: '{\n  "name": "my-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}'
        },
        {
          id: 'file-5',
          name: 'tsconfig.json',
          type: 'file',
          content: '{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "esModuleInterop": true,\n    "allowSyntheticDefaultImports": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noFallthroughCasesInSwitch": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx"\n  },\n  "include": ["src"]\n}'
        }
      ]
    }
  ];

  // State for file system, open tabs, and active tab
  const [fileSystem, setFileSystem] = useState<FolderType[]>(initialFileSystem);
  const [tabs, setTabs] = useState<TabType[]>([]);

  // Toggle folder open/closed
  const toggleFolder = (id: string) => {
    const updateFileSystemItem = (item: FileSystemItem): FileSystemItem => {
      if (item.id === id && item.type === 'folder') {
        return { ...item, isOpen: !item.isOpen };
      }
      
      if (item.type === 'folder') {
        return {
          ...item,
          children: item.children.map(updateFileSystemItem)
        };
      }
      
      return item;
    };
    
    setFileSystem(fileSystem.map(updateFileSystemItem) as FolderType[]);
  };

  // Open a file in a tab
  const openFile = (file: FileType) => {
    // Check if the file is already open

    console.log(file.path)
    if (!tabs.some(tab => tab.id === file.id)) {
      // If not, add a new tab
      setTabs([
        ...tabs.map(tab => ({ ...tab, isActive: false })),
        { id: file.id, name: file.name, 
            content: file.content,
             isActive: true,
             path:file.path
            }
      ]);
    } else {
      // If already open, just make it active
      setTabs(tabs.map(tab => 
        tab.id === file.id 
          ? { ...tab, isActive: true } 
          : { ...tab, isActive: false }
      ));
    }
  };

  // Close a tab
  const closeTab = (id: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === id);
    const newTabs = tabs.filter(tab => tab.id !== id);
    
    // If we're closing the active tab, activate another tab if possible
    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].isActive = true;
    }
    
    setTabs(newTabs);
  };

  // Set a tab as active
  const setActiveTab = (id: string) => {
    setTabs(tabs.map(tab => 
      tab.id === id 
        ? { ...tab, isActive: true } 
        : { ...tab, isActive: false }
    ));
  };

  // Render file tree recursively
  const renderFileTree = (items: FileSystemItem[], depth = 0, path="") => {
    return items.map(item => {
      const paddingLeft = `${depth * 16}px`;
      
      if (item.type === 'folder') {
        return (
          <div key={item.id}>
            <div 
              className="flex items-center py-1 px-2 hover:bg-gray-800 cursor-pointer"
              onClick={() => toggleFolder(item.id)}
              style={{ paddingLeft }}
            >
              {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="mx-1 text-blue-400" />
              <span>{item.name}</span>
            </div>
            {item.isOpen && renderFileTree(item.children, depth + 1,path=path+"/"+item.name)}
          </div>
        );
      } else {
        return (
          <div 
            key={item.id} 
            className="flex items-center py-1 px-2 hover:bg-gray-800 cursor-pointer"
            onClick={() => openFile({...item,path:`${path}/${item.name}`})}
            style={{ paddingLeft: `${paddingLeft}` }}
          >
            <div className="w-4"></div>
            <File size={16} className="mx-1 text-yellow-300" />
            <span>{item.name}</span>
          </div>
        );
      }
    });
  };

  // Find the active tab
  const activeTab = tabs.find(tab => tab.isActive);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 overflow-hidden">
      {/* Title bar */}
      <div className="bg-gray-950 p-2 text-sm flex items-center border-b border-gray-700">
        <Code size={18} className="mr-2" />
        <span className="mr-4">VS Code Clone</span>
        <div className="flex space-x-4">
          <span className="cursor-pointer hover:text-white">File</span>
          <span className="cursor-pointer hover:text-white">Edit</span>
          <span className="cursor-pointer hover:text-white">View</span>
          <span className="cursor-pointer hover:text-white">Terminal</span>
          <span className="cursor-pointer hover:text-white">Help</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Side bar - File Explorer */}
        <div className="w-64 border-r border-gray-700 flex flex-col">
          <div className="p-2 text-sm font-bold border-b border-gray-700 flex items-center">
            <span>EXPLORER</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {renderFileTree(fileSystem)}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-gray-800 border-b border-gray-700">
            {tabs.map(tab => (
              <div 
                key={tab.id}
                className={`
                  flex items-center px-3 py-2 max-w-xs border-r border-gray-700 cursor-pointer
                  ${tab.isActive ? 'bg-gray-900' : 'bg-gray-800 hover:bg-gray-850'}
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                <File size={14} className="mr-1 text-yellow-300" />
                <span className="truncate text-sm">{tab.name}</span>
                <X 
                  size={14} 
                  className="ml-2 text-gray-400 hover:text-white" 
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-auto bg-gray-900">
            {activeTab ? (
              <Editor 
             // key={activeTab.name}
              data={fileData[activeTab.name]}
              onChange={(newData:string)=>{
                setFileData(prev=>({...prev,[activeTab.name]:newData}))
              }}
              tabName={activeTab.path!}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <span>No file is open</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-blue-600 text-white py-1 px-4 text-xs flex justify-between">
        <div className="flex items-center space-x-2">
          <span>main</span>
          <span>TypeScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

export default VSCodeUI;