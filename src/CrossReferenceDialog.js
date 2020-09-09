import React from 'react';
import { Dialog, DialogContent, Button } from '@material-ui/core';

import { VerseSelector } from './VerseSelector';

const ConfirmButton = handleCrossReference => ({ book, chapter, verse }) => {
  const handleOnClick = () => {
    handleCrossReference(book, chapter, verse);
  };

  return <Button onClick={handleOnClick}>Confirm</Button>;
};

export const CrossReferenceDialog = ({
  open,
  handleCloseCrossReferenceDialog,
  handleCrossReference,
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
              buttonRender={ConfirmButton(handleCrossReference)}
            />
          </>
        ) : (
          <Button onClick={handleOpenSelector}>+</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
