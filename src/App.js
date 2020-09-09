import React from 'react';

import { VerseSelector } from './VerseSelector';
import { Popupmenu } from './PopupMenu';
import { CrossReferenceDialog } from './CrossReferenceDialog';

export const App = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleOpenPopupMenu = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleClosePopupMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenCrossReferenceDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseCrossReferenceDialog = () => {
    setIsDialogOpen(false);
  };

  const handleVerseClick = (e, book, chapter, verse) => {
    handleOpenPopupMenu(e);
    console.log(1, book, chapter, verse);
  };

  return (
    <div>
      <VerseSelector handleVerseClick={handleVerseClick} />
      <Popupmenu
        anchorEl={anchorEl}
        handleClosePopupMenu={handleClosePopupMenu}
        handleOpenCrossReferenceDialog={handleOpenCrossReferenceDialog}
      />
      <CrossReferenceDialog
        open={isDialogOpen}
        handleCloseCrossReferenceDialog={handleCloseCrossReferenceDialog}
      />
    </div>
  );
};

export default App;
