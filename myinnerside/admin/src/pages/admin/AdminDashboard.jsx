import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Chip,
    Divider
} from '@mui/material';
import {
    People as PeopleIcon,
    Groups as TeamsIcon,
    Event as AppointmentsIcon,
    CalendarToday as CalendarIcon,
    AccessTime as SlotsIcon
} from '@mui/icons-material';
import { PieChart, BarChart } from '@mui/x-charts';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { format } from 'date-fns';
import { AdminContext } from '../../context/AdminContext';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { aToken } = useContext(AdminContext);
    const theme = useTheme();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('https://myinnerside.com/api/admin/dashboard', {
                    headers: { aToken }
                });
                setDashboardData(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    if (!dashboardData) return null;

    const { metrics, recentUsers, recentAppointments } = dashboardData;

    const appointmentStatusData = [
        { label: 'Appointments', value: metrics.activeAppointments },
        { label: 'LifeCoach', value: metrics.pendingAppointments },
    ];

    const userDistributionData = [
        { label: 'Users', value: metrics.totalUsers },
        { label: 'Teams', value: metrics.totalTeams },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Admin Dashboard
            </Typography>

            {/* Metric Cards */}
            <Grid container spacing={10} mb={4}>
                <DashboardCard icon={<PeopleIcon />} title="Total Users" value={metrics.totalUsers} color={theme.palette.primary.main} />
                <DashboardCard icon={<TeamsIcon />} title="Total Teams" value={metrics.totalTeams} color={theme.palette.success.main} />
                <DashboardCard icon={<AppointmentsIcon />} title="Appointments" value={metrics.activeAppointments} color={theme.palette.warning.main} />
                <DashboardCard icon={<CalendarIcon />} title="LifeCoach Appointments" value={metrics.pendingAppointments} color={theme.palette.error.main} />
                <DashboardCard icon={<SlotsIcon />} title="Upcoming Sessions" value={metrics.upcomingSessions} color={theme.palette.info.main} />
            </Grid>

            {/* Charts */}
            <Grid container spacing={10} mb={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Appointment Status</Typography>
                        <PieChart
                            series={[{
                                data: appointmentStatusData,
                                innerRadius: 60,
                                outerRadius: 100,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                cx: 150,
                                cy: 120,
                            }]}
                            width={350}
                            height={250}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>User Distribution</Typography>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: ['Users', 'Teams'] }]}
                            series={[{ data: [metrics.totalUsers, metrics.totalTeams] }]}
                            width={350}
                            height={250}
                            colors={[theme.palette.primary.main]}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Tables */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <RecentUsersTable users={recentUsers} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <RecentAppointmentsTable appointments={recentAppointments} />
                </Grid>
            </Grid>
        </Box>
    );
};

// DashboardCard
const DashboardCard = ({ icon, title, value, color }) => (
    <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <Card sx={{ p: 2, borderLeft: `5px solid ${color}`, boxShadow: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                    <Box color={color} mr={2}>{icon}</Box>
                    <Typography variant="subtitle2">{title}</Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold">{value}</Typography>
            </CardContent>
        </Card>
    </Grid>
);

// RecentUsersTable
const RecentUsersTable = ({ users }) => (
    <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Users</Typography>
        <Divider sx={{ mb: 1 }} />
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Alias Name</TableCell>
                        <TableCell>Email</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                        {user.name.charAt(0)}
                                    </Avatar>
                                    {user.name}
                                </Box>
                            </TableCell>
                            <TableCell>{user.aliasName}</TableCell>
                            <TableCell>
                                <Chip
                                    label={user.email}
                                    size="small"
                                    color={user.role === 'admin' ? 'primary' : 'default'}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
);

// RecentAppointmentsTable
const RecentAppointmentsTable = ({ appointments }) => (
    <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Appointments</Typography>
        <Divider sx={{ mb: 1 }} />
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Team</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>TimeSlot</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {appointments.map((appointment) => (
                        <TableRow key={appointment._id}>
                            <TableCell>{appointment.userId?.name}</TableCell>
                            <TableCell>{appointment.assignedTeamMember?.name || 'N/A'}</TableCell>
                            <TableCell>{format(new Date(appointment.date), 'PPp')}</TableCell>
                            <TableCell>
                                <Chip
                                    label={appointment.timeSlot}
                                    size="small"
                                    color={
                                        appointment.status === 'confirmed' ? 'success' :
                                            appointment.status === 'pending' ? 'warning' : 'default'
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
);

export default AdminDashboard;
