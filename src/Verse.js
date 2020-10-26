import React from 'react';
import { styled } from '@material-ui/core';

import esv from './resources/ESV.json';

const SpanWithPointer = styled(({ highlight, isClicked, ...props }) => (
  <span {...props} />
))({
  'border-bottom': ({ isClicked }) => (isClicked ? 'dotted black' : 'none'),
  'background-color': ({ highlight }) => (highlight ? 'yellow' : 'none'),
  cursor: 'pointer',
});

const DivWithBold = styled('div')({ 'font-weight': 'bold' });

export const Verse = ({
  book,
  chapter,
  verse,
  handleVerseClick = () => {},
  highlight,
  isClicked,
}) => {
  const handleOnClick = e => {
    handleVerseClick(e, { book, chapter, verse });
  };

  return (
    <SpanWithPointer
      highlight={highlight}
      onClick={handleOnClick}
      isClicked={isClicked}
    >
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
    <>
      <DivWithBold>
        {book} {chapter}:{verse}
      </DivWithBold>
      <Verse book={book} chapter={chapter} verse={verse} {...props} />
    </>
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
      <DivWithBold>
        {book} {chapter}:{startVerse} - {endVerse}
      </DivWithBold>
      <Verse book={book} chapter={chapter} verse={startVerse} {...props} />
    </>
  );
};
