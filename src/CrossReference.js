import React from 'react';
import {
  Button,
  Select,
  MenuItem,
  Card,
  Grid,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
  Modal,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { styled } from '@material-ui/styles';

import { VersesSelector } from './VerseSelector';
import { Verse, VerseWithHeading, VerseWithRangedHeading } from './Verse';

import {
  flatMapBibleObjectTree,
  removeDuplicate,
  mapToVerseAddress,
} from './utils';
import { NEW_DEFAULT_TOPIC, NEW_CUSTOM_TOPIC } from './consts';

const ConfirmButton = (topic, handleCrossReference) => ({
  book,
  chapter,
  verses,
}) => {
  const handleOnClick = () => {
    handleCrossReference(topic);
  };

  return <Button onClick={handleOnClick}>Confirm</Button>;
};

const CrossReferenceContent = ({
  referredVersesAddress,
  handleCrossReference,
  handleReferredVersesChange,
  handleDeleteCrossReference,
  handleDeleteTopic,
  handleRenameTopic,
  topicsFromReferrer,
  topicsFromReferred,
  crossReferencesByReferrer,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [topic, setTopic] = React.useState(NEW_DEFAULT_TOPIC);
  const [customTopic, setCustomTopic] = React.useState('');
  const [isTopicTextFieldOpen, setIsTopicTextFieldOpen] = React.useState(false);

  const { book, chapter, verses } = referredVersesAddress;

  const handleOpenSelector = () => {
    setIsSelectorOpen(true);
  };

  const handleCloseSelector = () => {
    setIsSelectorOpen(false);
  };

  const handleTopicChange = e => {
    const newTopic = e.target.value;

    setTopic(newTopic);
    if (newTopic === NEW_CUSTOM_TOPIC) {
      setIsTopicTextFieldOpen(true);
      setCustomTopic('');
    } else {
      setIsTopicTextFieldOpen(false);
    }
  };

  const handleCustomTopicChange = e => {
    const newCustomTopic = e.target.value;

    setCustomTopic(newCustomTopic);
  };

  const handleVersesAddressChange = versesAddress => {
    handleReferredVersesChange(versesAddress);

    if (
      topic !== NEW_DEFAULT_TOPIC &&
      topic !== NEW_CUSTOM_TOPIC &&
      !topicsFromReferrer.includes(topic)
    ) {
      setTopic(NEW_DEFAULT_TOPIC);
      setIsTopicTextFieldOpen(false);
    }
  };

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
      spacing={2}
    >
      {crossReferencesByReferrer.map(crossReferences => {
        const { topic, content } = crossReferences;

        const handleVerseClick = (_e, verseAddress) => {
          if (topic !== NEW_DEFAULT_TOPIC && topic !== NEW_CUSTOM_TOPIC) {
            setTopic(NEW_DEFAULT_TOPIC);
            setIsTopicTextFieldOpen(false);
          }
          handleDeleteCrossReference(topic, verseAddress);
        };

        const handleCloseClick = () => {
          if (topic !== NEW_DEFAULT_TOPIC && topic !== NEW_CUSTOM_TOPIC) {
            setTopic(NEW_DEFAULT_TOPIC);
            setIsTopicTextFieldOpen(false);
          }
          handleDeleteTopic(topic);
        };

        return (
          <Grid item key={topic}>
            <Card>
              <CardHeader
                title={
                  <TextField
                    defaultValue={topic}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        handleRenameTopic(topic, e.target.value);
                      }
                    }}
                  />
                }
                subheader="Press Enter to rename"
                action={
                  <IconButton onClick={handleCloseClick}>
                    <CloseIcon />
                  </IconButton>
                }
              />
              <CardContent>
                {
                  flatMapBibleObjectTree(
                    content,
                    mapToVerseAddress
                  ).reduce(
                    (acc, { book, chapter, verse }, index, verseAddresses) => {
                      if (index > 0) {
                        const previousIndex = index - 1;
                        const {
                          book: previousBook,
                          chapter: previousChapter,
                          verse: previousVerse,
                        } = verseAddresses[previousIndex];
                        if (
                          book === previousBook &&
                          chapter === previousChapter &&
                          parseInt(verse) === parseInt(previousVerse) + 1
                        ) {
                          const {
                            startVerseIndex,
                            startVerse,
                            componentArray,
                          } = acc;
                          const newComponentArray = [
                            ...componentArray.slice(0, startVerseIndex),
                            <VerseWithRangedHeading
                              key={`${book}${chapter}:${startVerse}`}
                              book={book}
                              chapter={chapter}
                              startVerse={startVerse}
                              endVerse={verse}
                              handleVerseClick={handleVerseClick}
                            />,
                            ...componentArray.slice(startVerseIndex + 1, index),
                            <Verse
                              key={`${book}${chapter}:${verse}`}
                              book={book}
                              chapter={chapter}
                              verse={verse}
                              handleVerseClick={handleVerseClick}
                            />,
                          ];

                          return {
                            startVerseIndex,
                            startVerse,
                            componentArray: newComponentArray,
                          };
                        }
                      }

                      const { componentArray } = acc;
                      const newComponentArray = [
                        ...componentArray,
                        <VerseWithHeading
                          key={`${book}${chapter}:${verse}`}
                          book={book}
                          chapter={chapter}
                          verse={verse}
                          handleVerseClick={handleVerseClick}
                        />,
                      ];

                      return {
                        startVerseIndex: index,
                        startVerse: verse,
                        componentArray: newComponentArray,
                      };
                    },
                    { startVerseIndex: 0, startVerse: 0, componentArray: [] }
                  ).componentArray
                }
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      <Grid item>
        {isSelectorOpen ? (
          <Card>
            <CardHeader
              title="New Reference"
              subheader="Select topic and verses"
              action={
                <IconButton onClick={handleCloseSelector}>
                  <CloseIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Select value={topic} onChange={handleTopicChange}>
                        <MenuItem value={NEW_DEFAULT_TOPIC}>
                          Auto-generate topic
                        </MenuItem>
                        <MenuItem value={NEW_CUSTOM_TOPIC}>
                          Custom topic
                        </MenuItem>
                        <MenuItem disabled>Available topics</MenuItem>
                        {[...topicsFromReferrer, ...topicsFromReferred]
                          .filter(removeDuplicate)
                          .map(topicOption => (
                            <MenuItem key={topicOption} value={topicOption}>
                              {topicOption}
                            </MenuItem>
                          ))}
                      </Select>
                    </Grid>
                    <Grid item>
                      {isTopicTextFieldOpen && (
                        <TextField
                          placeholder="Type here"
                          value={customTopic}
                          onChange={handleCustomTopicChange}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <VersesSelector
                    initialBook={book}
                    initialChapter={chapter}
                    initialVerses={verses}
                    handleVersesAddressChange={handleVersesAddressChange}
                    buttonRender={ConfirmButton(
                      topic === NEW_DEFAULT_TOPIC
                        ? new Date().getTime().toString()
                        : topic === NEW_CUSTOM_TOPIC
                        ? !customTopic
                          ? 'Empty topic ' + new Date().getTime().toString()
                          : customTopic
                        : topic,
                      handleCrossReference
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Button variant="contained" onClick={handleOpenSelector} fullWidth>
            Add Reference
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

const InvisibleScrollablePanel = styled('div')({
  height: 'calc(100vh - 36px - 8px - 8px - 8px - 4px + 8px)',
  margin: '0 -8px -8px -8px',
  padding: '0 8px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
});

const InvisibleScrollablePopup = styled(InvisibleScrollablePanel)({
  height: '100vh',
  'max-width': 'min(600px, calc(100vw - 64px))',
  margin: '0 auto',
  padding: '32px 0',
  outline: 0,
});

export const CrossReference = ({
  open,
  handleCloseCrossReference,
  fullScreen,
  ...contentProps
}) =>
  fullScreen ? (
    <Modal open={open} onClose={handleCloseCrossReference}>
      <InvisibleScrollablePopup>
        <CrossReferenceContent {...contentProps} />
      </InvisibleScrollablePopup>
    </Modal>
  ) : (
    open && (
      <Grid item xs={12} sm={10} md={6}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleCloseCrossReference}
            >
              Close
            </Button>
          </Grid>
          <Grid item>
            <InvisibleScrollablePanel>
              <CrossReferenceContent {...contentProps} />
            </InvisibleScrollablePanel>
          </Grid>
        </Grid>
      </Grid>
    )
  );
