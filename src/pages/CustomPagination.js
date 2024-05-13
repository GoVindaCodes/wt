// import React from "react";
// import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

// const CustomPagination = ({ currentPage, totalResults, resultsPerPage, onChange, label }) => {
//     // Calculate the start and end counts of displayed items
//     const startCount = (currentPage - 1) * resultsPerPage + 1;
//     const endCount = Math.min(currentPage * resultsPerPage, totalResults);

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(totalResults / resultsPerPage);

//     // Disable "Next" button if currentPage is already on the last page
//     const isLastPage = currentPage === totalPages;

//     // Disable "Previous" button if currentPage is the first page
//     const isFirstPage = currentPage <= 1;

//     return (
//         <div className="flex items-center justify-between">
//             <div className="text-xs font-medium text-gray-800">{`Showing ${startCount}-${endCount} of ${totalResults}`}</div>
//             <div className="flex items-center space-x-1">
//                 {/* Previous button */}
//                 <button
//                     className={`p-0.5 rounded-full border border-gray-300 bg-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${isFirstPage && 'cursor-not-allowed'}`}
//                     onClick={() => !isFirstPage && onChange(currentPage - 1)}
//                     disabled={isFirstPage}
//                 >
//                     <HiOutlineChevronLeft className="w-2 h-2" />
//                 </button>
//                 {/* Page numbers */}
//                 {Array.from({ length: totalPages }, (_, i) => (
//                     <button
//                         key={i}
//                         className={`p-1 rounded-1 ml-1 mr-1 border-gray-300 hover:text-gray-800  ${currentPage === i + 1 ? 'bg-green-600 text-white' : 'hover:bg-gray-200'}`}
//                         onClick={() => onChange(i + 1)}
//                     >
//                         {i + 1}
//                     </button>
//                 ))}
//                 {/* Next button */}
//                 <button
//                     className={`p-1 rounded-full  ml-1 mr-1 text-gray-600 hover:text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${isLastPage && 'cursor-not-allowed'}`}
//                     onClick={() => !isLastPage && onChange(currentPage + 1)}
//                     disabled={isLastPage}
//                 >
//                     <HiOutlineChevronRight className="w-2 h-2" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default CustomPagination;


// import React from "react";
// import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

// const CustomPagination = ({ currentPage, totalResults, resultsPerPage, onChange, label }) => {
//     // Calculate the start and end counts of displayed items
//     const startCount = (currentPage - 1) * resultsPerPage + 1;
//     const endCount = Math.min(currentPage * resultsPerPage, totalResults);

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(totalResults / resultsPerPage);

//     // Disable "Next" button if currentPage is already on the last page
//     const isLastPage = currentPage === totalPages;

//     // Disable "Previous" button if currentPage is the first page
//     const isFirstPage = currentPage <= 1;

//     return (
//         <div className="flex items-center justify-between">
//             <div className="text-xs font-small text-gray-800">{`Showing ${startCount}-${endCount} of ${totalResults}`}</div>
//             <div className="flex items-center space-x-1">
//                 {/* Previous button */}
//                 <button
//                     className={`p-0.5 rounded-full border border-transparent bg-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ml-1 ${isFirstPage && 'cursor-not-allowed'}`}
//                     onClick={() => !isFirstPage && onChange(currentPage - 1)}
//                     disabled={isFirstPage}
//                 >
//                     <HiOutlineChevronLeft className="w-2 h-2" />
//                 </button>
//                 {/* Page numbers */}
//                 {Array.from({ length: totalPages }, (_, i) => (
//                     <button
//                         key={i}
//                         className={`relative inline-flex items-center px-2 py-1 rounded bg-white text-sm font-medium focus:z-10 ${currentPage === i + 1 ? 'bg-green-500 text-white' : 'hover:bg-gray-50'}`}
//                         onClick={() => onChange(i + 1)}
//                     >
//                         {i + 1}
//                     </button>
//                 ))}
//                 {/* Next button */}
//                 <button
//                     className={`p-0.5 rounded-full border border-transparent bg-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed mr-1 ${isLastPage && 'cursor-not-allowed'}`}
//                     onClick={() => !isLastPage && onChange(currentPage + 1)}
//                     disabled={isLastPage}
//                 >
//                     <HiOutlineChevronRight className="w-2 h-2" />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default CustomPagination;


import React from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const CustomPagination = ({ currentPage, totalResults, resultsPerPage, onChange, label }) => {
    const startCount = (currentPage - 1) * resultsPerPage + 1;
    const endCount = Math.min(currentPage * resultsPerPage, totalResults);
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const isLastPage = currentPage === totalPages;
    const isFirstPage = currentPage <= 1;

    return (
        <div className="flex items-center justify-between">
            <div className="text-xs font-small text-gray-800 dark:text-gray-300">{`Showing ${startCount}-${endCount} of ${totalResults}`}</div>
            <div className="flex items-center space-x-1">
                <button
                    className={`p-0.5 rounded-full border border-transparent bg-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ml-1 ${isFirstPage && 'cursor-not-allowed'}`}
                    onClick={() => !isFirstPage && onChange(currentPage - 1)}
                    disabled={isFirstPage}
                >
                    <HiOutlineChevronLeft className="w-2 h-2" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`relative inline-flex items-center px-2 py-1 rounded text-sm font-medium focus:z-10 ${currentPage === i + 1 ? 'bg-green-500 text-white' : 'text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-400'}`}
                        onClick={() => onChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className={`p-0.5 rounded-full border border-transparent bg-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed mr-1 ${isLastPage && 'cursor-not-allowed'}`}
                    onClick={() => !isLastPage && onChange(currentPage + 1)}
                    disabled={isLastPage}
                >
                    <HiOutlineChevronRight className="w-2 h-2" />
                </button>
            </div>
        </div>
    );
};

export default CustomPagination;


