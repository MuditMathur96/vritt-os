import express from 'express';

export default class ExpressServer{

    private app:express.Application | null = null;

    createServer(){
        this.app = express();
        return this.app;
    }
    startServer(port:number){
        this.app?.listen(port,()=>{
            console.log("Server started at",port);
        });
    }

    

}