export function checkMonth(date) {
  console.log("dateeee:", date);
  if (date) {
    const currDate = new Date(date).getMonth();
    return currDate === new Date().getMonth();
  }
  return false;
}

export function checkYear(date) {
  if (date) {
    const currDate = new Date(date).getFullYear();
    return currDate === new Date().getFullYear();
  }
  return false;
}
