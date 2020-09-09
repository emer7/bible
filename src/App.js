import React from 'react';

import { VerseSelector } from './VerseSelector';
import { Popupmenu } from './PopupMenu';
import { CrossReferenceDialog } from './CrossReferenceDialog';

export const App = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [crossReferencesByTopic, setCrossReferencesByTopic] = React.useState(
    '{}'
  );
  const [crossReferencesByVerse, setCrossReferencesByVerse] = React.useState(
    '{}'
  );

  const [
    crossReferencesHandler,
    setCrossReferencesHandler,
  ] = React.useState(() => {});

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

  const handleCrossReference = (book1, chapter1, verse1) => () => (
    book2,
    chapter2,
    verse2
  ) => {
    console.log(1, book1, chapter1, verse1);
    console.log(2, book2, chapter2, verse2);
  };

  const handleVerseClick = (e, book, chapter, verse) => {
    handleOpenPopupMenu(e);
    setCrossReferencesHandler(handleCrossReference(book, chapter, verse));
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
        handleCrossReference={crossReferencesHandler}
      />
    </div>
  );
};

export default App;
