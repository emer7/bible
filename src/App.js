import React from 'react';

import { VersesSelector } from './VerseSelector';
import { Popupmenu } from './PopupMenu';
import { CrossReference } from './CrossReference';

import { removeDuplicate, flatMapBibleObjectTree } from './utils';
import { Button, Container, Grid, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

export const App = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isCrossReferenceOpen, setIsCrossReferenceOpen] = React.useState(false);

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

  const handleOpenCrossReference = () => {
    setIsCrossReferenceOpen(true);
  };

  const handleCloseCrossReference = () => {
    setIsCrossReferenceOpen(false);
  };

  const handleReferrerVerseClick = (e, verseAddress) => {
    const { book, chapter, verse } = verseAddress;

    handleOpenPopupMenu(e);
    setReferrerVerseAddress(verseAddress);
    setReferredVersesAddress({ book, chapter, verses: [verse] });
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
      ...referredVerses,
    ].filter(removeDuplicate);

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

    referredVerses.forEach(referredVerse => {
      newCrossReferencesByVerse[referredBook][referredChapter][
        referredVerse
      ] = [
        ...(newCrossReferencesByVerse[referredBook][referredChapter][
          referredVerse
        ] || []),
        topic,
      ].filter(removeDuplicate);
    });

    setCrossReferencesByVerse(newCrossReferencesByVerse);
  };

  const handleDeleteCrossReference = (topic, verseAddress) => {
    const { book, chapter, verse } = verseAddress;

    //cfByTopic
    const newCrossReferencesByTopic = { ...crossReferencesByTopic };
    const topicContent = newCrossReferencesByTopic[topic];
    const mappedTopicContent = flatMapBibleObjectTree(
      topicContent,
      ({ book, chapter, verse }) => ({
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
      ({ book, chapter, verse }) => ({
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
        ({ book, chapter, verse }) => ({
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
    <>
      <Popupmenu
        anchorEl={anchorEl}
        handleClosePopupMenu={handleClosePopupMenu}
        handleOpenCrossReference={handleOpenCrossReference}
      />

      <Container>
        <Grid justify="center" container>
          <Grid item sm={6}>
            <Grid container direction="column">
              <Grid item>
                <Button fullWidth onClick={handleLocalStorage}>
                  Save
                </Button>
              </Grid>
              <Grid item>
                <VersesSelector
                  handleVerseClick={handleReferrerVerseClick}
                  handleVersesAddressChange={() => {}}
                />
              </Grid>
            </Grid>
          </Grid>
          <CrossReference
            fullScreen={fullScreen}
            open={isCrossReferenceOpen}
            handleCloseCrossReference={handleCloseCrossReference}
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
            topicsFromReferred={(referredVerses || []).reduce(
              (acc, referredVerse) => [
                ...acc,
                ...((crossReferencesByVerse &&
                  crossReferencesByVerse[referredBook] &&
                  crossReferencesByVerse[referredBook][referredChapter] &&
                  crossReferencesByVerse[referredBook][referredChapter][
                    referredVerse
                  ]) ||
                  []),
              ],

              []
            )}
            crossReferencesByReferrer={(
              (crossReferencesByVerse &&
                crossReferencesByVerse[referrerBook] &&
                crossReferencesByVerse[referrerBook][referrerChapter] &&
                crossReferencesByVerse[referrerBook][referrerChapter][
                  referrerVerse
                ]) ||
              []
            ).map(topic => ({
              topic,
              content: crossReferencesByTopic[topic],
            }))}
          />
        </Grid>
      </Container>
    </>
  );
};

export default App;
