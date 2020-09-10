import React, { useState } from 'react';
import { Select, MenuItem } from '@material-ui/core';

import { Verse } from './Verse';

import esv from './ESV.json';

import { cannonArr } from './consts';

export const VerseSelector = ({
  initialBook,
  initialChapter,
  initialVerse,
  handleVerseClick,
  handleVerseAddressChange,
  buttonRender: RenderedView,
}) => {
  const [book, setBook] = useState(initialBook || 'Genesis');
  const [chapter, setChapter] = useState(initialChapter || '1');
  const [verse, setVerse] = useState(initialVerse || '1');

  const handleBookChange = e => {
    setBook(e.target.value);
    setChapter('1');
    setVerse('1');
    handleVerseAddressChange({
      book: e.target.value,
      chapter: '1',
      verse: '1',
    });
  };

  const handleChapterChange = e => {
    setChapter(e.target.value);
    setVerse('1');
    handleVerseAddressChange({
      book,
      chapter: e.target.value,
      verse: '1',
    });
  };

  const handleVerseChange = e => {
    setVerse(e.target.value);
    handleVerseAddressChange({
      book,
      chapter,
      verse: e.target.value,
    });
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
        <Verse
          book={book}
          chapter={chapter}
          verse={verse}
          handleVerseClick={handleVerseClick}
        />
      </div>
      {RenderedView && (
        <RenderedView book={book} chapter={chapter} verse={verse} />
      )}
    </>
  );
};
