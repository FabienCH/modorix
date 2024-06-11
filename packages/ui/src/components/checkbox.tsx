import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '../utils/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxFormField = ({
  className,
  withLabel,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { withLabel: { id: string; label: string } }) => {
  return (
    <div className="items-center flex space-x-2">
      <Checkbox id={withLabel.id} className={className} {...props} />
      <div className="grid gap-1.5 leading-none hover:cursor-pointer active:cursor-pointer">
        <label
          htmlFor={withLabel.id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {withLabel.label}
        </label>
      </div>
    </div>
  );
};
CheckboxFormField.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, CheckboxFormField };
