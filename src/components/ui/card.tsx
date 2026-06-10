import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('bg-card text-card-foreground shadow-card rounded-xl', className)}
      {...props}
    />
  );
}
Card.displayName = 'Card';

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}
CardHeader.displayName = 'CardHeader';

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('leading-none font-semibold tracking-tight', className)} {...props} />;
}
CardTitle.displayName = 'CardTitle';

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-muted-foreground text-sm', className)} {...props} />;
}
CardDescription.displayName = 'CardDescription';

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}
CardContent.displayName = 'CardContent';

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
