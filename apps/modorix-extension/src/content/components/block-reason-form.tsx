import { CheckboxFormField } from '@modorix-ui/components/checkbox';
import { FormBlockReason } from '../../core/form-block-reason';

interface BlockReasonFormProps {
  formBlockReasons: FormBlockReason[];
  displayNoSelectionError: boolean;
  onCheckedChange: (blockReason: FormBlockReason) => void;
}

export function BlockReasonForm({ formBlockReasons, displayNoSelectionError, onCheckedChange }: BlockReasonFormProps) {
  return (
    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 my-3">
      {formBlockReasons.map((blockReason) => (
        <CheckboxFormField
          key={blockReason.id}
          withLabel={{ id: blockReason.id, label: blockReason.label }}
          checked={blockReason.checked}
          onCheckedChange={() => onCheckedChange(blockReason)}
        />
      ))}
      {displayNoSelectionError ? <p className="text-[0.8rem] font-medium text-destructive">Please select at least one reason.</p> : null}
    </div>
  );
}
