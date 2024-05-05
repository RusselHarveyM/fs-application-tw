export function checkMonth(date) {
  const currDate = new Date(date).getMonth();
  return currDate === new Date().getMonth();
}

export function checkYear(date) {
  const currDate = new Date(date).getFullYear();
  return currDate === new Date().getFullYear();
}
