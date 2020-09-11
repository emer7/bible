import React from 'react';

import { Popover, ButtonGroup, Button } from '@material-ui/core';

export const Popupmenu = ({
  anchorEl,
  handleClosePopupMenu,
  handleOpenCrossReferenceDialog,
}) => {
  const handleClickCrossReference = () => {
    handleClosePopupMenu();
    handleOpenCrossReferenceDialog();
  };
  
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClosePopupMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <ButtonGroup size="small" color="primary">
        <Button>Highlight</Button>
        <Button onClick={handleClickCrossReference}>Cross-reference</Button>
        <Button>Copy</Button>
      </ButtonGroup>
    </Popover>
  );
};