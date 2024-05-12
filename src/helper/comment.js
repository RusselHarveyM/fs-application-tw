export default function commentFormatter(data) {
  let comments = {
    sort: "Summary: The model found ",
    set: "Summary: The model found ",
    shine: "Summary: The model found ",
  };

  const count = data.count;
  const scores = data.scores;

  for (let key in scores) {
    const obj = scores[key];
    let objectsFound = {};

    for (let prop in obj) {
      if (prop === "score") continue;

      if (Array.isArray(obj[prop])) {
        obj[prop].forEach((item) => {
          const id = item.id;
          const itemName = item.class;
          const itemType = prop;
          const itemChildren = item.children;
          const itemQty = objectsFound[itemName]
            ? objectsFound[itemName].qty + 1
            : 1;

          objectsFound[itemName] = {
            id,
            qty: itemQty,
            class: itemName,
            type: itemType,
            children: itemChildren,
          };

          // Check if the item has children
          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => {
              const id = child.id;
              const childName = child.class;
              const childType = itemType;
              const childQty = objectsFound[childName]
                ? objectsFound[childName].qty + 1
                : 1;

              objectsFound[childName] = {
                id,
                qty: childQty,
                class: childName,
                type: childType,
              };
            });
          }
        });
      } else if (typeof obj[prop] === "object") {
        for (let innerProp in obj[prop]) {
          if (!objectsFound[innerProp]) {
            objectsFound[innerProp] = {
              id: obj[prop].id,
              qty: obj[prop][innerProp],
              class: innerProp,
              type: innerProp,
            };
          }
        }
      } else {
        if (!objectsFound[prop]) {
          objectsFound[prop] = {
            id: obj.id,
            qty: obj[prop],
            class: prop,
            type: prop,
          };
        }
      }
    }

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
      comments[key] += endComment;
    }

    if (key === "sort") {
      let endComment = ". Things to improve: ";
      let missingFlag = false;
      let unwantedFlag = false;
      let foundChildrens = [];
      for (const [itemName, item] of Object.entries(objectsFound)) {
        if (
          (item.type === "unwanted" || item.type === "missing") &&
          !foundChildrens.includes(item.id)
        ) {
          comments[key] += ` ${item.qty} ${item.type} ${item.class}/s,`;

          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => {
              comments[key] += ` ${child.class} is found on the ${item.class},`;
              foundChildrens.push(child.id);
            });
          }

          if (item.type === "unwanted") {
            unwantedFlag = true;
          }
          if (item.type === "missing") {
            missingFlag = true;
          }
        }
      }

      if (!missingFlag && !unwantedFlag) {
        comments[key] = "Summary: The space is well kept.";
      }

      if (missingFlag) {
        endComment += ` * make sure all items are in their correct positions.\n`;
        endComment += ` * make sure all necessary areas are captured.\n`;
      }
      if (unwantedFlag) {
        endComment += ` * remove unnecessary items.\n`;
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

  console.log("comments >>> ", comments);
  return comments;
}
