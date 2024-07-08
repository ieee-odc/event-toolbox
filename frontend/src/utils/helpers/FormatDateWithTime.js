export function formatTime(dateStr) {
    const date = new Date(dateStr);
  
    // Format the time
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
  
    return date.toLocaleTimeString('en-GB', options);
}
