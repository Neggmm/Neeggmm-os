import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 ease-[var(--ease-os)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-signal text-signal-foreground hover:bg-signal-strong',
        secondary:
          'bg-surface-3 text-text-primary border border-border hover:border-border-strong hover:bg-surface-3/80',
        ghost: 'text-text-secondary hover:bg-surface-2 hover:text-text-primary',
        outline:
          'border border-border text-text-primary hover:border-border-strong hover:bg-surface-2',
        destructive: 'bg-danger text-danger-foreground hover:bg-danger/90',
        link: 'text-signal underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
