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
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { VerseSelector } from './VerseSelector';
import { VerseWithHeading } from './Verse';

import { flatMapBibleObjectTree } from './utils';

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
  referrerVerseAddress,
  handleCrossReference,
  handleReferredVerseChange,
  handleDeleteCrossReference,
  handleDeleteTopic,
  handleRenameTopic,
  topics,
  crossReferencesByReferrer,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [topic, setTopic] = React.useState('New');

  const { book, chapter, verse } = referrerVerseAddress;

  const handleOpenSelector = () => {
    setIsSelectorOpen(true);
  };

  const handleTopicChange = e => {
    setTopic(e.target.value);
  };

  const handleVerseAddressChange = verseAddress => {
    handleReferredVerseChange(verseAddress);
    setTopic('New');
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
            handleDeleteCrossReference(topic, verseAddress);
          };

          const handleCloseClick = () => {
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
              <CardContent>
                <Select value={topic} onChange={handleTopicChange}>
                  <MenuItem value="New">New</MenuItem>
                  {topics.map(topicOption => (
                    <MenuItem key={topicOption} value={topicOption}>
                      {topicOption}
                    </MenuItem>
                  ))}
                </Select>
                <VerseSelector
                  initialBook={book}
                  initialChapter={chapter}
                  initialVerse={verse}
                  handleVerseClick={() => {}}
                  handleVerseAddressChange={handleVerseAddressChange}
                  buttonRender={ConfirmButton(
                    topic === 'New' ? new Date().getTime().toString() : topic,
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
