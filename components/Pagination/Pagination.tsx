import css from "./Pagination.module.css";
import ReactPaginateModule from "react-paginate";
const ReactPaginate =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ReactPaginateModule as any).default || ReactPaginateModule;

interface PaginationProps {
  totalPages: number;
  page: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  totalPages,
  page,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={({ selected }: { selected: number }) =>
        onPageChange(selected + 1)
      }
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      breakLabel="..."
    />
  );
}
