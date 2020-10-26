import React from 'react';

import { VersesSelector } from './VerseSelector';
import { Popupmenu } from './PopupMenu';
import { CrossReference } from './CrossReference';

import { removeDuplicate, flatMapBibleObjectTree } from './utils';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import {
  cfByTopic as laiCfByTopic,
  cfByVerse as laiCfByVerse,
} from './resources/LAICrossReferences.json';

export const App = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isCrossReferenceOpen, setIsCrossReferenceOpen] = React.useState(false);

  const [clickedVerseAddress, setClickedVerseAddress] = React.useState({});
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
    localStorage.getItem('cfByTopic')
      ? JSON.parse(localStorage.getItem('cfByTopic'))
      : laiCfByTopic
  );
  const [crossReferencesByVerse, setCrossReferencesByVerse] = React.useState(
    localStorage.getItem('cfByVerse')
      ? JSON.parse(localStorage.getItem('cfByVerse'))
      : laiCfByVerse
  );
  const [highlightsByVerse, setHighlightsByVerse] = React.useState(
    JSON.parse(localStorage.getItem('highlightsByVerse') || '{}')
  );

  const handleLocalStorage = () => {
    localStorage.setItem('cfByVerse', JSON.stringify(crossReferencesByVerse));
    localStorage.setItem('cfByTopic', JSON.stringify(crossReferencesByTopic));
    localStorage.setItem(
      'highlightsByVerse',
      JSON.stringify(highlightsByVerse)
    );
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
    handleOpenPopupMenu(e);
    setClickedVerseAddress(verseAddress);
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

  const handleSetReferrerAndReferred = () => {
    const { book, chapter, verse } = clickedVerseAddress;

    setReferrerVerseAddress(clickedVerseAddress);
    setReferredVersesAddress({ book, chapter, verses: [verse] });
  };

  const handleSetHighlight = () => {
    const { book, chapter, verse } = clickedVerseAddress;

    const newHighlightsByVerse = { ...highlightsByVerse };

    newHighlightsByVerse[book] = {
      ...(newHighlightsByVerse[book] || {}),
    };
    newHighlightsByVerse[book][chapter] = [
      ...(newHighlightsByVerse[book][chapter] || []),
      verse,
    ].filter(removeDuplicate);

    setHighlightsByVerse(newHighlightsByVerse);
  };

  return (
    <>
      <Popupmenu
        anchorEl={anchorEl}
        handleClosePopupMenu={handleClosePopupMenu}
        handleOpenCrossReference={handleOpenCrossReference}
        handleSetReferrerAndReferred={handleSetReferrerAndReferred}
        handleSetHighlight={handleSetHighlight}
      />

      <Container>
        <Grid justify="center" container spacing={3}>
          <Grid item xs={12} sm={10} md={6}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleLocalStorage}
                >
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Card>
                  <CardContent>
                    <VersesSelector
                      clickedVerseAddress={clickedVerseAddress}
                      highlightsByVerse={highlightsByVerse}
                      handleVerseClick={handleReferrerVerseClick}
                    />
                  </CardContent>
                </Card>
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
