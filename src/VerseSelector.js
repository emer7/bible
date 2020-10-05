import React, { useState } from 'react';
import { Select, MenuItem, Grid, styled } from '@material-ui/core';

import { Verse } from './Verse';

import esv from './ESV.json';

import { cannonArr } from './consts';

const InvisibleScrollablePanel = styled('div')({
  'max-height': 'calc(100vh - 52px - 16px - 84px)',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '-ms-overflow-style': 'none',
  'scrollbar-width': 'none',
});

export const VersesSelector = ({
  initialBook,
  initialChapter,
  initialVerses,
  handleVerseClick,
  handleVersesAddressChange,
  buttonRender: RenderedButton,
}) => {
  const [isFirstVerseSelection, setIsFirstVerseSelection] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [book, setBook] = useState(initialBook || 'Genesis');
  const [chapter, setChapter] = useState(initialChapter || '1');
  const [verses, setVerses] = useState(initialVerses || ['1']);

  const handleBookChange = e => {
    setBook(e.target.value);
    setChapter('1');
    setVerses(['1']);
    handleVersesAddressChange({
      book: e.target.value,
      chapter: '1',
      verses: ['1'],
    });
    setIsFirstVerseSelection(true);
  };

  const handleChapterChange = e => {
    setChapter(e.target.value);
    setVerses(['1']);
    handleVersesAddressChange({
      book,
      chapter: e.target.value,
      verses: ['1'],
    });
    setIsFirstVerseSelection(true);
  };

  const handleVersesChange = e => {
    const selectedVerses = e.target.value;

    if (selectedVerses.includes('-1')) {
      setVerses([]);
      handleVersesAddressChange({
        book,
        chapter,
        verses: [],
      });
      setIsFirstVerseSelection(true);
      setIsOpen(false);
    } else if (selectedVerses.includes('0')) {
      const allVerses = Object.keys(esv[book][chapter]).sort((i, j) => i - j);

      setVerses(allVerses);
      handleVersesAddressChange({
        book,
        chapter,
        verses: allVerses,
      });
      setIsFirstVerseSelection(false);
      setIsOpen(false);
    } else if (isFirstVerseSelection) {
      const selectedVersesWithoutFirstSelection = e.target.value.filter(
        selectedVerse => selectedVerse !== verses[0]
      );

      setVerses(selectedVersesWithoutFirstSelection);
      setIsFirstVerseSelection(false);
      setIsOpen(false);
    } else {
      const selectedVerses = e.target.value.sort((i, j) => i - j);

      setVerses(selectedVerses);
      handleVersesAddressChange({
        book,
        chapter,
        verses: selectedVerses,
      });
    }
  };

  const handleOpenSelect = () => {
    setIsOpen(true);
  };

  const handleCloseSelect = () => {
    setIsOpen(false);
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
              open={isOpen}
              value={verses}
              onOpen={handleOpenSelect}
              onClose={handleCloseSelect}
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
              {Object.keys(esv[book][chapter]).length === verses.length ? (
                <MenuItem key="-1" value="-1">
                  None
                </MenuItem>
              ) : (
                <MenuItem key="0" value="0">
                  All
                </MenuItem>
              )}
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
        <InvisibleScrollablePanel>
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
        </InvisibleScrollablePanel>
      </Grid>
      {RenderedButton && (
        <Grid item>
          <RenderedButton book={book} chapter={chapter} verses={verses} />
        </Grid>
      )}
    </Grid>
  );
};
