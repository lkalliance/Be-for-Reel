import "./Pagination.css";

import { usePagination } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface paginationProps {
  navHandler: (e: React.MouseEvent<HTMLLIElement>) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
}

export function Pagination({
  navHandler,
  totalCount,
  siblingCount,
  currentPage,
  pageSize,
}: paginationProps) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const lastPage = paginationRange
    ? paginationRange[paginationRange.length - 1]
    : 1;

  return currentPage === 0 ||
    !paginationRange ||
    paginationRange.length < 2 ? null : (
    <div className="pagination">
      <ul>
        <li
          className={currentPage === 1 ? "pointer disabled" : "pointer"}
          id={`arrow-${currentPage > 1 ? currentPage - 1 : 1}`}
          onClick={navHandler}
        >
          <div>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
        </li>
        {paginationRange.map((pageNum, index) => {
          return pageNum === "…" ? (
            <li key={index} className="ellipsis">
              <div>…</div>
            </li>
          ) : (
            <li
              key={index}
              className={pageNum === currentPage ? "selected" : ""}
              id={`page-${pageNum}`}
              onClick={navHandler}
            >
              <div>{pageNum}</div>
            </li>
          );
        })}
        <li
          className={currentPage === lastPage ? "pointer disabled" : "pointer"}
          id={`arrow-${currentPage === lastPage ? lastPage : currentPage + 1}`}
          onClick={navHandler}
        >
          <div>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </li>
      </ul>
    </div>
  );
}
