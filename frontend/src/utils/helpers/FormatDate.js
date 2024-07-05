export const formatDateWithShort = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };


  export function formatDateWithNumbers(dateStr) {
    const date = new Date(dateStr);
  
    // Format the date
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
  
    return date.toLocaleDateString('en-GB', options);
  }