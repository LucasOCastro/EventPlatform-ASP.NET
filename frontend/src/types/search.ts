export type SearchFilter = {
  text: string;
  host: string;
  dateMin: Date;
  dateMax: Date;
};

export type SortFieldName = "name" | "date" | "distance";
export type SortOrder = "asc" | "desc";
export type SortField = {
  field: SortFieldName;
  order: SortOrder;
};
export type SearchSort = SortField[];

export type SearchOptions = {
  filter: SearchFilter;
  sort: SearchSort;
  limit: number;
  offset: number;
};
