import React from 'react';

import esv from './ESV.json';

export const Verse = ({ book, chapter, verse }) => {
  return (
    <span>
      {verse} {esv[book][chapter][verse]}
    </span>
  );
};
