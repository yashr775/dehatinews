/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";
import { Pencil, Trash2 } from "lucide-react";
import { IoIosAddCircle as Addition } from "react-icons/io";

import {
    useDeletePostMutation,
    useGetAllPostsForAdminLimitQuery,
} from "../redux/api/postApi";

import Loader from "../components/Loader.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Admin = () => {
    // Current page
    const [currentPage, setCurrentPage] = useState(1);

    // Number of posts requested from backend
    const limit = 10;

    // Fetch posts for current page
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetAllPostsForAdminLimitQuery({
        page: currentPage,
        limit: limit,
    });

    const [deletePost] = useDeletePostMutation();

    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user);

    // --------------------------------
    // Update post
    // --------------------------------

    const handleUpdate = (id) => {
        navigate(`/update/${id}`);
    };

    // --------------------------------
    // Delete post
    // --------------------------------

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmDelete) return;

        try {
            const res = await deletePost({
                postId: id,
                userId: user._id,
            });

            if (res.data?.success) {
                toast.success("Post deleted successfully");

                /*
                 * Since the backend is now responsible for pagination,
                 * we don't need setRows().
                 *
                 * RTK Query invalidates the "posts" tag after deletion
                 * and will refetch the current page.
                 */
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the post");
        }
    };

    // --------------------------------
    // Table columns
    // --------------------------------

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "_id",
            },

            {
                Header: "Title",
                accessor: "title",
            },

            {
                Header: "Created At",
                accessor: "createdAt",
            },

            {
                Header: "Updated At",
                accessor: "updatedAt",
            },

            {
                Header: "Action",
                accessor: "actions",

                Cell: ({ row }) => (
                    <div className="flex gap-2 justify-center">

                        {/* Edit */}
                        <button
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            onClick={() =>
                                handleUpdate(row.original._id)
                            }
                        >
                            <Pencil size={20} />
                        </button>

                        {/* Delete */}
                        <button
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            onClick={() =>
                                handleDelete(row.original._id)
                            }
                        >
                            <Trash2 size={20} />
                        </button>

                    </div>
                ),
            },
        ],
        []
    );

    // --------------------------------
    // Data for react-table
    // --------------------------------

    const tableData = useMemo(() => {
        return data?.posts || [];
    }, [data]);

    // --------------------------------
    // React Table
    // --------------------------------

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data: tableData,
        },
        useSortBy
    );

    // --------------------------------
    // Create post
    // --------------------------------

    const handleCreatePost = () => {
        navigate("/createPost");
    };

    // --------------------------------
    // Previous page
    // --------------------------------

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    // --------------------------------
    // Next page
    // --------------------------------

    const handleNextPage = () => {
        if (data?.hasMore) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    // --------------------------------
    // Jump directly to a page
    // --------------------------------

    const handlePageChange = (e) => {
        const page = Number(e.target.value);

        if (!page) {
            return;
        }

        if (page < 1) {
            setCurrentPage(1);
            return;
        }

        if (page > data?.totalPages) {
            setCurrentPage(data?.totalPages || 1);
            return;
        }

        setCurrentPage(page);
    };

    // --------------------------------
    // Error
    // --------------------------------

    if (isError) {
        toast.error("Some error occurred");
    }

    // --------------------------------
    // Initial loading
    // --------------------------------

    if (isLoading) {
        return <Loader />;
    }

    // --------------------------------
    // UI
    // --------------------------------

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-600 p-4">

            {/* Table container */}
            <div className="w-full max-w-6xl overflow-x-auto mt-24 rounded-b-xl">

                <table
                    {...getTableProps()}
                    className="table-auto w-full border border-gray-300 shadow-md rounded-lg bg-white"
                >

                    {/* Table Header */}
                    <thead className="bg-black text-white">

                        {headerGroups.map((hg) => (
                            <tr
                                key={hg.id}
                                {...hg.getHeaderGroupProps()}
                            >

                                {hg.headers.map((column) => (
                                    <th
                                        key={column.id}
                                        {...column.getHeaderProps(
                                            column.getSortByToggleProps()
                                        )}
                                        className="px-4 py-2 border border-gray-300 text-sm md:text-base text-center"
                                    >
                                        {column.render("Header")}

                                        {column.isSorted && (
                                            <span>
                                                {column.isSortedDesc
                                                    ? " ↓"
                                                    : " ↑"}
                                            </span>
                                        )}
                                    </th>
                                ))}

                            </tr>
                        ))}

                    </thead>

                    {/* Table Body */}
                    <tbody {...getTableBodyProps()}>

                        {rows.map((row) => {
                            prepareRow(row);

                            return (
                                <tr
                                    key={row.id}
                                    {...row.getRowProps()}
                                    className="hover:bg-gray-100"
                                >

                                    {row.cells.map((cell) => (
                                        <td
                                            key={cell.id}
                                            {...cell.getCellProps()}
                                            className="px-4 py-2 border border-gray-300 text-sm md:text-base text-center"
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    ))}

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>

            {/* Pagination */}
            <div className="flex items-center gap-4 mt-4">

                {/* Previous button */}
                <button
                    className="font-bold text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg disabled:opacity-50"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || isFetching}
                >
                    Prev
                </button>

                {/* Page selector */}
                <div className="flex items-center gap-2 text-white">

                    <span>
                        Page
                    </span>

                    <input
                        type="number"
                        min="1"
                        max={data?.totalPages || 1}
                        value={currentPage}
                        onChange={handlePageChange}
                        className="w-16 px-2 py-1 text-white rounded text-center bg-gray-800"
                    />

                    <span>
                        of {data?.totalPages || 1}
                    </span>

                </div>

                {/* Next button */}
                <button
                    className="font-bold text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg disabled:opacity-50"
                    onClick={handleNextPage}
                    disabled={!data?.hasMore || isFetching}
                >
                    Next
                </button>

                {/* Create post */}
                <div
                    className="cursor-pointer hover:bg-gray-500 rounded"
                    onClick={handleCreatePost}
                >
                    <Addition size={40} />
                </div>

            </div>

            {/* Loading indicator when changing page */}
            {isFetching && (
                <p className="text-white mt-2">
                    Loading...
                </p>
            )}

        </div>
    );
};

export default Admin;