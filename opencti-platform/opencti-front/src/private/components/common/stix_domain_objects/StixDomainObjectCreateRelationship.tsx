import Button from '@mui/material/Button';
import StixCoreRelationshipCreationFromEntity from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import React, { useState } from 'react';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import { computeTargetStixCyberObservableTypes, computeTargetStixDomainObjectTypes } from '../../../../utils/stixTypeUtils';
import Security from '../../../../utils/Security';
import useNavigationContext from '../../../../utils/hooks/useNavigationContext';

const StixDomainObjectCreateRelationship = ({
  entity,
}: {
  entity: Record<string, unknown>
}) => {
  const {
    relationshipTypes,
    stixCoreObjectTypes,
    reversed,
    paginationOptions,
  } = useNavigationContext();

  const [reversedRelation, setReversedRelation] = useState(reversed);
  const handleReverseRelation = () => {
    setReversedRelation(!reversedRelation);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" variant="contained" onClick={() => setOpen(true)}>
        Create relationship
      </Button>
      <Security needs={[KNOWLEDGE_KNUPDATE]}>
        <StixCoreRelationshipCreationFromEntity
          entityId={entity.id as string}
          controlledOpen={open}
          controlledSetOpen={setOpen}
          allowedRelationshipTypes={relationshipTypes}
          isRelationReversed={reversedRelation}
          handleReverseRelation={handleReverseRelation}
          targetStixDomainObjectTypes={stixCoreObjectTypes && computeTargetStixDomainObjectTypes(stixCoreObjectTypes)}
          targetStixCyberObservableTypes={stixCoreObjectTypes && computeTargetStixCyberObservableTypes(stixCoreObjectTypes)}
          defaultStartTime={entity.first_seen as string}
          defaultStopTime={entity.last_seen as string}
          paginationOptions={paginationOptions}
          connectionKey="Pagination_stixCoreObjects"
          paddingRight={220}
        />
      </Security>
    </>
  );
};

export default StixDomainObjectCreateRelationship;
