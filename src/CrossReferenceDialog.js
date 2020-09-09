import React from 'react';
import { Dialog, DialogContent, Button } from '@material-ui/core';

import { VerseSelector } from './VerseSelector';

export const CrossReferenceDialog = ({
  open,
  handleCloseCrossReferenceDialog,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);

  const handleOpenSelector = () => {
    setIsSelectorOpen(true);
  };

  return (
    <Dialog open={open} onClose={handleCloseCrossReferenceDialog}>
      <DialogContent>
        {isSelectorOpen ? (
          <>
            <VerseSelector
              handleVerseClick={() => {}}
            />
          </>
        ) : (
          <Button onClick={handleOpenSelector}>+</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
