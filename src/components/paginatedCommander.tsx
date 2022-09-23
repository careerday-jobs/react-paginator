import React, { Dispatch, SetStateAction } from 'react';
import PaginatedParam from '../types/paginatedParam';
import { useForm } from 'react-hook-form';

interface Props {
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

const PaginatedCommander: React.FC<Props> = ({
  paginated,
  selectablePageNums,
  dataFetchFunction,
  locale,
}) => {
  const textsGroup: PaginatedTextsGroup = getTextsGroup(locale);

  const getPreviousPageSplitStartPage = () =>
    Math.max(
      Math.floor(
        (paginated.pageNo - 1 - paginated.pageNumbersSplitSize) /
          paginated.pageNumbersSplitSize
      ) *
        paginated.pageNumbersSplitSize +
        paginated.pageNumbersSplitSize,
      0
    );

  const getNextPageSplitStartPage = () =>
    Math.min(
      Math.floor(
        (paginated.pageNo - 1 + paginated.pageNumbersSplitSize) /
          paginated.pageNumbersSplitSize
      ) *
        paginated.pageNumbersSplitSize +
        1,
      paginated.totalPageNo
    );

  const { setValue, register, handleSubmit } = useForm({
    defaultValues: { pageNo: paginated.pageNo },
  });

  return (
    <div className="paginated-commander">
      {paginated?.totalItemNo > 0 && (
        <div className="paginated-commander-body">
          <div className="header-total">
            <span className="mobile-total-items">{`${textsGroup.totalPrefix}: ${paginated.totalItemNo} ${textsGroup.totalPostfix}`}</span>
          </div>
          <div key={paginated.key} className="mobile-body">
            <div className="mobile-body-items">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (paginated.pageNo - 1 > 0) {
                    void dataFetchFunction(paginated.pageNo - 1);
                    setValue('pageNo', paginated.pageNo - 1);
                  }
                }}
                className="mobile-prev-button"
              >
                {getTextsGroup(locale).prev}
              </button>
              <form
                onSubmit={handleSubmit((value) => {
                  if (
                    value?.pageNo >= 1 &&
                    value?.pageNo <= paginated.totalPageNo
                  ) {
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
                  <div className="total-page-no">{`${paginated.totalPageNo}`}</div>
                </div>
              </form>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (paginated.pageNo + 1 <= paginated.totalPageNo) {
                    void dataFetchFunction(paginated.pageNo + 1);
                    setValue('pageNo', paginated.pageNo + 1);
                  }
                }}
                className="mobile-next-button"
              >
                {getTextsGroup(locale).next}
              </button>
            </div>
            <div className="desktop-body">
              <div />
              <div className="desktop-body-items">
                <div className="total-page-no">
                  {`${textsGroup.totalPrefix} ${paginated.totalItemNo} ${
                    textsGroup.totalPostfix
                  } / ${
                    paginated.pageSize * (paginated.pageNo - 1) + 1
                  } - ${Math.min(
                    paginated.pageSize * paginated.pageNo,
                    paginated.totalItemNo
                  )}`}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginated.pageNo - 1 > 0) {
                      void dataFetchFunction(getPreviousPageSplitStartPage());
                    }
                  }}
                  disabled={paginated.pageNo === 1}
                  className="prev-page-button"
                >
                  <span className="sr-only">이전</span>
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
                      if (paginated.pageNo - 1 > 0) {
                        void dataFetchFunction(getPreviousPageSplitStartPage());
                      }
                    }}
                    disabled={paginated.pageNo === 1}
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
                      pageElemNo === paginated.pageNo
                        ? 'page-number-button selected-page-button'
                        : 'page-number-button'
                    }
                  >
                    {pageElemNo}
                  </button>
                ))}
                {!selectablePageNums.includes(paginated.totalPageNo) && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (paginated.pageNo + 1 <= paginated.totalPageNo) {
                        void dataFetchFunction(getNextPageSplitStartPage());
                      }
                    }}
                    className="pages-hidden-button"
                  >
                    ...
                  </button>
                )}
                {!selectablePageNums.includes(paginated.totalPageNo) && (
                  <button
                    key={`page-${paginated.totalPageNo}`}
                    aria-current="page"
                    onClick={(e) => {
                      e.preventDefault();
                      return dataFetchFunction(paginated.totalPageNo);
                    }}
                    className="pages-hidden-button"
                  >
                    {paginated.totalPageNo}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginated.pageNo + 1 <= paginated.totalPageNo) {
                      void dataFetchFunction(getNextPageSplitStartPage());
                    }
                  }}
                  disabled={paginated.pageNo === paginated.totalPageNo}
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
export default PaginatedCommander;
