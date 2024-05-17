export default function commentFormatter(data) {
  let comments = {
    sort: "Summary: The model found ",
    set: "Summary: The model found ",
    shine: "Summary: The model found ",
  };

  const { scores } = data;

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

      const countItem = (item, countObj, status) => {
        const tempObj = Object.entries(countObj);

        const addOrUpdateCount = (entry, parentClass) => {
          let found = false;
          for (const [, value] of tempObj) {
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

        if (item.children && item.children.length === 0) {
          if (item.status === status) {
            addOrUpdateCount(item, undefined);
          }
        } else {
          if (item.status === status || item.status === undefined) {
            item.children.forEach((child) => {
              if (child.status === status) {
                addOrUpdateCount(child, item.class);
              }
            });
          }
        }
      };

      obj.unwanted.forEach((item) => {
        item.forEach((innerItem) => {
          countItem(innerItem, unwantedCount, "extra");
          countItem(innerItem, missingCount, "missing");
        });
      });

      console.log("unwantedCount", unwantedCount);
      console.log("missingCount", missingCount);

      const buildComments = (countObj, status) => {
        for (let key in countObj) {
          const comment = countObj[key].parent
            ? `${countObj[key].qty} ${countObj[key].class} on ${countObj[key].parent}`
            : `${countObj[key].qty} ${status} ${countObj[key].class}`;
          comments[key] = comments[key]
            ? comments[key] + comment + ", "
            : comment + ", ";
        }
      };

      buildComments(unwantedCount, "unwanted");
      buildComments(missingCount, "missing");

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
