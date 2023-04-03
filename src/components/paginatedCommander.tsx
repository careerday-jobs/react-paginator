import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { PaginatedParam } from '../types';

export interface Props {
  /** 'paginated' from usePaginated() call */
  paginated: PaginatedParam;
  /** 'setPaginated' from usePaginated() call */
  setPaginated: Dispatch<SetStateAction<PaginatedParam>>;
  /** 'selectablePageNums' from usePaginated() call */
  selectablePageNums: number[];
  /** The function you use when you try to fetch data. (e. g. calling an API) */
  dataFetchFunction: (pageNo: number) => Promise<void>;
  /** Your language. For now only 'en' and 'ko' are supported. */
  locale?: string;
  /** Pagination UI. Default pagination if not set to 'true' */
  isMobile?: boolean;
}

interface PaginatedTextsGroup {
  prev: string;
  next: string;
  totalPrefix: string;
  totalPostfix: string;
}

const getTextsGroup = (localStr?: string) => {
  switch (localStr) {
    case 'ko':
      return {
        prev: '이전',
        next: '다음',
        totalPrefix: '총',
        totalPostfix: '개',
      };
    default:
      return {
        prev: 'Prev',
        next: 'Next',
        totalPrefix: 'Total',
        totalPostfix: '',
      };
  }
};

export const PaginatedCommander: React.FC<Props> = ({
  paginated,
  selectablePageNums,
  dataFetchFunction,
  locale,
  isMobile = false,
}) => {
  const textsGroup: PaginatedTextsGroup = getTextsGroup(locale);
  const totalPageNo = Math.ceil(paginated.totalItemCount / paginated.pageSize);
  const pageNo = Math.max(1, Math.min(paginated.pageNo, totalPageNo));

  const getPreviousPageSplitStartPage = () =>
    Math.max(
      Math.floor(
        (pageNo - 1 - paginated.pageNumbersSplitSize) /
          paginated.pageNumbersSplitSize
      ) *
        paginated.pageNumbersSplitSize +
        paginated.pageNumbersSplitSize,
      0
    );

  const getNextPageSplitStartPage = () =>
    Math.min(
      Math.floor(
        (pageNo - 1 + paginated.pageNumbersSplitSize) /
          paginated.pageNumbersSplitSize
      ) *
        paginated.pageNumbersSplitSize +
        1,
      totalPageNo
    );

  const { setValue, register, handleSubmit } = useForm({
    defaultValues: { pageNo: pageNo },
  });

  return (
    <div className="paginated-commander">
      {isMobile && paginated?.totalItemCount > 0 && (
        <div className="paginated-commander-body">
          <div className="header-total">
            <span className="mobile-total-items">{`${textsGroup.totalPrefix}: ${paginated.totalItemCount} ${textsGroup.totalPostfix}`}</span>
          </div>
          <div key={paginated.key} className="mobile-body">
            {/* mobile */}
            <div className="mobile-body-items">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNo - 1 > 0) {
                    void dataFetchFunction(pageNo - 1);
                    setValue('pageNo', pageNo - 1);
                  }
                }}
                className="mobile-prev-button"
              >
                {getTextsGroup(locale).prev}
              </button>
              <form
                onSubmit={handleSubmit((value) => {
                  if (value?.pageNo >= 1 && value?.pageNo <= totalPageNo) {
                    void dataFetchFunction(value.pageNo);
                  }
                })}
              >
                <div className="mobile-input-form-body">
                  <input
                    {...register('pageNo')}
                    name="pageNo"
                    id="pageNo"
                    className="input"
                    autoComplete="off"
                  ></input>
                  <div className="slash">{`/`}</div>
                  <div className="total-page-no">{`${totalPageNo}`}</div>
                </div>
              </form>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNo + 1 <= totalPageNo) {
                    void dataFetchFunction(pageNo + 1);
                    setValue('pageNo', pageNo + 1);
                  }
                }}
                className="mobile-next-button"
              >
                {getTextsGroup(locale).next}
              </button>
            </div>
          </div>
        </div>
      )}
      {!isMobile && paginated?.totalItemCount > 0 && (
        <div className="paginated-commander-body">
          <div className="header-total">
            <span className="mobile-total-items">{`${textsGroup.totalPrefix}: ${paginated.totalItemCount} ${textsGroup.totalPostfix}`}</span>
          </div>
          <div key={paginated.key} className="mobile-body">
            {/* pc */}
            <div className="desktop-body">
              <div />
              <div className="desktop-body-items">
                <div className="total-page-no">
                  {`${textsGroup.totalPrefix} ${paginated.totalItemCount} ${
                    textsGroup.totalPostfix
                  } / ${paginated.pageSize * (pageNo - 1) + 1} - ${Math.min(
                    paginated.pageSize * pageNo,
                    paginated.totalItemCount
                  )}`}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageNo - 1 > 0) {
                      void dataFetchFunction(getPreviousPageSplitStartPage());
                    }
                  }}
                  disabled={pageNo === 1}
                  className="prev-page-button"
                >
                  <span className="sr-only">Prev Page</span>
                  {'<'}
                </button>
                {!selectablePageNums.includes(1) && (
                  <button
                    key={`page-1`}
                    aria-current="page"
                    onClick={(e) => {
                      e.preventDefault();
                      return dataFetchFunction(1);
                    }}
                    className="page-number-button"
                  >
                    1
                  </button>
                )}
                {!selectablePageNums.includes(1) && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageNo - 1 > 0) {
                        void dataFetchFunction(getPreviousPageSplitStartPage());
                      }
                    }}
                    disabled={pageNo === 1}
                    className="pages-hidden-button"
                  >
                    ...
                  </button>
                )}
                {selectablePageNums.map((pageElemNo) => (
                  <button
                    key={`page-${pageElemNo}`}
                    aria-current="page"
                    onClick={(e) => {
                      e.preventDefault();
                      return dataFetchFunction(pageElemNo);
                    }}
                    className={
                      pageElemNo === pageNo
                        ? 'page-number-button selected-page-button'
                        : 'page-number-button'
                    }
                  >
                    {pageElemNo}
                  </button>
                ))}
                {!selectablePageNums.includes(totalPageNo) && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageNo + 1 <= totalPageNo) {
                        void dataFetchFunction(getNextPageSplitStartPage());
                      }
                    }}
                    className="pages-hidden-button"
                  >
                    ...
                  </button>
                )}
                {!selectablePageNums.includes(totalPageNo) && (
                  <button
                    key={`page-${totalPageNo}`}
                    aria-current="page"
                    onClick={(e) => {
                      e.preventDefault();
                      return dataFetchFunction(totalPageNo);
                    }}
                    className="pages-hidden-button"
                  >
                    {totalPageNo}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageNo + 1 <= totalPageNo) {
                      void dataFetchFunction(getNextPageSplitStartPage());
                    }
                  }}
                  disabled={pageNo === totalPageNo}
                  className="next-page-button"
                >
                  <span className="sr-only">Next Page</span>
                  {'>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
