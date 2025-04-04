import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCcw, Cpu, HardDrive, Activity, Wifi, Database } from 'lucide-react';
import { useWindowContext } from '@/context/windows-context';
import { Button } from '@/components/ui/button';

const TaskManager = () => {
  // Mock data
  const {windows,closeWindow} = useWindowContext();

  // System performance metrics
  const systemPerformance = {
    cpu: 28,
    memory: 62,
    disk: 12,
    network: 5,
    gpu: 15,
  };

  function getObjectSizeInMB(obj: any): number {
    const str = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(str).length;
    const mb = bytes / (1024 * 1024);
    return  parseFloat(mb.toFixed(3));
  }

  return (
    <div className="flex flex-col w-full h-full mx-auto bg-slate-100 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-slate-800">Task Manager</h1>
        <button className="flex items-center gap-1 text-sm px-2 py-1 bg-slate-200 rounded hover:bg-slate-300">
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

     <div className='flex-1 flex flex-col justify-between '>
      <Tabs defaultValue="processes" className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-4">
          <TabsTrigger value="processes">Processes</TabsTrigger>
         
          <TabsTrigger value="app-history">App history</TabsTrigger>
          <TabsTrigger value="startup">Startup</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="processes" className="mt-0">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-100">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    {/* <TableHead className="font-semibold">CPU</TableHead> */}
                    <TableHead className="font-semibold">Memory</TableHead>
                    {/* <TableHead className="font-semibold">Disk</TableHead> */}
                    <TableHead className="font-semibold">Network</TableHead>
                    <TableHead className="font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {windows.map((process) => {
                 

                   return  <TableRow key={process.id} className="hover:bg-slate-200 cursor-pointer">
                      <TableCell>{process.title}</TableCell>
                      <TableCell>running</TableCell>
                      {/* <TableCell>{process.cpu.toFixed(1)}%</TableCell> */}
                      <TableCell>{getObjectSizeInMB(process)} MB</TableCell>
                      {/* <TableCell>{process.disk.toFixed(1)} MB/s</TableCell> */}
                      <TableCell>0.5 Mbps</TableCell>
                      <TableCell>
                        <Button 
                        onClick={()=>closeWindow(process.id)}
                        variant={"destructive"}>Stop</Button>
                      </TableCell>
                    </TableRow>
                  }
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      
        
        <TabsContent value="app-history" className="mt-0">
          <Card>
            <CardContent className="p-8 flex items-center justify-center text-slate-500">
              <p>App history information would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="startup" className="mt-0">
          <Card>
            <CardContent className="p-8 flex items-center justify-center text-slate-500">
              <p>Startup programs would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <Card>
            <CardContent className="p-8 flex items-center justify-center text-slate-500">
              <p>User session information would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 p-2 bg-slate-200 rounded text-sm text-slate-600">
        <div className="flex justify-between">
          <div>Processes: 78</div>
          <div>CPU: {systemPerformance.cpu}%</div>
          <div>Memory: {systemPerformance.memory}%</div>
          <div>Disk: {systemPerformance.disk}%</div>
          <div>Network: {systemPerformance.network} Mbps</div>
        </div>
      </div>
     </div>
    </div>
  );
};

export default TaskManager;