"use client"

import { Home, PlusCircle, ShoppingBag } from "lucide-react"

interface TabsProps {
  activeTab: string
  onChange: (tab: string) => void
}

export function Tabs({ activeTab, onChange }: TabsProps) {
  return (
    <div className="flex items-center justify-around border-t border-zinc-200 dark:border-zinc-700 h-12">
      <TabButton
        icon={<Home size={20} />}
        label="Home"
        isActive={activeTab === "home"}
        onClick={() => onChange("home")}
      />
      <TabButton
        icon={<PlusCircle size={20} />}
        label="Build"
        isActive={activeTab === "build"}
        onClick={() => onChange("build")}
      />
      <TabButton
        icon={<ShoppingBag size={20} />}
        label="Store"
        isActive={activeTab === "store"}
        onClick={() => onChange("store")}
      />
    </div>
  )
}

interface TabButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function TabButton({ icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      className={`flex flex-col items-center justify-center w-20 py-1 transition-colors ${
        isActive ? "text-blue-500" : "text-zinc-500 dark:text-zinc-400"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  )
} 