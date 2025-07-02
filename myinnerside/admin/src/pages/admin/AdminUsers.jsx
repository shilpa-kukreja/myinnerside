import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    MagnifyingGlassIcon,
    TrashIcon,
    EyeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CakeIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://myinnerside.com/api/auth/all`, {
                params: {
                    page: currentPage,
                    limit: usersPerPage,
                    search: searchTerm
                }
            });
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalUsers(data.totalUsers);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`https://myinnerside.com/api/auth/${id}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const openUserModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        <UserIcon className="h-6 w-6 mr-2 text-blue-500" />
                        User Management
                    </h1>

                    <div className="relative mt-4 md:mt-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    {user.img ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full"
                                                            src={`https://myinnerside.com${user.img}`}
                                                            alt={user.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <UserIcon className="h-5 w-5 text-blue-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.aliasName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                {user.email}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                {user.contact}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <CakeIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                <span className="font-medium">DOB:</span>
                                                <span className="ml-1">{formatDate(user.dob)}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 capitalize">
                                                <span className="font-medium">Gender:</span> {user.gender}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openUserModal(user)}
                                                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        {searchTerm ? 'No matching users found' : 'No users registered yet'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalUsers > usersPerPage && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500">
                            Showing {((currentPage - 1) * usersPerPage) + 1} to{' '}
                            {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => paginate(pageNum)}
                                        className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-[100%] max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 flex flex-col items-center">
                                    {selectedUser.img ? (
                                        <img
                                            src={`https://myinnerside.com${selectedUser.img}`}
                                            alt={selectedUser.name}
                                            className="h-32 w-32 rounded-full object-cover mb-4"
                                        />
                                    ) : (
                                        <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                            <UserIcon className="h-16 w-16 text-blue-500" />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-gray-500">{selectedUser.aliasName}</p>
                                </div>

                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                                                        <span className="font-medium">Email:</span>
                                                        <span className="ml-2">{selectedUser.email}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                                                        <span className="font-medium">Phone:</span>
                                                        <span className="ml-2">{selectedUser.contact}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <CakeIcon className="h-5 w-5 text-gray-500 mr-2" />
                                                        <span className="font-medium">Date of Birth:</span>
                                                        <span className="ml-2">{formatDate(selectedUser.dob)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="font-medium">Gender:</span>
                                                        <span className="ml-2 capitalize">{selectedUser.gender}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                                                <span className="font-medium">Registered On:</span>
                                                <span className="ml-2">
                                                    {new Date(selectedUser.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;