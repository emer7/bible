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

export const VerseWithHeading = ({ book, chapter, verse, ...props }) => {
  return (
    <div>
      <div>
        <b>
          {book} {chapter}:{verse}
        </b>
      </div>
      <Verse book={book} chapter={chapter} verse={verse} {...props} />
    </div>
  );
};

export const VerseWithRangedHeading = ({
  book,
  chapter,
  startVerse,
  endVerse,
  ...props
}) => {
  return (
    <>
      <div>
        <b>
          {book} {chapter}:{startVerse} - {endVerse}
        </b>
      </div>
      <Verse book={book} chapter={chapter} verse={startVerse} {...props} />
    </>
  );
};
