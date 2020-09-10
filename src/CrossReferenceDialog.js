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
    handleCrossReference(topic, book, chapter, verse);
  };

  return <Button onClick={handleOnClick}>Confirm</Button>;
};

export const CrossReferenceDialog = ({
  open,
  handleCloseCrossReferenceDialog,
  handleCrossReference,
  handleReferredVerseChange,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [topic, setTopic] = React.useState('New');

  const handleOpenSelector = () => {
    setIsSelectorOpen(true);
  };

  const handleTopicChange = e => {
    setTopic(e.target.value);
  };

  return (
    <Dialog open={open} onClose={handleCloseCrossReferenceDialog}>
      <DialogContent>
        {isSelectorOpen ? (
          <>
            <Select value={topic} onChange={handleTopicChange}>
              <MenuItem value="New">New</MenuItem>
            </Select>
            <VerseSelector
              handleVerseClick={() => {}}
              handleVerseAddressChange={handleReferredVerseChange}
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
    </Dialog>
  );
};
