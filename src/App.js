import React from 'react';

import { VerseSelector } from './VerseSelector';
import { Popupmenu } from './PopupMenu';
import { CrossReferenceDialog } from './CrossReferenceDialog';

import { removeDuplicate } from './utils';
import { Button } from '@material-ui/core';

export const App = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [crossReferencesByTopic, setCrossReferencesByTopic] = React.useState(
    JSON.parse(localStorage.getItem('cfByTopic') || '{}')
  );
  const [crossReferencesByVerse, setCrossReferencesByVerse] = React.useState(
    JSON.parse(localStorage.getItem('cfByVerse') || '{}')
  );
  const [referrerVerseAddress, setReferrerVerseAddress] = React.useState({});
  const [referredVerseAddress, setReferredVerseAddress] = React.useState({});
  const [
    crossReferencesHandler,
    setCrossReferencesHandler,
  ] = React.useState(() => {});

  const handleLocalStorage = () => {
    localStorage.setItem('cfByVerse', JSON.stringify(crossReferencesByVerse));
    localStorage.setItem('cfByTopic', JSON.stringify(crossReferencesByTopic));
  };

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
    topic,
    book2,
    chapter2,
    verse2
  ) => {
    //cfByTopic
    setCrossReferencesByTopic(crossReferencesByTopic => {
      const newCrossReferencesByTopic = { ...crossReferencesByTopic };

      newCrossReferencesByTopic[topic] = {
        ...(newCrossReferencesByTopic[topic] || {}),
      };

      newCrossReferencesByTopic[topic][book1] = {
        ...(newCrossReferencesByTopic[topic][book1] || {}),
      };
      newCrossReferencesByTopic[topic][book1][chapter1] = [
        ...(newCrossReferencesByTopic[topic][book1][chapter1] || []),
        verse1,
      ].filter(removeDuplicate);

      newCrossReferencesByTopic[topic][book2] = {
        ...(newCrossReferencesByTopic[topic][book2] || {}),
      };
      newCrossReferencesByTopic[topic][book2][chapter2] = [
        ...(newCrossReferencesByTopic[topic][book2][chapter2] || []),
        verse2,
      ].filter(removeDuplicate);

      console.log(newCrossReferencesByTopic);

      return newCrossReferencesByTopic;
    });

    //cfByVerse
    setCrossReferencesByVerse(crossReferencesByVerse => {
      const newCrossReferencesByVerse = { ...crossReferencesByVerse };

      newCrossReferencesByVerse[book1] = {
        ...(newCrossReferencesByVerse[book1] || {}),
      };
      newCrossReferencesByVerse[book1][chapter1] = {
        ...(newCrossReferencesByVerse[book1][chapter1] || {}),
      };
      newCrossReferencesByVerse[book1][chapter1][verse1] = [
        ...(newCrossReferencesByVerse[book1][chapter1][verse1] || []),
        topic,
      ].filter(removeDuplicate);

      newCrossReferencesByVerse[book2] = {
        ...(newCrossReferencesByVerse[book2] || {}),
      };
      newCrossReferencesByVerse[book2][chapter2] = {
        ...(newCrossReferencesByVerse[book2][chapter2] || {}),
      };
      newCrossReferencesByVerse[book2][chapter2][verse2] = [
        ...(newCrossReferencesByVerse[book2][chapter2][verse2] || []),
        topic,
      ].filter(removeDuplicate);

      console.log(newCrossReferencesByVerse);

      return newCrossReferencesByVerse;
    });
  };

  const handleReferrerVerseClick = (e, book, chapter, verse) => {
    handleOpenPopupMenu(e);
    setReferrerVerseAddress({ book, chapter, verse });
    setCrossReferencesHandler(handleCrossReference(book, chapter, verse));
  };

  const handleReferredVerseChange = verseAddress => {
    setReferredVerseAddress(verseAddress);
  };

  return (
    <div>
      <Button onClick={handleLocalStorage}>Save</Button>
      <VerseSelector
        handleVerseClick={handleReferrerVerseClick}
        handleVerseAddressChange={() => {}}
      />
      <Popupmenu
        anchorEl={anchorEl}
        handleClosePopupMenu={handleClosePopupMenu}
        handleOpenCrossReferenceDialog={handleOpenCrossReferenceDialog}
      />
      <CrossReferenceDialog
        open={isDialogOpen}
        handleCloseCrossReferenceDialog={handleCloseCrossReferenceDialog}
        handleCrossReference={crossReferencesHandler}
        handleReferredVerseChange={handleReferredVerseChange}
      />
    </div>
  );
};

export default App;
