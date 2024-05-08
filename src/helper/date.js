export function checkMonth(date) {
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

export function getDateString(date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

export function sortDate(object) {
  if (!object) return [];
  const latestRating = object.sort(
    (a, b) =>
      new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
  );
  return latestRating;
}
