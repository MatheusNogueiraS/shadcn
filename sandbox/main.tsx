import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@/index.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Page } from "./page"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <ThemeProvider>
        <Page />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </StrictMode>
)
