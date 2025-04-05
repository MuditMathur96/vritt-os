
class FileSystem{

    static async createInstance(){
        const res = await fetch("http://localhost:9000/file-system");
        const json = await res.json();


    }

    createFile(fileName:string,filePath:string,content:string=""){}
    updateFile(path:string,content:string){}
    createFolder(folderName:string,path:string){}
    updateFolderName(path:string,name:string){}


}

export default FileSystem;