import { CheckboxFormField } from '@modorix-ui/components/checkbox';
import { FormGroup } from '../../models/form-group';

interface GroupsToBlockFormProps {
  formGroups: FormGroup[];
  onCheckedChange: (group: FormGroup) => void;
}

export function GroupsToBlockForm({ formGroups, onCheckedChange }: GroupsToBlockFormProps) {
  return (
    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-3">
      {formGroups.map((formGroup) => (
        <CheckboxFormField
          key={formGroup.id}
          withLabel={{ id: formGroup.id, label: formGroup.name }}
          checked={formGroup.checked}
          onCheckedChange={() => onCheckedChange(formGroup)}
        />
      ))}
    </div>
  );
}
