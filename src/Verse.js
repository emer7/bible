import React from 'react';
import { styled } from '@material-ui/core/styles';

import esv from './ESV.json';

const SpanWithPointer = styled('span')({
  cursor: 'pointer',
});

export const Verse = ({ book, chapter, verse, handleVerseClick }) => {
  const handleOnClick = e => {
    handleVerseClick(e, { book, chapter, verse });
  };

  return (
    <SpanWithPointer onClick={handleOnClick}>
      {verse} {esv[book][chapter][verse]}
    </SpanWithPointer>
  );
};
