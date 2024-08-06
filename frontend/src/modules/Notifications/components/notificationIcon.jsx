import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCalendarAlt, FaChalkboardTeacher, FaBell, FaEnvelopeOpen, FaTimes } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow } from 'date-fns';
import axiosRequest from '../../../utils/AxiosConfig';
import { UserData } from '../../../utils/UserData';
import io from 'socket.io-client';
import {
  toggleShowNotifications,
  setNotifications,
  setLoading,
  setError,
  markAllAsReadSuccess,
  deleteNotificationSuccess,
  addNotification,
} from "../../../core/Features/Notifications";
import './notificationIcon.css';

const NotificationIcon = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, showNotifications, isLoading, error } = useSelector((state) => state.notificationStore);

  const userData = UserData();
  const organizerId = userData.id;

  useEffect(() => {
    fetchNotifications();

    const socket = io('http://localhost:6001');

    socket.on('new-notification', (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosRequest.get(`http://localhost:6001/notification?userId=${organizerId}`);
      if (!Array.isArray(response.data)) throw new Error('Invalid data format');
      const unreadCount = response.data.filter(notification => !notification.read).length;
      dispatch(setNotifications({ notifications: response.data, unreadCount }));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      await axiosRequest.patch('http://localhost:6001/notification/mark-all-as-read', {
        userId,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      dispatch(markAllAsReadSuccess());
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axiosRequest.delete(`http://localhost:6001/notification/${notificationId}`);
      dispatch(deleteNotificationSuccess(notificationId));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const handleIconClick = () => {
    dispatch(toggleShowNotifications());
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="notification-icon-container">
      <div className="notification-icon me-3" onClick={handleIconClick}>
        <i className="bx bx-bell bx-sm" style={{ color: "var(--primary-color)" }}></i>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <span className="header-title">Notifications</span>
            <span className="mark-all-read" onClick={handleMarkAllAsRead}>
              <FaEnvelopeOpen /> Mark all as read
            </span>
          </div>
          <div className="dropdown-list">
            {notifications.length === 0 ? (
              <div className="dropdown-item">No notifications available</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`dropdown-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="item-icon">
                    {notification.type === 'EventRegistration' && <FaCalendarAlt />}
                    {notification.type === 'WorkshopRegistration' && <FaChalkboardTeacher />}
                  </div>
                  <div className="item-content">
                    <div className="item-title">
                      {(notification.from && notification.from.fullName) || 'Unknown User'}
                    </div>
                    <div className="item-text">
                      {notification.type === 'EventRegistration'
                        ? 'Registered for an event'
                        : 'Registered for a workshop'}
                    </div>
                    <div className="item-time">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="item-action">
                    <FaTimes onClick={() => deleteNotification(notification._id)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
