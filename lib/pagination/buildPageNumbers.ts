export function buildPageNumbers(
  totalPages: number,
  activePage: number,
): (number | '…')[] {
  if (totalPages <= 1) {
    return [1];
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (activePage <= 3) {
    return [1, 2, 3, 4, '…', totalPages];
  }

  if (activePage >= totalPages - 2) {
    return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '…', activePage - 1, activePage, activePage + 1, '…', totalPages];
}
