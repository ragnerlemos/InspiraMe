
import * as React from "react"
import { cn } from "@/lib/utils"

export function QuoteIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            {...props}
        >
            <path d="M10 3L6 21"/>
            <path d="M18 3L14 21"/>
        </svg>
    )
}
