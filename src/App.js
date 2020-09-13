import React from 'react';

import { VersesSelector } from './VerseSelector';
import { Popupmenu } from './PopupMenu';
import { CrossReferenceDialog } from './CrossReferenceDialog';

import { removeDuplicate, flatMapBibleObjectTree } from './utils';
import { Button, Container } from '@material-ui/core';

export const App = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [referrerVerseAddress, setReferrerVerseAddress] = React.useState({});
  const [referredVersesAddress, setReferredVersesAddress] = React.useState({});
  const {
    book: referrerBook,
    chapter: referrerChapter,
    verse: referrerVerse,
  } = referrerVerseAddress;
  const {
    book: referredBook,
    chapter: referredChapter,
    verses: referredVerses,
  } = referredVersesAddress;

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

  const handleReferrerVerseClick = (e, verseAddress) => {
    handleOpenPopupMenu(e);
    setReferrerVerseAddress(verseAddress);
    setReferredVersesAddress(verseAddress);
  };

  const handleReferredVersesChange = versesAddress => {
    setReferredVersesAddress(versesAddress);
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
      referredVerses,
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
    newCrossReferencesByVerse[referredBook][referredChapter][referredVerses] = [
      ...(newCrossReferencesByVerse[referredBook][referredChapter][
        referredVerses
      ] || []),
      topic,
    ].filter(removeDuplicate);

    console.log(newCrossReferencesByVerse);
    setCrossReferencesByVerse(newCrossReferencesByVerse);
  };

  const handleDeleteCrossReference = (topic, verseAddress) => {
    const { book, chapter, verse } = verseAddress;

    //cfByTopic
    const newCrossReferencesByTopic = { ...crossReferencesByTopic };
    const topicContent = newCrossReferencesByTopic[topic];
    const mappedTopicContent = flatMapBibleObjectTree(
      topicContent,
      (book, chapter, verse) => ({
        book,
        chapter,
        verse,
      })
    );

    if (mappedTopicContent.length === 1) {
      delete newCrossReferencesByTopic[topic];
    } else {
      const verseNumberListByVerse = topicContent[book][chapter];
      const verseIndex = verseNumberListByVerse.indexOf(verse);
      verseNumberListByVerse.splice(verseIndex, 1);
    }

    setCrossReferencesByTopic(newCrossReferencesByTopic);

    //cfByVerse
    const newCrossReferencesByVerse = { ...crossReferencesByVerse };

    const topicListByVerse = newCrossReferencesByVerse[book][chapter][verse];
    const topicIndex = topicListByVerse.indexOf(topic);
    topicListByVerse.splice(topicIndex, 1);

    setCrossReferencesByVerse(newCrossReferencesByVerse);
  };

  const handleDeleteTopic = topic => {
    //cfByTopic
    const newCrossReferencesByTopic = { ...crossReferencesByTopic };
    const topicContent = newCrossReferencesByTopic[topic];
    delete newCrossReferencesByTopic[topic];

    setCrossReferencesByTopic(newCrossReferencesByTopic);

    //cfByVerse
    const newCrossReferencesByVerse = { ...crossReferencesByVerse };
    const mappedTopicContent = flatMapBibleObjectTree(
      topicContent,
      (book, chapter, verse) => ({
        book,
        chapter,
        verse,
      })
    );

    mappedTopicContent.forEach(verseAddress => {
      const { book, chapter, verse } = verseAddress;

      const topicListByVerse = newCrossReferencesByVerse[book][chapter][verse];
      const topicIndex = topicListByVerse.indexOf(topic);
      topicListByVerse.splice(topicIndex, 1);
    });

    setCrossReferencesByVerse(newCrossReferencesByVerse);
  };

  const handleRenameTopic = (oldTopicName, newTopicName) => {
    if (!crossReferencesByTopic[newTopicName]) {
      //cfByTopic
      const newCrossReferencesByTopic = { ...crossReferencesByTopic };
      const topicContent = newCrossReferencesByTopic[oldTopicName];

      newCrossReferencesByTopic[newTopicName] = {
        ...newCrossReferencesByTopic[oldTopicName],
      };
      delete newCrossReferencesByTopic[oldTopicName];

      setCrossReferencesByTopic(newCrossReferencesByTopic);

      //cfByVerse
      const newCrossReferencesByVerse = { ...crossReferencesByVerse };
      const mappedTopicContent = flatMapBibleObjectTree(
        topicContent,
        (book, chapter, verse) => ({
          book,
          chapter,
          verse,
        })
      );

      mappedTopicContent.forEach(verseAddress => {
        const { book, chapter, verse } = verseAddress;

        const topicListByVerse =
          newCrossReferencesByVerse[book][chapter][verse];
        const topicIndex = topicListByVerse.indexOf(oldTopicName);
        topicListByVerse[topicIndex] = newTopicName;
      });

      setCrossReferencesByVerse(newCrossReferencesByVerse);
    }
  };

  return (
    <Container>
      <Button onClick={handleLocalStorage}>Save</Button>
      <VersesSelector
        handleVerseClick={handleReferrerVerseClick}
        handleVersesAddressChange={() => {}}
      />
      <Popupmenu
        anchorEl={anchorEl}
        handleClosePopupMenu={handleClosePopupMenu}
        handleOpenCrossReferenceDialog={handleOpenCrossReferenceDialog}
      />
      <CrossReferenceDialog
        open={isDialogOpen}
        handleCloseCrossReferenceDialog={handleCloseCrossReferenceDialog}
        referredVersesAddress={referredVersesAddress}
        handleCrossReference={handleCrossReference}
        handleReferredVersesChange={handleReferredVersesChange}
        handleDeleteCrossReference={handleDeleteCrossReference}
        handleDeleteTopic={handleDeleteTopic}
        handleRenameTopic={handleRenameTopic}
        topicsFromReferrer={
          (crossReferencesByVerse &&
            crossReferencesByVerse[referrerBook] &&
            crossReferencesByVerse[referrerBook][referrerChapter] &&
            crossReferencesByVerse[referrerBook][referrerChapter][
              referrerVerse
            ]) ||
          []
        }
        topicsFromReferred={
          (crossReferencesByVerse &&
            crossReferencesByVerse[referredBook] &&
            crossReferencesByVerse[referredBook][referredChapter] &&
            crossReferencesByVerse[referredBook][referredChapter][
              referredVerses
            ]) ||
          []
        }
        crossReferencesByReferrer={(
          (crossReferencesByVerse &&
            crossReferencesByVerse[referrerBook] &&
            crossReferencesByVerse[referrerBook][referrerChapter] &&
            crossReferencesByVerse[referrerBook][referrerChapter][
              referrerVerse
            ]) ||
          []
        ).map(topic => ({ topic, content: crossReferencesByTopic[topic] }))}
      />
    </Container>
  );
};

export default App;
