import { Check } from 'components/common/form/Check';
import Roles from 'constants/roles';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { Fragment } from 'react';
import { Form } from 'react-bootstrap';

import { IStepProps } from '../../interfaces';

/**
 * Form component of ApprovalConfirmationForm.
 * @param param0 isReadOnly disable editing
 */
const ApprovalConfirmationForm = ({ isReadOnly }: IStepProps) => {
  const fieldName = 'confirmation';
  const keycloak = useKeycloakWrapper();
  const isSres = keycloak.hasRole(Roles.SRES) || keycloak.hasRole(Roles.SRES_FINANCIAL_MANAGER);
  const groupName = isSres ? 'The owning Ministry/Agency' : 'My Ministry/Agency';
  const label =
    groupName + ` has approval/authority to submit the Disposal Project to SRES for review.`;
  return (
    <Fragment>
      <h3>Approval</h3>
      <Form.Group>
        <Check field={fieldName} postLabel={label} required disabled={isReadOnly} />
      </Form.Group>
    </Fragment>
  );
};

export default ApprovalConfirmationForm;
