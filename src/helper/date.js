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

export function getDateNow() {
  const newDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
    new Date().getMilliseconds()
  );
  console.log("newDate >>>>> ", newDate);

  return newDate;
}

export function sortDate(object) {
  if (!object) return [];
  const latestRating = object.sort(
    (a, b) =>
      new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
  );
  return latestRating;
}

export function calculateMonthlyAverages(data) {
  console.log("calculateMonthlyAverages", data);
  const monthlyAverages = data.reduce((acc, space) => {
    space.ratings.forEach((rating) => {
      if (rating) {
        const date = new Date(rating.dateModified);
        const month = `${date.toLocaleDateString("en-US", {
          month: "short",
        })} ${date.getFullYear()}`;
        acc[month] = acc[month] || {
          date: month,
          Sort: 0,
          "Set In Order": 0,
          Shine: 0,
          count: 0,
        };
        acc[month].Sort += rating.sort;
        acc[month]["Set In Order"] += rating.setInOrder;
        acc[month].Shine += rating.shine;
        acc[month].count++;
      }
    });
    return acc;
  }, {});

  const averageScores = Object.values(monthlyAverages).map((average) => {
    let sort = (average.Sort / average.count).toFixed(1);
    let set = (average["Set In Order"] / average.count).toFixed(1);
    let shine = (average.Shine / average.count).toFixed(1);
    return {
      date: average.date,
      Sort: sort,
      "Set In Order": set,
      Shine: shine,
      Average: (
        (parseFloat(sort) + parseFloat(set) + parseFloat(shine)) /
        3
      ).toFixed(1),
    };
  });

  averageScores.sort((a, b) => new Date(a.date) - new Date(b.date));

  return averageScores;
}
