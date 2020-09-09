import React from 'react';

import esv from './ESV.json';

export const Verse = ({ book, chapter, verse, handleVerseClick }) => {
  return (
    <span onClick={handleVerseClick}>
      {verse} {esv[book][chapter][verse]}
    </span>
  );
};
