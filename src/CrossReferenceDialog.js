import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Select,
  MenuItem,
} from '@material-ui/core';

import { VerseSelector } from './VerseSelector';

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
  topics,
  handleCrossReference,
  handleReferredVerseChange,
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
      {isSelectorOpen ? (
        <>
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
        </>
      ) : (
        <Button onClick={handleOpenSelector}>+</Button>
      )}
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
