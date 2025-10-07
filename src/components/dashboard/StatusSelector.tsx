import React from 'react';
import { Field, FieldProps } from 'formik';
import { TaskStatusEnum } from '@/schemas/task.schema';

type StatusSelectorProps = {
  name: string;
  disabled?: boolean;
};

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  name,
  disabled = false,
}) => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps<string>) => {
        const value = field.value as keyof typeof TaskStatusEnum;
        const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
          form.setFieldValue(name, evt.target.value);
        };

        return (
          <div className="flex space-x-4">
            {Object.keys(TaskStatusEnum).map((statusKey) => (
              <label
                key={statusKey}
                className={`flex items-center cursor-pointer ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={statusKey}
                  checked={value === statusKey}
                  onChange={handleChange}
                  disabled={disabled}
                  className="mr-2"
                />
                <span>{statusKey}</span>
              </label>
            ))}
          </div>
        );
      }}
    </Field>
  );
};

// If you want a standalone (non-Formik) version:
type StatusSelectorStandaloneProps = {
  value: keyof typeof TaskStatusEnum;
  onChange: (newStatus: keyof typeof TaskStatusEnum) => void;
  disabled?: boolean;
};

export const StatusSelectorStandalone: React.FC<StatusSelectorStandaloneProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex space-x-4">
      {Object.keys(TaskStatusEnum).map((statusKey) => (
        <label
          key={statusKey}
          className={`flex items-center cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <input
            type="radio"
            name="status"
            value={statusKey}
            checked={value === statusKey}
            onChange={(evt) => onChange(evt.target.value as keyof typeof TaskStatusEnum)}
            disabled={disabled}
            className="mr-2"
          />
          <span>{statusKey}</span>
        </label>
      ))}
    </div>
  );
};
