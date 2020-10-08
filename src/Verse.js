import React from 'react';
import { styled } from '@material-ui/core/styles';

import esv from './ESV.json';

const SpanWithPointer = styled(({ highlight, ...props }) => (
  <span {...props} />
))({
  'background-color': ({ highlight }) => (highlight ? 'yellow' : 'none'),
  cursor: 'pointer',
});

export const Verse = ({
  book,
  chapter,
  verse,
  handleVerseClick,
  highlight,
}) => {
  const handleOnClick = e => {
    handleVerseClick(e, { book, chapter, verse });
  };

  return (
    <SpanWithPointer highlight={highlight} onClick={handleOnClick}>
      <sup>{verse}</sup>
      <span>
        {esv[book][chapter][verse]}
        {' ' /* remove, use CSS instead */}
      </span>
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
