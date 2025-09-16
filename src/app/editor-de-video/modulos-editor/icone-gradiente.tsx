import { cn } from "@/lib/utils";

export function IconeGradiente({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("lucide lucide-gradient", className)}
            {...props}
        >
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="18" r="2" />
            <path d="M7.5 7.5h9v9h-9z" />
            <path d="m22 2-2.5 2.5" />
            <path d="m2 22 2.5-2.5" />
            <path d="m2 6 2.5-2.5" />
            <path d="m6 2-2.5 2.5" />
            <path d="m18 22 2.5-2.5" />
            <path d="m22 18-2.5 2.5" />
        </svg>
    );
}
