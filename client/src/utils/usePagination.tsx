// This custom hook returns a range to be used in the Pagination component

import { useMemo } from "react";

interface usePaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
}

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: usePaginationProps) => {
  const paginationRange = useMemo(() => {
    const range = (start: number, end: number) => {
      // this function returns an array of page nums
      const length = end - start + 1;
      const indexList = Array.from({ length }, (val, index) => index + start);
      return indexList;
    };

    // calculate the total number of pages
    const totalPageCount = Math.ceil(totalCount / pageSize);
    // calculate the maximum number of represented elements
    const elements = 2 * siblingCount + 5; // sibs plus current plus ellipses plus extremes

    if (elements >= totalPageCount) {
      // the actionable numbers all fit in our number of elements
      return range(1, totalPageCount);
    }

    // what are the indexes of the elements for the range of siblings
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    // should we show the ellipses?
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPageCount - 1;

    // send back different ranges based on showing ellipses
    if (!showLeftDots && showRightDots) {
      const leftItemCount = siblingCount + 2;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "…", totalPageCount];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = siblingCount + 2;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [1, "…", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);

      return [1, "…", ...middleRange, "…", totalPageCount];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};
