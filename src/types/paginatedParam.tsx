import { v4 as uuidv4 } from 'uuid';

export default class PaginatedParam {
  constructor(
    pageNo?: number,
    pageSize?: number,
    totalPageNo?: number,
    totalItemNo?: number,
    pageNumberSplitSize?: number
  ) {
    this.key = uuidv4();
    this.pageNo = !!pageNo ? pageNo : 1;
    this.pageSize = !!pageSize ? pageSize : 1;
    this.totalPageNo = !!totalPageNo ? totalPageNo : 0;
    this.totalItemNo = !!totalItemNo ? totalItemNo : 0;
    this.pageNumbersSplitSize = !!pageNumberSplitSize ? pageNumberSplitSize : 5;
  }

  key: string;
  pageNo: number;
  pageSize: number;
  totalPageNo: number;
  totalItemNo: number;
  pageNumbersSplitSize: number;
}
