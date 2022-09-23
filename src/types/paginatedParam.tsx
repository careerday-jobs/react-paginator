import { v4 as uuidv4 } from 'uuid';

export default class PaginatedParam {
  constructor(
    pageNo: number,
    pageSize: number,
    totalItemCount: number,
    pageNumberSplitSize: number
  ) {
    this.key = uuidv4();
    this.pageNo = !!pageNo ? pageNo : 1;
    this.pageSize = !!pageSize ? pageSize : 1;
    this.totalItemCount = !!totalItemCount ? totalItemCount : 0;
    this.pageNumbersSplitSize = !!pageNumberSplitSize ? pageNumberSplitSize : 5;
  }

  key: string;
  pageNo: number;
  pageSize: number;
  totalItemCount: number;
  pageNumbersSplitSize: number;
}
