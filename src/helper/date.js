export function checkMonth(date) {
  if (date) {
    const currDate = new Date(date).getMonth();
    console.log("currDate", currDate);
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
    const latestRating = sortDate(space.ratings);

    console.log("[t] latestRating", latestRating);
    latestRating.forEach((rating) => {
      if (rating) {
        const date = new Date(rating.dateModified);
        const month = `${date.toLocaleDateString("en-US", {
          month: "short",
        })} ${date.getFullYear()}`;

        if (acc[month] && !acc[month].id.includes(space.id)) {
          acc[month].Sort += rating.sort;
          acc[month]["Set In Order"] += rating.setInOrder;
          acc[month].Shine += rating.shine;
          acc[month].count++;
          acc[month].id.push(space.id);
        }

        if (!acc[month]) {
          acc[month] = acc[month] || {
            id: [space.id],
            date: month,
            originalDate: date,
            Sort: rating.sort,
            "Set In Order": rating.setInOrder,
            Shine: rating.shine,
            count: 1,
          };
        }
      }
    });
    return acc;
  }, {});
  console.log("monthlyAverages", monthlyAverages);

  const averageScores = Object.values(monthlyAverages).map((average) => {
    let sort = (
      average.Sort / (average.count === 0 ? 1 : average.count)
    ).toFixed(1);
    let set = (
      average["Set In Order"] / (average.count === 0 ? 1 : average.count)
    ).toFixed(1);
    let shine = (
      average.Shine / (average.count === 0 ? 1 : average.count)
    ).toFixed(1);
    return {
      date: average.date,
      originalDate: average.originalDate,
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
