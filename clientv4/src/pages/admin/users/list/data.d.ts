export interface TableListItem {
  _id: string;
  username: string;
  password: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  pageSize?: number;
  currentPage?: number;
}

export interface CreateParams {
  username: string;
  password: string;
}
