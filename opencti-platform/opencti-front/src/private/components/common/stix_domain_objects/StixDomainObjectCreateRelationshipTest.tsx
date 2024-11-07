import Button from '@mui/material/Button';
import StixCoreRelationshipCreationFromEntity from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import { useRef } from 'react';

const StixDomainObjectCreateRelationshipTest = ({ entityId }) => {
  const buttonRef = useRef(null);
  return (
    <>
      <Button size="small" variant="outlined" onClick={() => buttonRef.current.click()}>
        Create relationship
      </Button>
      <StixCoreRelationshipCreationFromEntity
        entityId={entityId}
        buttonRef={buttonRef}
      />
    </>
  );
};

export default StixDomainObjectCreateRelationshipTest;