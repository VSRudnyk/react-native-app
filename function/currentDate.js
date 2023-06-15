export const currentDate = (dateInMs) => {
  let date = new Date();

  if (dateInMs) {
    date = new Date(dateInMs);
  }

  const year = date.getFullYear();
  const month = date.getMonth() - 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minutes = date.getMinutes();

  const monthArr = [
    'січня',
    'лютого',
    'березня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];

  if (day < 10) day = '0' + day;
  if (minutes < 10) minutes = '0' + minutes;

  return `${day} ${monthArr[month]}, ${year} | ${hour}:${minutes}`;
};
