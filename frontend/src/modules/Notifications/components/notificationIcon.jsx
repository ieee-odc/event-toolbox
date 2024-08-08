import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { formatDistanceToNow } from "date-fns";
import axiosRequest from "../../../utils/AxiosConfig";
import { UserData } from "../../../utils/UserData";
import io from "socket.io-client";
import {
  toggleShowNotifications,
  setNotifications,
  setLoading,
  setError,
  markAllAsReadSuccess,
  deleteNotificationSuccess,
  addNotification,
} from "../../../core/Features/Notifications";
import "./notificationIcon.css";

const NotificationIcon = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, showNotifications, isLoading, error } =
    useSelector((state) => state.notificationStore);

  const userData = UserData();
  const organizerId = userData.id;
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  useEffect(() => {
    fetchNotifications();
    const newSocket = io(import.meta.env.VITE_BACKEND.split("/api")[0]);

    newSocket.on("connect", () => {
      newSocket.emit("joinOrganizer", userData.id);
    });

    newSocket.on("new-notification", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      dispatch(setLoading(true));
      axiosRequest.get(`/notification/${organizerId}`).then((res) => {
        const unreadCount = res.data.notifications.filter(
          (notification) => !notification.read
        ).length;
        dispatch(
          setNotifications({
            notifications: res.data.notifications,
            unreadCount,
          })
        );
      });
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      await axiosRequest.post(
        "/notification/mark-all-as-read",
        {
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(markAllAsReadSuccess());
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axiosRequest.delete(`notification/${notificationId}`);
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
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch(toggleShowNotifications());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="notification-icon-container">
      <div className="notification-icon me-3" onClick={handleIconClick}>
        <i
          className="bx bx-bell bx-sm"
          style={{ color: "var(--primary-color)" }}
        ></i>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>
      {showNotifications && (
        <div className="notifications-dropdown" ref={dropdownRef}>
          <div className="dropdown-header">
            <span className="header-title">Notifications</span>
            <span className="mark-all-read" onClick={handleMarkAllAsRead}>
              <i class="bx bx-envelope-open"></i> Mark all as read
            </span>
          </div>
          <div className="dropdown-list">
            {notifications.length === 0 ? (
              <div className="dropdown-item">No notifications available</div>
            ) : (
              notifications &&
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`dropdown-item ${
                    !notification.read ? "unread" : ""
                  }`}
                >
                  <div className="item-icon">
                    {notification.type === "EventRegistration" && (
                      <i class="bx bx-calendar-plus"></i>
                    )}
                    {notification.type === "WorkshopRegistration" && (
                      <i class="bx bx-calendar-plus"></i>
                    )}
                  </div>
                  <div className="item-content">
                    <div className="item-title">
                      {(notification.user && notification.user.fullName) ||
                        "Unknown User"}
                    </div>
                    <div className="item-text">
                      {notification.type === "EventRegistration"
                        ? "Registered for an event"
                        : "Registered for a workshop"}
                    </div>
                    <div className="item-time">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="item-action">
                    <i
                      class="bx bx-x-circle"
                      onClick={() => deleteNotification(notification._id)}
                    ></i>
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
