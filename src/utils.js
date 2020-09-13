import { cannonDict } from './consts';

export const removeDuplicate = (item, index, array) =>
  array.indexOf(item) === index;

export const flatMapBibleObjectTree = (tree, func) =>
  Object.keys(tree)
    .sort((i, j) => cannonDict[i] - cannonDict[j])
    .reduce((accumulatedBooks, book) => {
      const bookTree = tree[book];
      return [
        ...accumulatedBooks,
        ...Object.keys(bookTree)
          .sort((i, j) => i - j)
          .reduce((acc2, chapter) => {
            const chapterTree = bookTree[chapter];
            return [
              ...acc2,
              ...chapterTree
                .sort((i, j) => i - j)
                .map(verse => func(book, chapter, verse)),
            ];
          }, []),
      ];
    }, []);
