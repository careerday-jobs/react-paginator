import { useState, useCallback, SetStateAction, Dispatch } from 'react';
import PaginatedParam from '../types/paginatedParam';

function usePaginated(
  pageSize: number,
  selectablePageNumRange: number
): [
  PaginatedParam,
  Dispatch<SetStateAction<PaginatedParam>>,
  (newPaginated: PaginatedParam) => void,
  number[]
] {
  const [paginated, setPaginated] = useState(
    new PaginatedParam(1, pageSize, 0, selectablePageNumRange)
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

  const drawPaginated = useCallback((newPaginated: PaginatedParam) => {
    const totalPageNo = Math.ceil(
      newPaginated.totalItemCount / newPaginated.pageSize
    );

    setPaginated(newPaginated);
    setSelectablePageNums(
      createPages(
        newPaginated.pageNo,
        totalPageNo,
        newPaginated.pageNumbersSplitSize
      )
    );
  }, []);

  return [paginated, setPaginated, drawPaginated, selectablePageNums];
}

export default usePaginated;
