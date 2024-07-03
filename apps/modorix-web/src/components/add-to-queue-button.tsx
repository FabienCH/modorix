import { Button, ButtonProps } from '@modorix-ui/components/button';
import { forwardRef } from 'react';

export const AddToQueueButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button size={'sm'} ref={ref} {...props}>
        Add to queue
      </Button>
    );
  },
);
