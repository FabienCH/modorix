import { CheckboxFormField } from '@modorix-ui/components/checkbox';
import { useEffect, useState } from 'react';
import { FormGroup } from '../../models/form-group';

interface GroupsToBlockFormProps {
  formGroups: FormGroup[];
  onCheckedChange: (group: FormGroup) => void;
  onAllCheckedChange: (isChecked: boolean) => void;
}

export function GroupsToBlockForm({ formGroups, onCheckedChange, onAllCheckedChange }: GroupsToBlockFormProps) {
  const [allChecked, setAllChecked] = useState(false);
  function handelAllCheckedChanges(): void {
    onAllCheckedChange(!allChecked);
    setAllChecked(!allChecked);
  }

  useEffect(() => {
    const isAllCheck = formGroups.every((group) => group.checked);
    setAllChecked(isAllCheck);
  }, [formGroups]);

  return (
    <>
      {formGroups.length > 1 ? (
        <CheckboxFormField
          key="all-groups"
          withLabel={{ id: 'all', label: 'All groups' }}
          checked={allChecked}
          onCheckedChange={() => handelAllCheckedChanges()}
        />
      ) : null}
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
    </>
  );
}
