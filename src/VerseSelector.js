import React, { useState } from 'react';
import { Select, MenuItem } from '@material-ui/core';

import { Verse } from './Verse';

import esv from './ESV.json';

import { cannonArr } from './consts';

export const VerseSelector = () => {
  const [book, setBook] = useState('Genesis');
  const [chapter, setChapter] = useState('1');
  const [verse, setVerse] = useState('1');

  const handleBookChange = e => {
    setBook(e.target.value);
    setChapter('1');
    setVerse('1');
  };

  const handleChapterChange = e => {
    setChapter(e.target.value);
    setVerse('1');
  };

  const handleVerseChange = e => {
    setVerse(e.target.value);
  };

  return (
    <>
      <div>
        <Select value={book} onChange={handleBookChange}>
          {cannonArr.map(book => (
            <MenuItem key={book} value={book}>
              {book}
            </MenuItem>
          ))}
        </Select>
        <Select value={chapter} onChange={handleChapterChange}>
          {Object.keys(esv[book])
            .sort((i, j) => i - j)
            .map(chapter => (
              <MenuItem key={chapter} value={chapter}>
                {chapter}
              </MenuItem>
            ))}
        </Select>
        <Select value={verse} onChange={handleVerseChange}>
          {Object.keys(esv[book][chapter])
            .sort((i, j) => i - j)
            .map(verse => (
              <MenuItem key={verse} value={verse}>
                {verse}
              </MenuItem>
            ))}
        </Select>
      </div>
      <div>
        <Verse book={book} chapter={chapter} verse={verse} />
      </div>
    </>
  );
};
