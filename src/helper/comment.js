export default function commentFormatter(data) {
  let comments = {
    sort: "Summary: The model found ",
    set: "Summary: The model found ",
    shine: "Summary: The model found ",
  };

  const { scores } = data;

  console.log("comment formatter > ", data);

  for (let key in scores) {
    const obj = scores[key];

    if (key === "set") {
      if (obj.unorganized > 0) {
        comments[key] += `There is ${obj.unorganized} unorganized area, `;
        comments[key] +=
          "Things to improve: * arrange areas according to the standard.\n";
      } else {
        comments[key] = "Summary: The space is in order.";
      }
    }

    if (key === "sort") {
      let endComment = "Things to improve: ";
      let unwantedCount = {};
      let missingCount = {};

      const addOrUpdateCount = (entry, parentClass, countObj) => {
        let found = false;
        for (const [, value] of Object.entries(countObj)) {
          if (value.class === entry.class && value.parent === parentClass) {
            value.qty += 1;
            found = true;
            break;
          }
        }
        if (!found) {
          countObj[entry.id] = {
            qty: 1,
            id: entry.id,
            class: entry.class,
            parent: parentClass,
          };
        }
      };

      const countItem = (item, countObj, status) => {
        if (item.children && item.children.length === 0) {
          if (item.status === status) {
            addOrUpdateCount(item, undefined, countObj);
          }
        } else {
          if (item.status === status || item.status === undefined) {
            item.children.forEach((child) => {
              if (child.status === status) {
                addOrUpdateCount(child, item.class, countObj);
              }
            });
          }
        }
      };

      obj.unwanted.forEach((item) => {
        item.forEach((innerItem) => {
          countItem(innerItem, unwantedCount, "extra");
        });
      });
      obj.missing.forEach((item) => {
        item.forEach((innerItem) => {
          countItem(innerItem, missingCount, "missing");
        });
      });

      console.log("unwantedCount", unwantedCount);
      console.log("missingCount", missingCount);

      const buildComments = (currentKey, countObj, status) => {
        for (let key in countObj) {
          const comment = countObj[key].parent
            ? `${countObj[key].qty} ${status} ${countObj[key].class} on the ${countObj[key].parent}`
            : `${countObj[key].qty} ${status} ${countObj[key].class}`;

          comments[currentKey] = comments[currentKey]
            ? comments[currentKey] + comment + ", "
            : comment + ", ";
        }
      };

      buildComments(key, unwantedCount, "unwanted");
      buildComments(key, missingCount, "missing");

      if (Object.keys(unwantedCount).length > 0) {
        endComment += "* remove unwanted items.\n";
      }
      if (Object.keys(missingCount).length > 0) {
        endComment += "* replace missing items.\n";
      }

      comments[key] = comments[key] ? comments[key] + endComment : endComment;
    }

    if (key === "shine") {
      let endComment = "Things to improve: ";
      const shine = scores.shine;

      if (
        shine.damage === 0 &&
        shine.litter === 0 &&
        shine.smudge === 0 &&
        shine.adhesive === 0
      ) {
        comments[key] = "Summary: The space is clean.";
      } else {
        if (shine.damage > 0) {
          comments[key] += `${shine.damage} damage/s, `;
          endComment += "* fix damage/s. ";
        }
        if (shine.litter > 0) {
          comments[key] += `${shine.litter} litter/s, `;
          endComment += "* remove litter/s. ";
        }
        if (shine.smudge > 0) {
          comments[key] += `${shine.smudge} smudge/s, `;
          endComment += "* clean smudge/s. ";
        }
        if (shine.adhesive > 0) {
          comments[key] += `${shine.adhesive} adhesive/s, `;
          endComment += "* clean adhesive/s. ";
        }
        comments[key] += endComment;
      }
    }
  }

  return comments;
}
