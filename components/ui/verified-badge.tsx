

import { cn } from '@/lib/utils';

type BadgeSize = 'sm' | 'md' | 'lg';

interface VerifiedBadgeProps {
    size?: BadgeSize;
    className?: string;
}

const sizeMap: Record<BadgeSize, { icon: number; wrapper: string }> = {
    sm: { icon: 10, wrapper: 'h-3 w-3' },
    md: { icon: 12, wrapper: 'h-3.5 w-3.5' },
    lg: { icon: 14, wrapper: 'h-[18px] w-[18px]' },
};

export function VerifiedBadge({ size = 'md', className }: VerifiedBadgeProps) {
    const { icon, wrapper } = sizeMap[size];

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center rounded-full bg-[#2196F3] shrink-0',
                wrapper,
                className,
            )}
            title="Perfil Verificado"
            aria-label="Verificado"
        >
            <svg
                width={icon}
                height={icon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
            >
                <path
                    d="M9 12.75 11.25 15 15 9.75"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}
