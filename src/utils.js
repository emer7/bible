export const removeDuplicate = (item, index, array) =>
  array.indexOf(item) === index;

export const flatMapBibleObjectTree = (tree, func) =>
  Object.keys(tree).reduce((accumulatedBooks, book) => {
    const bookTree = tree[book];
    return [
      ...accumulatedBooks,
      ...Object.keys(bookTree).reduce((acc2, chapter) => {
        const chapterTree = bookTree[chapter];
        return [
          ...acc2,
          ...chapterTree.map(verse => func(book, chapter, verse)),
        ];
      }, []),
    ];
  }, []);
