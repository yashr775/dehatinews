/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Pencil, Trash2 } from "lucide-react";
import { IoIosAddCircle as Addition } from "react-icons/io";
import {
    useDeletePostMutation,
    useGetAllPostsForAdminQuery,
} from "../redux/api/postApi";
import Loader from "../components/Loader.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Admin = () => {
    const { data, isLoading, isError } = useGetAllPostsForAdminQuery();
    const [deletePost] = useDeletePostMutation();
    const [rows, setRows] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const handleUpdate = (id) => {
        navigate(`/update/${id}`);
    };

    const memoizedData = useMemo(() => rows, [rows]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        gotoPage,
        pageCount,
        state,
    } = useTable(
        {
            columns: useMemo(
                () => [
                    { Header: "ID", accessor: "_id" },
                    { Header: "Title", accessor: "title" },
                    { Header: "Created At", accessor: "createdAt" },
                    { Header: "Updated At", accessor: "updatedAt" },
                    {
                        Header: "Action",
                        accessor: "actions",
                        Cell: ({ row }) => (
                            <div className="flex gap-2 justify-center">
                                <button
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                                    onClick={() => handleUpdate(row.original._id)}
                                >
                                    <Pencil size={20} />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => handleDelete(row.original._id)}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ),
                    },
                ],
                []
            ),
            data: memoizedData,
            initialState: { pageIndex },
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        setPageIndex(state.pageIndex);
    }, [state.pageIndex]);

    useEffect(() => {
        if (data && JSON.stringify(data.posts) !== JSON.stringify(rows)) {
            setRows(data.posts);
        }
    }, [data]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
            const res = await deletePost({ postId: id, userId: user._id });
            if (res.data?.success) {
                toast.success("Post deleted successfully");
                setRows((prevRows) => {
                    const updatedRows = prevRows.filter((row) => row._id !== id);
                    const totalPages = Math.ceil(updatedRows.length / 10);
                    if (pageIndex >= totalPages && totalPages > 0) {
                        gotoPage(totalPages - 1);
                    }
                    return updatedRows;
                });
            } else {
                toast.error("Failed to delete post");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the post");
        }
    };

    const handleCreatePost = () => {
        navigate("/createPost");
    };

    if (isError) toast.error("Some error occurred");

    return isLoading ? (
        <Loader />
    ) : (
        <div className="flex flex-col items-center h-screen bg-gray-600 p-4">
            <div className="w-full max-w-6xl overflow-x-auto mt-24 rounded-b-xl">
                <table
                    {...getTableProps()}
                    className="table-auto w-full border border-gray-300 shadow-md rounded-lg bg-white"
                >
                    <thead className="bg-black text-white">
                        {headerGroups.map((hg) => (
                            <tr key={hg.id} {...hg.getHeaderGroupProps()}>
                                {hg.headers.map((column) => (
                                    <th
                                        key={column.id}
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="px-4 py-2 border border-gray-300 text-sm md:text-base text-center"
                                    >
                                        {column.render("Header")}
                                        {column.isSorted && (
                                            <span>{column.isSortedDesc ? " ↓" : " ↑"}</span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
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

            <div className="flex items-center gap-4 mt-4">
                <button
                    className="font-bold text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg disabled:opacity-50"
                    onClick={previousPage}
                    disabled={!canPreviousPage}
                >
                    Prev
                </button>
                <span className="text-sm md:text-base text-white">
                    Page {pageIndex + 1} of {pageCount}
                </span>
                <button
                    className="font-bold text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-lg disabled:opacity-50"
                    onClick={nextPage}
                    disabled={!canNextPage}
                >
                    Next
                </button>
                <div
                    className="cursor-pointer hover:bg-gray-500"
                    onClick={handleCreatePost}
                >
                    <Addition size={40} />
                </div>
            </div>
        </div>
    );
};

export default Admin;
