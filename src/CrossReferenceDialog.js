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
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const [topic, setTopic] = React.useState(new Date().getTime().toString());

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
              <MenuItem value={topic} disabled>
                Default
              </MenuItem>
            </Select>
            <VerseSelector
              handleVerseClick={() => {}}
              buttonRender={ConfirmButton(topic, handleCrossReference)}
            />
          </>
        ) : (
          <Button onClick={handleOpenSelector}>+</Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
