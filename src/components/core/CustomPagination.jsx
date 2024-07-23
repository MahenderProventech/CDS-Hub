import React from 'react';

const CustomPagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate page numbers to display
    const pageNumbers = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (totalPages <= maxVisiblePages) {
        // Less than or equal to the maximum visible pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // Adjust startPage and endPage if at the beginning or end of pagination
        const pagesBeforeCurrent = currentPage - 1;
        const pagesAfterCurrent = totalPages - currentPage;

        if (pagesBeforeCurrent < Math.floor(maxVisiblePages / 2)) {
            // At the beginning of pagination
            endPage = Math.min(totalPages, maxVisiblePages);
        } else if (pagesAfterCurrent < Math.ceil(maxVisiblePages / 2)) {
            // At the end of pagination
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination" style={{
                display: 'flex',
                'justifyContent': 'end'
            }}>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        onClick={() => paginate(1)}
                        className="page-link"
                        disabled={currentPage === 1}
                    >
                        First
                    </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        className="page-link"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className="page-link"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        onClick={() => paginate(totalPages)}
                        className="page-link"
                        disabled={currentPage === totalPages}
                    >
                        Last
                    </button>
                </li>
            </ul>
            {/* <div className="record-info">
                Showing {startRecord}-{endRecord} of {data.length} records
            </div> */}
        </nav >
    );
};

export default CustomPagination;
