import React from 'react';

import esv from './ESV.json';

import { Verse } from './Verse';
import { styled, Button } from '@material-ui/core';

const SvgWrapper = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  overflow: 'visible',
  pointerEvents: 'none',
});

const calculateRefs = (book, chapter, verses) =>
  verses.reduce(
    (chapterAcc, verse) => {
      const reducedVerse = esv[book][chapter][verse]
        .split('.')
        .join('')
        .split(' ')
        .reduce(
          (verseAcc, word) => {
            const { verseDict, verseArr } = verseAcc;
            const ref = React.createRef();

            return {
              verseDict: {
                ...verseDict,
                [word]: [...(verseDict[word] || []), ref],
              },
              verseArr: [...(verseArr || []), ref],
            };
          },
          { verseDict: {}, verseArr: [] }
        );

      const { chapterDict, chapterArr } = chapterAcc;
      const { verseDict, verseArr } = reducedVerse;

      const mergedDict = Object.keys(verseDict).reduce(
        (acc, word) => ({
          ...acc,
          [word]: [...(acc[word] || []), ...verseDict[word]],
        }),
        { ...chapterDict }
      );

      return {
        chapterDict: mergedDict,
        chapterArr: [...chapterArr, verseArr],
      };
    },
    { chapterDict: {}, chapterArr: [] }
  );

export const Passage = ({
  book,
  chapter,
  verses,
  highlightsByVerse,
  clickedVerseAddress,
  handleVerseClick,
}) => {
  const [svgs, setSvgs] = React.useState([]);
  const [refs, setRefs] = React.useState(calculateRefs(book, chapter, verses));

  React.useEffect(() => {
    setRefs(calculateRefs(book, chapter, verses));
  }, [verses]);

  const handleAnalyze = () => {
    const coordinates = refs.chapterDict['the'].map(ref => {
      const element = ref.current;
      const { offsetLeft, offsetTop } = element;

      return { x: offsetLeft, y: offsetTop };
    });

    const newSvgs = [];
    coordinates.forEach((coordinate, index) => {
      if (index < coordinates.length - 1) {
        const nextIndex = index + 1;
        const nextCoordinate = coordinates[nextIndex];

        const { x: x1, y: y1 } = coordinate;
        const { x: x2, y: y2 } = nextCoordinate;
        const length = x2 - x1;
        const unit = length / 4;

        newSvgs.push(
          <path
            key={x1 + x2 + y1 + y2}
            fill="none"
            stroke="red"
            d={`M${x1},${y1}
            C${x1 + unit},${y1 - 15}
            ${x2 - unit},${y1 - 15}
            ${x2},${y2}`}
          />
        );
      }
    });

    setSvgs(newSvgs);
  };

  return (
    <>
      <Button
        style={{ position: 'fixed', left: 0, top: 0 }}
        onClick={handleAnalyze}
      >
        Analyze
      </Button>

      {svgs.length > 0 && <SvgWrapper>{svgs}</SvgWrapper>}

      {verses.map((verse, index) => (
        <Verse
          key={`${book}${chapter}:${verse}`}
          book={book}
          chapter={chapter}
          verse={verse}
          highlight={
            highlightsByVerse[book] &&
            highlightsByVerse[book][chapter] &&
            highlightsByVerse[book][chapter].includes(verse)
          }
          isClicked={
            clickedVerseAddress.book === book &&
            clickedVerseAddress.chapter === chapter &&
            clickedVerseAddress.verse === verse
          }
          passedRefs={refs.chapterArr[index]}
          handleVerseClick={handleVerseClick}
        />
      ))}
    </>
  );
};
