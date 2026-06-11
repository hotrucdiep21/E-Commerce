import { motion } from "framer-motion";
import { Trash2, Pencil } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useEffect, useState } from "react";

const UserManagementList = () => {
    const { fetchAllUsers, users, loading, updateUserRole, deleteUser } = useUserStore();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    if (loading) {
        return <div className="text-center text-gray-300 mt-10">Loading users...</div>;
    }

    const itemsPerPage = 5;
    const totalPages = Math.ceil((users?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users?.slice(startIndex, endIndex) || [];

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(userId);
        }
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead className='bg-gray-700'>
                        <tr>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                User
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Email
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Role
                            </th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-gray-800 divide-y divide-gray-700'>
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-300">No users found.</td>
                            </tr>
                        ) : (
                            currentUsers.map((user) => (
                                <tr key={user._id} className='hover:bg-gray-700'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold text-white">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        {user.email}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                                            className={`px-3 py-1 outline-none text-xs leading-5 font-semibold rounded-full ${user.role === "admin" ? "bg-emerald-100/10 text-emerald-500 border border-emerald-500" : "bg-gray-600 text-gray-300 border border-gray-500"}`}
                                        >
                                            <option value="admin" className="bg-emerald-900 text-emerald-400">Administrator</option>
                                            <option value="customer" className="bg-gray-800 text-gray-300">Customer</option>
                                        </select>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3 mt-2'>
                                        <button className='text-gray-400 hover:text-white transition-colors'>
                                            <Pencil className='h-4 w-4' />
                                        </button>
                                        <button onClick={() => handleDelete(user._id)} className='text-red-400 hover:text-red-300 transition-colors'>
                                            <Trash2 className='h-4 w-4' />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(endIndex, users?.length || 0)} of {users?.length || 0} users
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                        >
                            &lt;
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-2 py-1 rounded ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default UserManagementList;
