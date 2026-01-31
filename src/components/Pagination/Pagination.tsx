import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
    pageCount: number;
    page: number; // 1-based
    onPageChange: (page: number) => void; // 1-based
}

export default function Pagination({
    pageCount,
    page,
    onPageChange,
}: PaginationProps) {
    return (
        <ReactPaginate
            containerClassName={css.pagination}
            activeClassName={css.active}
            pageCount={pageCount}
            forcePage={page - 1}
            onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
        />
    );
}
