import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './notificationIcon.css'; // Ensure you create this CSS file for basic styling
import NotificationList from './NotificationList';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Function to mark all notifications as read
const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    await axios.patch('http://localhost:6001/notification/mark-all-as-read', {
      userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('All notifications marked as read');
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

// Function to fetch notifications
const fetchNotifications = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const response = await axios.get(`http://localhost:6001/notification?userId=${userId}`);
    
    console.log('Response data:', response.data);

    // Ensure the response data is an array
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid data format');
    }

    const unreadCount = response.data.filter(notification => !notification.read).length;

    return { notifications: response.data, unreadCount };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const NotificationIcon = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    onSuccess: () => {
      console.log('Notifications fetched successfully');
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

  const { notifications = [], unreadCount } = data || {};

  const handleIconClick = () => {
    console.log('Notification icon clicked');
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Refetch notifications to update the unread count
      refetch();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1">
      <a
        className="nav-link dropdown-toggle hide-arrow"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded={showNotifications}
        onClick={handleIconClick}
      >
        <i className="bx bx-bell bx-sm"></i>
        <span className="badge bg-danger rounded-pill badge-notifications">{unreadCount}</span>
      </a>
      {showNotifications && (
        <ul className="dropdown-menu dropdown-menu-end py-0 show">
          <li className="dropdown-menu-header border-bottom">
            <div className="dropdown-header d-flex align-items-center py-3">
              <h5 className="text-body mb-0 me-auto">Notifications</h5>
              <a
                href="javascript:void(0)"
                className="dropdown-notifications-all text-body"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                aria-label="Mark all as read"
                data-bs-original-title="Mark all as read"
                onClick={handleMarkAllAsRead} // Added onClick handler
              >
                <i className="bx fs-4 bx-envelope-open"></i>
              </a>
            </div>
          </li>
          <NotificationList notifications={notifications} />
          <li className="dropdown-menu-footer border-top p-3">
            <button className="btn btn-primary text-uppercase w-100">View All Notifications</button>
          </li>
        </ul>
      )}
    </li>
  );
};

export default NotificationIcon;
