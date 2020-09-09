import React from 'react';
import { Dialog, DialogContent, Button } from '@material-ui/core';

import { VerseSelector } from './VerseSelector';

const ConfirmButton = ({ book, chapter, verse }) => {
  return (
    <Button onClick={() => console.log(book, chapter, verse)}>Confirm</Button>
  );
};

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
              buttonRender={ConfirmButton}
            />
          </>
        ) : (
          <Button onClick={handleOpenSelector}>+</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
