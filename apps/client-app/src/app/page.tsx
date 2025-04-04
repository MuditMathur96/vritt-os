"use client"
import WindowsWelcomeScreen from "@/components/welcome-screen";
import { WindowContextProvider } from "@/context/windows-context";

export default function Home() {
  return (
    <div className="">
    <WindowContextProvider>
      <WindowsWelcomeScreen />
    </WindowContextProvider>
    </div>
  );
}
