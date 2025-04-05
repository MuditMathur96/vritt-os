export default class Configs{
    public static OSWebServerUrl:string = process.env.NEXT_PUBLIC_OSWebServerURL || "";

    public static terminalEvents={
        terminalWrite:"terminal:write",
        terminalUpdate:"terminal:update"
    }
}