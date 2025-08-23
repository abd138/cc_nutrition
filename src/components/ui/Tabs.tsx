import { ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsListProps {
  children: ReactNode;
}

interface TabsTriggerProps {
  children: ReactNode;
  value: string;
}

interface TabsContentProps {
  children: ReactNode;
  value: string;
}

export const Tabs = ({ children }: TabsProps) => {
  return <div className="tabs">{children}</div>;
};

export const TabsList = ({ children }: TabsListProps) => {
  return <div className="tabs-list flex space-x-4">{children}</div>;
};

export const TabsTrigger = ({ children }: TabsTriggerProps) => {
  return (
    <button className="tabs-trigger px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
      {children}
    </button>
  );
};

export const TabsContent = ({ children }: TabsContentProps) => {
  return <div className="tabs-content">{children}</div>;
};