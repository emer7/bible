import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Select,
  MenuItem,
  Card,
  Grid,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
  ListSubheader,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { VerseSelector } from './VerseSelector';
import { VerseWithHeading } from './Verse';

import { flatMapBibleObjectTree, removeDuplicate } from './utils';
import { NEW_DEFAULT_TOPIC, NEW_CUSTOM_TOPIC } from './consts';

const ConfirmButton = (topic, handleCrossReference) => ({
  book,
  chapter,
  verse,
}) => {
  const handleOnClick = () => {
    handleCrossReference(topic);
  };

  return <Button onClick={handleOnClick}>Confirm</Button>;
};

const CrossReferenceDialogContent = ({
  referredVerseAddress,
  handleCrossReference,
  handleReferredVerseChange,
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

  const { book, chapter, verse } = referredVerseAddress;

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

  const handleVerseAddressChange = verseAddress => {
    handleReferredVerseChange(verseAddress);

    console.log(topicsFromReferrer);
    console.log(topic);

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
    <DialogContent>
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
                  {flatMapBibleObjectTree(content, (book, chapter, verse) => (
                    <VerseWithHeading
                      key={`${book}${chapter}${verse}`}
                      book={book}
                      chapter={chapter}
                      verse={verse}
                      handleVerseClick={handleVerseClick}
                    />
                  ))}
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
                subheader="Select topic and verse"
                action={
                  <IconButton onClick={handleCloseSelector}>
                    <CloseIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Select value={topic} onChange={handleTopicChange}>
                  <MenuItem value={NEW_DEFAULT_TOPIC}>
                    Auto-generate topic
                  </MenuItem>
                  <MenuItem value={NEW_CUSTOM_TOPIC}>Custom topic</MenuItem>
                  <ListSubheader>Available topics</ListSubheader>
                  {[...topicsFromReferrer, ...topicsFromReferred]
                    .filter(removeDuplicate)
                    .map(topicOption => (
                      <MenuItem key={topicOption} value={topicOption}>
                        {topicOption}
                      </MenuItem>
                    ))}
                </Select>
                {isTopicTextFieldOpen && (
                  <TextField
                    placeholder="Type here"
                    value={customTopic}
                    onChange={handleCustomTopicChange}
                  />
                )}

                <VerseSelector
                  initialBook={book}
                  initialChapter={chapter}
                  initialVerse={verse}
                  handleVerseClick={() => {}}
                  handleVerseAddressChange={handleVerseAddressChange}
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
              </CardContent>
            </Card>
          ) : (
            <Button variant="text" onClick={handleOpenSelector} fullWidth>
              Add Reference
            </Button>
          )}
        </Grid>
      </Grid>
    </DialogContent>
  );
};

export const CrossReferenceDialog = ({
  open,
  handleCloseCrossReferenceDialog,
  ...contentProps
}) => (
  <Dialog open={open} onClose={handleCloseCrossReferenceDialog}>
    <CrossReferenceDialogContent {...contentProps} />
  </Dialog>
);
