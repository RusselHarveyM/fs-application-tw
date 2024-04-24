export default function commentFormatter(data) {
  let comments = {
    sort: "Summary: The model found ",
    set: "Summary: The model found ",
    shine: "Summary: The model found ",
  };
  const count = data.count;
  const scores = data.scores;
  console.log(data);
  for (let key in scores) {
    const obj = scores[key];
    let objectsFound = {};
    for (let prop in obj) {
      if (prop === "score") continue;
      if (Array.isArray(obj[prop])) {
        obj[prop].forEach((obj) => {
          if (Object.hasOwn(objectsFound, obj.class)) {
            objectsFound[obj.class].qty++;
          } else {
            objectsFound[obj.class] = {
              qty: 1,
              class: obj.class,
              type: prop,
            };
          }
        });
      } else if (typeof obj[prop] === "object") {
        const innerObj = obj[prop];
        for (let innerProp in innerObj) {
          if (!Object.hasOwn(objectsFound, innerProp)) {
            objectsFound[innerProp] = {
              qty: obj[innerProp],
              class: innerProp,
              type: innerProp,
            };
          }
        }
      } else {
        if (!Object.hasOwn(objectsFound, prop)) {
          objectsFound[prop] = {
            qty: obj[prop],
            class: prop,
            type: prop,
          };
        }
      }
    }

    console.log(objectsFound);
    if (key === "set") {
      let endComment = ". Things to improve: ";
      for (const [countKey, value] of Object.entries(count)) {
        comments[key] += ` ${count[countKey].qty} ${count[countKey].class},`;
      }
      if (scores.set.unorganized > 0) {
        comments[key] += ` ${scores.set.unorganized} unorganized area,`;
        endComment += ` * arrange areas according to standard.\n`;
      } else {
        comments[key] = "Summary: The space is in order.";
      }
      // if(!data.airsystem){
      //   comments[key] += ` no air system found`;
      //   endComment += ` * make sure there are proper air systems installed.\n`;
      // }
      comments[key] += endComment;
    }
    if (key === "sort") {
      let endComment = ". Things to improve: ";
      let missingFlag = -1;
      let unwantedFlag = -1;
      for (const [prop, value] of Object.entries(objectsFound)) {
        if (
          objectsFound[prop].type === "unwanted" ||
          objectsFound[prop].type === "missing"
        ) {
          comments[
            key
          ] += ` ${objectsFound[prop].qty} ${objectsFound[prop].type} ${objectsFound[prop].class}/s,`;
          if (objectsFound[prop].type === "unwanted") {
            unwantedFlag = 1;
          }
          if (objectsFound[prop].type === "missing") {
            missingFlag = 1;
          }
        }
      }
      if (!missingFlag && !unwantedFlag) {
        comments[key] = "Summary: The space is well kept.";
      }
      if (missingFlag === 1) {
        endComment += ` * make sure all items are in their correct positions.\n`;
        endComment += ` * make sure all necessary areas are captured.\n`;
      }
      if (unwantedFlag === 1) {
        endComment += ` * remove unecessary items.\n`;
      }

      comments[key] += endComment;
    }
    if (key === "shine") {
      let endComment = ". Things to improve: ";
      const shine = scores.shine;
      if (
        shine.damage === 0 &&
        shine.litter === 0 &&
        shine.smudge === 0 &&
        shine.adhesive === 0
      ) {
        comments[key] = "Summary: The space is clean.";
        comments[key] += endComment;
        continue;
      }
      if (shine.damage > 0) {
        comments[key] += ` ${shine.damage} damage/s,`;
        endComment += ` * fix damage/s.`;
      }
      if (shine.litter > 0) {
        comments[key] += ` ${shine.litter} litter/s,`;
        endComment += ` * remove litter/s.`;
      }
      if (shine.smudge > 0) {
        comments[key] += ` ${shine.smudge} smudge/s,`;
        endComment += ` * clean smudge/s.`;
      }
      if (shine.adhesive > 0) {
        comments[key] += ` ${shine.adhesive} adhesive/s,`;
        endComment += ` * clean adhesive/s.`;
      }
      comments[key] += endComment;
    }
  }
  return comments;
}
