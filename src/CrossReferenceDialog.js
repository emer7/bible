import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';

export const CrossReferenceDialog = ({
  open,
  handleCloseCrossReferenceDialog,
}) => {
  return (
    <Dialog open={open} onClose={handleCloseCrossReferenceDialog}>
      <DialogContent>Test</DialogContent>
    </Dialog>
  );
};
