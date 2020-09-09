import React from 'react';
import { styled } from '@material-ui/core/styles';

import esv from './ESV.json';

const SpanWithPointer = styled('span')({
  cursor: 'pointer',
});

export const Verse = ({ book, chapter, verse, handleVerseClick }) => {
  return (
    <SpanWithPointer onClick={handleVerseClick}>
      {verse} {esv[book][chapter][verse]}
    </SpanWithPointer>
  );
};
