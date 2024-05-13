import { createContext, useState, useContext, ReactNode } from "react";

interface ViteContextType {
  stream: MediaStream | null;
  setStream: (stream: MediaStream | null) => void;
}

const ViteContext = createContext<ViteContextType | null>(null);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  return (
    <ViteContext.Provider
      value={{
        stream,
        setStream,
      }}
    >
      {children}
    </ViteContext.Provider>
  );
};

export const useVite = () => {
  const context = useContext(ViteContext);
  if (!context) {
    throw new Error("useVite must be used within a ViteProvider");
  }
  return context;
};
