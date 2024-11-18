const getDate = () => {
   const date = new Date();

   // Format date and time components manually for Asia/Tashkent
   const year = date.getUTCFullYear();
   const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
   let day = date.getUTCDate().toString().padStart(2, '0');
   let hours = date.getUTCHours() + 5; // Adjusting for +05:00 timezone

   // Handle overflow when hours exceed 23
   if (hours >= 24) {
      hours -= 24;
      day = (parseInt(day) + 1).toString().padStart(2, '0'); // Increment day and pad
   }

   const minutes = date.getUTCMinutes().toString().padStart(2, '0');
   const seconds = date.getUTCSeconds().toString().padStart(2, '0');

   // Generate microseconds by padding milliseconds to 6 digits
   const microseconds = (date.getMilliseconds() * 1000).toString().padStart(6, '0');

   // Set timezone offset manually as +05
   const timezoneOffset = '+05';

   // Combine components to match desired format
   const finalDate = `${year}-${month}-${day} ${hours.toString().padStart(2, '0')}:${minutes}:${seconds}.${microseconds}${timezoneOffset}`;
   return finalDate;
};

module.exports = {
   getDate
}