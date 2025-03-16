import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(({ 
  className, 
  checked, 
  onCheckedChange,
  ...props 
}, ref) => {
  const handleCheckedChange = () => {
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-primary text-primary-foreground",
        className
      )}
      onClick={handleCheckedChange}
      ref={ref}
      {...props}
    >
      {checked && (
        <Check className="h-3 w-3 text-current" />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
export default Checkbox; 