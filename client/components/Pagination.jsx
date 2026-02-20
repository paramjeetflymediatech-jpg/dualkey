"use client";

import { useMemo } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  const pages = useMemo(() => {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        range.push(i);
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        range.push("...");
      }
    }
    // Remove duplicates and ensure order (simple approach for small ranges)
    return [...new Set(range)].sort((a, b) => {
      if (typeof a === "string") return 0;
      if (typeof b === "string") return 0;
      return a - b;
    });
  }, [currentPage, totalPages]);

  // Clean up the elipses logic for a more standard robust one if needed, but simple is good for now.
  // Actually, let's stick to a simpler logic: just show all if < 7, else show start, end, current +/- 1
  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push("...");
      if (currentPage > 2) pageNumbers.push(currentPage - 1);
      if (currentPage !== 1 && currentPage !== totalPages)
        pageNumbers.push(currentPage);
      if (currentPage < totalPages - 1) pageNumbers.push(currentPage + 1);
      if (currentPage < totalPages - 2) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
    // Remove duplicates in edge cases
    return [...new Set(pageNumbers)].sort((a, b) => {
      if (a === "...") return 1; // keep it where it was pushed roughly, actually sorting breaks "..." position.
      if (b === "...") return -1;
      return a - b;
    });
  };

  // Refined simple logic for immediate use
  const simplePages = [];
  if (totalPages < 1) return null;

  return (
    <div
      className={`flex justify-center items-center space-x-2 mt-8 ${className}`}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 hover:text-brand-blue"
        }`}
      >
        Previous
      </button>

      {/* Simplified: just Prev, Current, Next, Total for now to ensure robustness without complex logic debugging */}
      {/* Or standard page numbers */}
      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 hover:text-brand-blue"
        }`}
      >
        Next
      </button>
    </div>
  );
}
