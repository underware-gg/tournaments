import { Button } from "@/components/ui/button";
import { WEDGE_LEFT, WEDGE_RIGHT } from "@/components/Icons";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: PaginationProps) => {
  const handleClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 6) {
      // If 6 or fewer pages, show all without padding
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show 6 elements for larger page counts
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-retro-green shrink-0"
          >
            {page}
          </span>
        );
      }

      return (
        <Button
          key={`page-${page}`}
          size={"xs"}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => handleClick(page as number)}
          className="justify-center shrink-0"
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <div
      className={`
      flex flex-row gap-1 justify-center items-center
      ${totalPages <= 6 ? "w-fit" : "w-[200px]"}
    `}
    >
      <Button
        size={"xs"}
        variant={"outline"}
        onClick={() => currentPage > 1 && handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="shrink-0"
      >
        <span className={`w-3 h-3`}>
          <WEDGE_LEFT />
        </span>
      </Button>

      <div className="flex flex-row gap-1 justify-center items-center">
        {renderPageNumbers()}
      </div>

      <Button
        size={"xs"}
        variant={"outline"}
        onClick={() => currentPage < totalPages && handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="shrink-0"
      >
        <span className={`w-3 h-3`}>
          <WEDGE_RIGHT />
        </span>
      </Button>
    </div>
  );
};

export default Pagination;
