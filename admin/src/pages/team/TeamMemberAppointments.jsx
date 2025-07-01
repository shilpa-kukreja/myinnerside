import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaVideo } from "react-icons/fa";
import { useVideoCall } from '../../context/VideoCallContext';
import VideoCalls from './VideoCalls';
import { useNavigate } from "react-router-dom";

import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    InformationCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { TeamContext } from '../../context/TeamContext';

const TeamMemberAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const { tToken } = useContext(TeamContext);
    const navigate = useNavigate();


    const handleNavigateapp = (appointmentId) =>
        {   
                navigate(`/video-call/${appointmentId}`);
        }

    const [showCall, setShowCall] = useState(false);
      const { joinCall, callStatus } = useVideoCall();
    
      const handleJoinCall = (appointmentId) => {
        joinCall(appointmentId, tToken);
        setShowCall(true);
      };

    useEffect(() => {
        fetchAppointments();
    }, [currentPage]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/appointments/my-assigned', {
                params: {
                    page: currentPage,
                    limit: appointmentsPerPage
                },
                headers: {
                    tToken
                }
            });
            setAppointments(data.appointments);
            setTotalPages(data.totalPages);
            setTotalAppointments(data.totalAppointments);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            toast.error('Failed to fetch your appointments');
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAppointments();
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My Assigned Appointments</h1>
                    <button
                        onClick={handleRefresh}
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Refresh"
                    >
                        <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                    {showCall && <VideoCalls />}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acept</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.length > 0 ? (
                                appointments.map((appointment) => (
                                    <tr key={appointment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <UserIcon className="h-5 w-5 text-blue-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">
                                                        {appointment.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{appointment.gender}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                {appointment.email}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                {appointment.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                {formatDate(appointment.date)}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                                                {appointment.timeSlot}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                <span className="font-medium">Reason:</span> {appointment.bookingReason}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <span className="font-medium">Language:</span> {appointment.language}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.isrescheduled ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {appointment.isrescheduled ? 'Rescheduled' : 'Confirmed'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className='video_call_btn' onClick={() => handleNavigateapp(appointment._id)} > <FaVideo /> Join Now </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        You have no assigned appointments
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalAppointments > appointmentsPerPage && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500">
                            Showing {((currentPage - 1) * appointmentsPerPage) + 1} to{' '}
                            {Math.min(currentPage * appointmentsPerPage, totalAppointments)} of {totalAppointments} appointments
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
        </div>
    );
};

export default TeamMemberAppointments;