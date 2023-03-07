import React from 'react';
import { AccordionActions, styled } from '@material-ui/core';

import esv from './resources/ESV.json';

const SpanWithPointer = styled(({ highlight, isClicked, ...props }) => (
  <span {...props} />
))({
  borderBottom: ({ isClicked }) => (isClicked ? 'dotted black' : 'none'),
  backgroundColor: ({ highlight }) => (highlight ? 'yellow' : 'none'),
  cursor: 'pointer',
  userSelect: 'none',
});

const DivWithBold = styled('div')({ 'font-weight': 'bold' });

const Word = styled(({ isHighlighted, ...props }) => <span {...props} />)({
  borderBottom: ({ isHighlighted }) => (isHighlighted ? 'red solid' : 'none'),
});

export const Verse = ({
  book,
  chapter,
  verse,
  highlight,
  isMouseHold,
  isClicked,
  handleVerseClick = () => {},
  handleWordClick = () => {},
  handleHoldMouse,
  handleReleaseMouse,
  scribbleByWord,
  setScribble,
  source,
  destination,
}) => {
  const handleOnClick = e => {
    handleVerseClick(e, { book, chapter, verse });
  };

  const handleOnMouseEnter = (word, index) => {
    if (isMouseHold) {
      const prevKey =
        index - 1 < 0
          ? parseInt(verse) - 1 < 1
            ? true
            : parseInt(verse) -
              1 +
              ':' +
              (esv[book][chapter][parseInt(verse) - 1].split(' ').length - 1)
          : verse + ':' + (index - 1);

      const nextKey =
        index + 1 >= esv[book][chapter][verse].split(' ').length
          ? parseInt(verse) + 1 > Object.keys(esv[book][chapter]).length
            ? true
            : parseInt(verse) + 1 + ':' + '0'
          : verse + ':' + (index + 1);

      if (
        (scribbleByWord &&
          scribbleByWord[book] &&
          scribbleByWord[book].reduce((acc, range) => {
            const [begin, end] = range.split('-');
            const [beginVerse, beginIndex] = begin.split(':');
            const [endVerse, endIndex] = end.split(':');

            if (end === prevKey) {
              return acc || true;
            } else {
              return acc || false;
            }
          }, false)) ||
        (scribbleByWord &&
          scribbleByWord[book] &&
          scribbleByWord[book].reduce((acc, range) => {
            const [begin, end] = range.split('-');
            const [beginVerse, beginIndex] = begin.split(':');
            const [endVerse, endIndex] = end.split(':');

            if (begin === nextKey) {
              return acc || true;
            } else {
              return acc || false;
            }
          }, false))
      ) {
        const currentKey = verse + ':' + index;
        const newScribbleByWord = { ...scribbleByWord };
        mutateNewScribbleByWord(newScribbleByWord, currentKey, index);

        setScribble(newScribbleByWord);
      }
    }
  };

  const handleOnMouseDown = (word, index) => {
    handleHoldMouse(book, chapter, verse, index);

    const currentKey = verse + ':' + index;
    const newScribbleByWord = { ...scribbleByWord };
    mutateNewScribbleByWord(newScribbleByWord, currentKey, index);

    setScribble(newScribbleByWord);
  };

  const mutateNewScribbleByWord = (newScribbleByWord, currentKey, index) => {
    newScribbleByWord[book] = newScribbleByWord[book]
      ? newScribbleByWord[book].reduce(
          (acc, range) => {
            const [begin, end] = range.split('-');
            const [beginVerse, beginIndex] = begin.split(':');
            const [endVerse, endIndex] = end.split(':');

            if (
              parseInt(beginVerse) <= parseInt(verse) &&
              parseInt(verse) <= parseInt(endVerse) &&
              parseInt(beginIndex) <= index &&
              index <= parseInt(endIndex)
            ) {
              return [...acc, range];
            } else if (
              (parseInt(verse) === parseInt(endVerse) &&
                index === parseInt(endIndex) + 1) ||
              (parseInt(verse) === parseInt(endVerse) + 1 &&
                index === 0 &&
                parseInt(endIndex) ===
                  esv[book][chapter][endVerse].split(' ').length - 1)
            ) {
              return [...acc.slice(0, -1), begin + '-' + currentKey];
            } else if (
              parseInt(verse) < parseInt(beginVerse) ||
              (parseInt(verse) === parseInt(beginVerse) &&
                index < parseInt(endIndex))
            ) {
              return [...acc, currentKey + '-' + currentKey, range];
            }

            if (acc.length - 1 > -1) {
              const lastRange = acc[acc.length - 1];
              const [lastBegin, lastEnd] = lastRange.split('-');
              const [lastEndVerse, lastEndIndex] = lastEnd.split(':');

              if (
                (parseInt(lastEndVerse) === parseInt(beginVerse) &&
                  parseInt(lastEndIndex) === index - 1) ||
                (parseInt(lastEndVerse) === parseInt(beginVerse) - 1 &&
                  parseInt(beginIndex) === 0 &&
                  parseInt(lastEndIndex) ===
                    esv[book][chapter][lastEndVerse].split(' ').length - 1)
              ) {
                return [...acc.slice(0, -1), lastBegin + '-' + end];
              }
            }
          },
          [...newScribbleByWord[book]]
        )
      : [currentKey + '-' + currentKey];
  };

  const handleOnMouseUp = () => {
    handleReleaseMouse();
  };

  console.log(scribbleByWord[book]);

  return (
    <SpanWithPointer highlight={highlight} isClicked={isClicked}>
      <sup onClick={handleOnClick}>{verse}</sup>
      <span>
        {esv[book][chapter][verse].split(' ').map((word, index) => (
          <Word
            key={word + index}
            onMouseEnter={() => {
              handleOnMouseEnter(word, index);
            }}
            onMouseDown={() => {
              handleOnMouseDown(word, index);
            }}
            onMouseUp={handleOnMouseUp}
            onClick={() => handleWordClick(word)}
            isHighlighted={
              scribbleByWord &&
              scribbleByWord[book] &&
              scribbleByWord[book].reduce((acc, range) => {
                const [begin, end] = range.split('-');
                const [beginVerse, beginIndex] = begin.split(':');
                const [endVerse, endIndex] = end.split(':');

                if (
                  parseInt(beginVerse) <= parseInt(verse) &&
                  parseInt(verse) <= parseInt(endVerse) &&
                  parseInt(beginIndex) <= index &&
                  index <= parseInt(endIndex)
                ) {
                  return acc || true;
                } else {
                  return acc || false;
                }
              }, false)
            }
          >
            {word}{' '}
          </Word>
        ))}
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
