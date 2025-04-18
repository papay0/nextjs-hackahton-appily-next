"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancePromptSwitchProps {
  value: boolean
  onChange: (value: boolean) => void
  variant?: "default" | "minimal"
}

export function EnhancePromptSwitch({ 
  value, 
  onChange,
  variant = "default" 
}: EnhancePromptSwitchProps) {
  
  return (
    <div className={cn(
      "flex items-center gap-2",
      variant === "minimal" ? "text-xs" : "text-sm"
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Switch 
                id="enhance-prompt"
                checked={value}
                onCheckedChange={onChange}
                className={variant === "minimal" ? "data-[state=checked]:bg-blue-600" : ""}
              />
              <Label 
                htmlFor="enhance-prompt" 
                className="cursor-pointer flex items-center gap-1"
              >
                Enhance
                <Zap className={cn(
                  "text-blue-500",
                  value ? "opacity-100" : "opacity-50",
                  variant === "minimal" ? "h-3.5 w-3.5" : "h-4 w-4"
                )} />
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Automatically enhance your prompt with additional context</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
