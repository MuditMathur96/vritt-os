import * as pty from 'node-pty';

export default class Terminal{

    private ptyProcess:pty.IPty;
    constructor(){
        const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
        console.log(shell);
        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME || "/app",
            env: process.env
          });
    }

    write(data:string){
        this.ptyProcess.write(data);
    }

    onData(func:(data:string)=>void){
        this.ptyProcess.onData(func);
    }




}