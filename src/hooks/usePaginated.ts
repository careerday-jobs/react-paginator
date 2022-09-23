import { useState, useCallback, SetStateAction, Dispatch } from 'react';
import PaginatedParam from '../types/paginatedParam';

function usePaginated(
  pageSize?: number,
  pageNumberSplitSize?: number
): [
  PaginatedParam,
  Dispatch<SetStateAction<PaginatedParam>>,
  (newPaginated: PaginatedParam) => void,
  number[]
] {
  const [paginated, setPaginated] = useState(
    new PaginatedParam(
      undefined,
      pageSize,
      undefined,
      undefined,
      pageNumberSplitSize
    )
  );
  const [selectablePageNums, setSelectablePageNums] = useState([1]);

  const createPages = (
    pageNo: number,
    totalPageNo: number,
    pageNumberSplitSizeParam: number
  ): number[] => {
    const pages = [];
    const minPage =
      Math.trunc((pageNo - 1) / pageNumberSplitSizeParam) *
        pageNumberSplitSizeParam +
      1;
    const maxPage =
      Math.trunc((pageNo - 1) / pageNumberSplitSizeParam) *
        pageNumberSplitSizeParam +
      pageNumberSplitSizeParam;
    for (let i = minPage; i <= maxPage; i++) {
      if (i > 0 && i <= totalPageNo) {
        pages.push(i);
      }
    }
    return pages;
  };

  const redrawPaginated = useCallback((newPaginated: PaginatedParam) => {
    setPaginated(newPaginated);
    setSelectablePageNums(
      createPages(
        newPaginated.pageNo,
        newPaginated.totalPageNo,
        newPaginated.pageNumbersSplitSize
      )
    );
  }, []);

  return [paginated, setPaginated, redrawPaginated, selectablePageNums];
}

export default usePaginated;
