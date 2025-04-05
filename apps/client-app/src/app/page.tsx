"use client"
import WindowsWelcomeScreen from "@/components/welcome-screen";
import SocketProvider from "@/context/socket-context";
import { WindowContextProvider } from "@/context/windows-context";

export default function Home() {
  return (
    <div className="">
    <SocketProvider>
    <WindowContextProvider>
      <WindowsWelcomeScreen />
    </WindowContextProvider>
    </SocketProvider>
    </div>
  );
}
