import * as React from 'react';
import { Form } from 'react-bootstrap';
import { TextArea } from 'components/common/form';
import './ProjectNotes.scss';

export interface IProjectNotesProps {
  /** The formik field name by default this is notes */
  field?: string;
  /** provide a className for the wrapped project note textarea */
  className?: string;
  /** override the default note outerClassName */
  outerClassName?: string;
  /** the label of the notes field */
  label?: string;
  /** the tooltip to be included with the label */
  tooltip?: string;
  /** whether or not this text box can be interaced with */
  disabled?: boolean;
}

/**
 * Simple notes component intended for use with formik - ensures consistent cross step styling.
 * @param param0
 */
export default function ProjectNotes({
  label,
  tooltip,
  field,
  className,
  outerClassName,
  disabled,
}: IProjectNotesProps) {
  return (
    <Form.Row className="ProjectNotes">
      <TextArea
        disabled={disabled}
        tooltip={tooltip}
        label={label ?? 'Notes'}
        field={field ?? 'note'}
        className={className ?? 'col-md-5'}
        outerClassName={outerClassName ?? 'col-md-10'}
      />
    </Form.Row>
  );
}
