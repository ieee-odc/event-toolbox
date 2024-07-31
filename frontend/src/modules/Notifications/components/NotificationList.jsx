import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from "jwt-decode";
import './NotificationList.css';
import { FaRegCalendarCheck, FaRegClipboard } from 'react-icons/fa'; // Import icons

// Function to fetch notifications
const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id; // Assuming the decoded token contains an `id` field

        // Log the fetch URL
        console.log('Fetching notifications from:', `http://localhost:6001/notification/?userId=${userId}`);

        // Perform the fetch operation
        const response = await fetch(`http://localhost:6001/notification/?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include token in header for authentication
            }
        });

        // Log the raw response
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // Parse the JSON data
        const data = await response.json();

        // Log the parsed data
        console.log('Response data:', data);

        // Check if the response was successful
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        // Ensure data is an array
        if (!Array.isArray(data)) {
            console.error('Unexpected data format:', data);
            return [];
        }

        // Return the data if successful
        return data;
    } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error fetching notifications:', error);
        return []; // Return an empty array on error
    }
};

const NotificationPage = () => {
    const { data: notifications = [], isLoading, isError, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
        onSuccess: () => {
            console.log('Notifications fetched successfully');
            console.log('Type of notifications:', typeof notifications);
            console.log('Is array:', Array.isArray(notifications));
        },
        onError: (error) => {
            console.error('Error fetching notifications:', error);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    // Additional check for notifications being an array
    if (!Array.isArray(notifications)) {
        return <div>Unexpected data format</div>;
    }

    const notificationCount = notifications.length; // Get the count of notifications
    const notificationUnreadStyle = {
        backgroundColor: '#f5f5f5',
        borderLeft: '3px solid #007bff',
    };

    const fontWeightBoldStyle = {
        fontWeight: 'bold',
    };

    return (
        <div>
            <ul className="dropdown-notifications-list scrollable-container ps">
                <ul className="list-group list-group-flush">
                    {notificationCount === 0 ? (
                        <li className="list-group-item text-center">
                            No notifications available
                        </li>
                    ) : (
                        notifications.map((notification) => (
                            <li
                                key={notification._id}
                                className="list-group-item list-group-item-action dropdown-notifications-item"
                                style={!notification.read ? notificationUnreadStyle : {}}
                            >
                                <div className="d-flex">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar">
                                            <img
                                                src={(notification.from && notification.from.avatar) || '../../assets/img/avatars/default.png'}
                                                alt=""
                                                className="w-px-40 h-auto rounded-circle"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1" style={!notification.read ? fontWeightBoldStyle : {}}>
                                            {(notification.from && notification.from.fullName) || 'Unknown User'}
                                        </h6>
                                        <p className="mb-0">
                                            {notification.type === 'EventRegistration'
                                                ? 'Registered for an event'
                                                : 'Registered for a workshop'}
                                        </p>
                                        <small className="text-muted">{new Date(notification.createdAt).toLocaleString()}</small>
                                    </div>
                                    <div className="flex-shrink-0 dropdown-notifications-actions">
                                        <a href="javascript:void(0)" className="dropdown-notifications-read">
                                            <span className="badge badge-dot"></span>
                                        </a>
                                        <a href="javascript:void(0)" className="dropdown-notifications-archive">
                                            <span className="bx bx-x"></span>
                                        </a>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </ul>
        </div>
    );
};

export default NotificationPage;
