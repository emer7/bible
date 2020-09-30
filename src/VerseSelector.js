import React, { useState } from 'react';
import { Select, MenuItem, Grid } from '@material-ui/core';

import { Verse } from './Verse';

import esv from './ESV.json';

import { cannonArr } from './consts';

export const VersesSelector = ({
  initialBook,
  initialChapter,
  initialVerses,
  handleVerseClick,
  handleVersesAddressChange,
  buttonRender: RenderedView,
}) => {
  const [isFirstVerseSelection, setIsFirstVerseSelection] = useState(true);
  const [book, setBook] = useState(initialBook || 'Genesis');
  const [chapter, setChapter] = useState(initialChapter || '1');
  const [verses, setVerses] = useState(initialVerses || ['1']);

  const handleBookChange = e => {
    setBook(e.target.value);
    setChapter('1');
    setVerses(['1']);
    setIsFirstVerseSelection(true);
    handleVersesAddressChange({
      book: e.target.value,
      chapter: '1',
      verses: ['1'],
    });
  };

  const handleChapterChange = e => {
    setChapter(e.target.value);
    setVerses(['1']);
    setIsFirstVerseSelection(true);
    handleVersesAddressChange({
      book,
      chapter: e.target.value,
      verses: ['1'],
    });
  };

  const handleVersesChange = e => {
    const selectedVerses = e.target.value;

    if (selectedVerses.includes('0')) {
      const allVerses = Object.keys(esv[book][chapter]).sort((i, j) => i - j);

      setVerses(allVerses);
      handleVersesAddressChange({
        book,
        chapter,
        verses: allVerses,
      });
    } else if (isFirstVerseSelection) {
      const selectedVersesWithoutFirstSelection = e.target.value.filter(
        selectedVerse => selectedVerse !== verses[0]
      );

      setVerses(selectedVersesWithoutFirstSelection);
      setIsFirstVerseSelection(false);
    } else {
      setVerses(e.target.value);
      handleVersesAddressChange({
        book,
        chapter,
        verses: e.target.value,
      });
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Select value={book} onChange={handleBookChange}>
              {cannonArr.map(book => (
                <MenuItem key={book} value={book}>
                  {book}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select value={chapter} onChange={handleChapterChange}>
              {Object.keys(esv[book])
                .sort((i, j) => i - j)
                .map(chapter => (
                  <MenuItem key={chapter} value={chapter}>
                    {chapter}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              value={verses}
              onChange={handleVersesChange}
              renderValue={values => {
                if (!values.length) {
                  return 'Select a verse';
                } else if (values.length === 1) {
                  return values[0];
                } else {
                  return values
                    .sort((i, j) => i - j)
                    .reduce((acc, value) => {
                      if (
                        !acc.length ||
                        parseInt(value) !== parseInt(acc[acc.length - 1][1]) + 1
                      ) {
                        return [...acc, [value, value]];
                      } else {
                        return [
                          ...acc.slice(0, -1),
                          [acc[acc.length - 1][0], value],
                        ];
                      }
                    }, [])
                    .map(arrayedVerse =>
                      (arrayedVerse[0] === arrayedVerse[1]
                        ? arrayedVerse.slice(1)
                        : arrayedVerse
                      ).join(' - ')
                    )
                    .join('; ');
                }
              }}
              multiple
              displayEmpty
            >
              <MenuItem key="0" value="0">
                All
              </MenuItem>
              {Object.keys(esv[book][chapter])
                .sort((i, j) => i - j)
                .map(verse => (
                  <MenuItem key={verse} value={verse}>
                    {verse}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {verses.length ? (
          verses.map(verse => (
            <Verse
              key={`${book}${chapter}:${verse}`}
              book={book}
              chapter={chapter}
              verse={verse}
              handleVerseClick={handleVerseClick}
            />
          ))
        ) : (
          <span>Please select a verse</span>
        )}
      </Grid>
      <Grid item>
        {RenderedView && (
          <RenderedView book={book} chapter={chapter} verses={verses} />
        )}
      </Grid>
    </Grid>
  );
};
