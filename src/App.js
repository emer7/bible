import React from 'react';

import { VerseSelector } from './VerseSelector';
import { Popupmenu } from './PopupMenu';
import { CrossReferenceDialog } from './CrossReferenceDialog';

import { removeDuplicate } from './utils';
import { Button } from '@material-ui/core';

export const App = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [referrerVerseAddress, setReferrerVerseAddress] = React.useState({});
  const [referredVerseAddress, setReferredVerseAddress] = React.useState({});
  const {
    book: referrerBook,
    chapter: referrerChapter,
    verse: referrerVerse,
  } = referrerVerseAddress;
  const {
    book: referredBook,
    chapter: referredChapter,
    verse: referredVerse,
  } = referredVerseAddress;

  const [crossReferencesByTopic, setCrossReferencesByTopic] = React.useState(
    JSON.parse(localStorage.getItem('cfByTopic') || '{}')
  );
  const [crossReferencesByVerse, setCrossReferencesByVerse] = React.useState(
    JSON.parse(localStorage.getItem('cfByVerse') || '{}')
  );
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

  const handleCrossReference = topic => {
    //cfByTopic
    const newCrossReferencesByTopic = { ...crossReferencesByTopic };

    newCrossReferencesByTopic[topic] = {
      ...(newCrossReferencesByTopic[topic] || {}),
    };

    newCrossReferencesByTopic[topic][referrerBook] = {
      ...(newCrossReferencesByTopic[topic][referrerBook] || {}),
    };
    newCrossReferencesByTopic[topic][referrerBook][referrerChapter] = [
      ...(newCrossReferencesByTopic[topic][referrerBook][referrerChapter] ||
        []),
      referrerVerse,
    ].filter(removeDuplicate);

    newCrossReferencesByTopic[topic][referredBook] = {
      ...(newCrossReferencesByTopic[topic][referredBook] || {}),
    };
    newCrossReferencesByTopic[topic][referredBook][referredChapter] = [
      ...(newCrossReferencesByTopic[topic][referredBook][referredChapter] ||
        []),
      referredVerse,
    ].filter(removeDuplicate);

    console.log(newCrossReferencesByTopic);
    setCrossReferencesByTopic(newCrossReferencesByTopic);

    //cfByVerse
    const newCrossReferencesByVerse = { ...crossReferencesByVerse };

    newCrossReferencesByVerse[referrerBook] = {
      ...(newCrossReferencesByVerse[referrerBook] || {}),
    };
    newCrossReferencesByVerse[referrerBook][referrerChapter] = {
      ...(newCrossReferencesByVerse[referrerBook][referrerChapter] || {}),
    };
    newCrossReferencesByVerse[referrerBook][referrerChapter][referrerVerse] = [
      ...(newCrossReferencesByVerse[referrerBook][referrerChapter][
        referrerVerse
      ] || []),
      topic,
    ].filter(removeDuplicate);

    newCrossReferencesByVerse[referredBook] = {
      ...(newCrossReferencesByVerse[referredBook] || {}),
    };
    newCrossReferencesByVerse[referredBook][referredChapter] = {
      ...(newCrossReferencesByVerse[referredBook][referredChapter] || {}),
    };
    newCrossReferencesByVerse[referredBook][referredChapter][referredVerse] = [
      ...(newCrossReferencesByVerse[referredBook][referredChapter][
        referredVerse
      ] || []),
      topic,
    ].filter(removeDuplicate);

    console.log(newCrossReferencesByVerse);
    setCrossReferencesByVerse(newCrossReferencesByVerse);
  };

  const handleReferrerVerseClick = (e, verseAddress) => {
    handleOpenPopupMenu(e);
    setReferrerVerseAddress(verseAddress);
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
        topics={[
          ...((crossReferencesByVerse &&
            crossReferencesByVerse[referrerBook] &&
            crossReferencesByVerse[referrerBook][referrerChapter] &&
            crossReferencesByVerse[referrerBook][referrerChapter][
              referrerVerse
            ]) ||
            []),
          ...((crossReferencesByVerse &&
            crossReferencesByVerse[referredBook] &&
            crossReferencesByVerse[referredBook][referredChapter] &&
            crossReferencesByVerse[referredBook][referredChapter][
              referredVerse
            ]) ||
            []),
        ].filter(removeDuplicate)}
        handleCloseCrossReferenceDialog={handleCloseCrossReferenceDialog}
        handleCrossReference={handleCrossReference}
        handleReferredVerseChange={handleReferredVerseChange}
      />
    </div>
  );
};

export default App;
