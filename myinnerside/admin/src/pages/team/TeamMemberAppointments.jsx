import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaVideo, FaEye, FaEyeSlash, FaPhone, FaEnvelope, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';
import { useVideoCall } from '../../context/VideoCallContext';
import VideoCalls from './VideoCalls';
import { useNavigate } from "react-router-dom";
import { TeamContext } from '../../context/TeamContext';

const TeamMemberAppointments = () => {
    // State management
    const [state, setState] = useState({
        appointments: [],
        loading: true,
        currentPage: 1,
        totalPages: 1,
        totalAppointments: 0,
        refreshing: false,
        showDetails: {}
    });
    
    const { tToken } = useContext(TeamContext);
    const navigate = useNavigate();
    const [showCall, setShowCall] = useState(false);
    const { joinCall } = useVideoCall();
    const appointmentsPerPage = 10;

    // Derived state
    const { appointments, loading, currentPage, totalPages, totalAppointments, refreshing, showDetails } = state;

    // Handlers
    const handleNavigateToCall = (appointmentId) => {
        navigate(`/video-call/${appointmentId}`);
    };

    const handleJoinCall = (appointmentId) => {
        joinCall(appointmentId, tToken);
        setShowCall(true);
    };

    const toggleDetails = (appointmentId) => {
        setState(prev => ({
            ...prev,
            showDetails: {
                ...prev.showDetails,
                [appointmentId]: !prev.showDetails[appointmentId]
            }
        }));
    };

    const handleRefresh = () => {
        setState(prev => ({ ...prev, refreshing: true }));
        fetchAppointments();
    };

    const paginate = (pageNumber) => {
        setState(prev => ({ ...prev, currentPage: pageNumber }));
    };

    // Data fetching
    const fetchAppointments = async () => {
        try {
            const { data } = await axios.get('https://myinnerside.com/api/appointments/my-assigned', {
                params: { page: state.currentPage, limit: appointmentsPerPage },
                headers: { tToken }
            });

            setState(prev => ({
                ...prev,
                appointments: data.appointments,
                totalPages: data.totalPages,
                totalAppointments: data.totalAppointments,
                loading: false,
                refreshing: false
            }));
        } catch (error) {
            toast.error('Failed to fetch appointments. Please try again.');
            setState(prev => ({ ...prev, loading: false, refreshing: false }));
        }
    };

    // Effects
    useEffect(() => {
        fetchAppointments();
    }, [currentPage]);

    // Utility functions
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const renderPagination = () => {
        if (totalAppointments <= appointmentsPerPage) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
            const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
            
            if (currentPage <= maxPagesBeforeCurrent) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - maxPagesBeforeCurrent;
                endPage = currentPage + maxPagesAfterCurrent;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`px-3 py-1 rounded-md ${currentPage === i 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * appointmentsPerPage) + 1} to{' '}
                    {Math.min(currentPage * appointmentsPerPage, totalAppointments)} of {totalAppointments} appointments
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-100'}`}
                        aria-label="Previous page"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    {pages}
                    
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${currentPage === totalPages 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-100'}`}
                        aria-label="Next page"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">My Assigned Appointments</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage and join your scheduled appointments
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Refresh"
                        aria-label="Refresh appointments"
                    >
                        <svg 
                            className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Video Call Modal */}
                {showCall && <VideoCalls />}

                {/* Appointments Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Appointment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.length > 0 ? (
                                appointments.map((appointment) => (
                                    <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                                        {/* Patient Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                                                    <FaUser className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">
                                                        {appointment.hideIdentity && !showDetails[appointment._id] 
                                                            ? "Anonymous" 
                                                            : appointment.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.hideIdentity && !showDetails[appointment._id] 
                                                            ? "" 
                                                            : appointment.gender}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <FaEnvelope className="h-4 w-4 mr-2 text-gray-500" />
                                                {appointment.hideIdentity && !showDetails[appointment._id] 
                                                    ? "*****" 
                                                    : appointment.email}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-2">
                                                <FaPhone className="h-4 w-4 mr-2 text-gray-500" />
                                                {appointment.hideIdentity && !showDetails[appointment._id] 
                                                    ? "*****" 
                                                    : appointment.phone}
                                            </div>
                                        </td>

                                        {/* Appointment Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-500" />
                                                {formatDate(appointment.date)}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-2">
                                                <FaClock className="h-4 w-4 mr-2 text-gray-500" />
                                                {appointment.timeSlot}
                                            </div>
                                        </td>

                                        {/* Details Column */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                <span className="font-medium">Reason:</span> {appointment.bookingReason[0]}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <span className="font-medium">Language:</span> {appointment.language}
                                            </div>
                                            {showDetails[appointment._id] && (
                                                <>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        <span className="font-medium">Camera:</span> {appointment.cameraoption}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        <span className="font-medium">Thoughts:</span> {appointment.sarthithought}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        <span className="font-medium">Gender Pref:</span> {appointment.genderoption}
                                                    </div>
                                                </>
                                            )}
                                        </td>

                                        {/* Status Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${appointment.isrescheduled 
                                                    ? 'bg-amber-100 text-amber-800' 
                                                    : 'bg-green-100 text-green-800'}`}>
                                                {appointment.isrescheduled ? 'Rescheduled' : 'Confirmed'}
                                            </span>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleNavigateToCall(appointment._id)}
                                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                                >
                                                    <FaVideo className="h-3 w-3" />
                                                    Join Call
                                                </button>
                                                
                                                {appointment.hideIdentity && (
                                                    <button
                                                        onClick={() => toggleDetails(appointment._id)}
                                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                                                        title={showDetails[appointment._id] ? "Hide details" : "Show details"}
                                                        aria-label={showDetails[appointment._id] ? "Hide details" : "Show details"}
                                                    >
                                                        {showDetails[appointment._id] ? (
                                                            <FaEyeSlash className="h-4 w-4" />
                                                        ) : (
                                                            <FaEye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center">
                                        <div className="text-gray-500 flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-lg font-medium">No appointments found</p>
                                            <p className="text-sm mt-1">You currently have no assigned appointments</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {renderPagination()}
            </div>
        </div>
    );
};

export default TeamMemberAppointments;