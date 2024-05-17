export async function c_evaluation(data, standard) {
  const SPACE_STANDARD = JSON.parse(standard);
  const objects = [...data];

  for (const standardObject of SPACE_STANDARD) {
    const matchingObjects = objects.filter(
      (obj) => obj.class === standardObject.class
    );

    if (matchingObjects.length === 0) {
      standardObject.status = "missing";
      continue;
    }

    let foundMatch = { id: -1, children: [] };

    if (standardObject.children.length > 0) {
      const standardChildren = standardObject.children;

      for (const matchingObject of matchingObjects) {
        const { missingChildren, extraChildren } = compareChildren(
          matchingObject.children,
          standardChildren
        );

        if (missingChildren.length > 0) {
          foundMatch = { id: matchingObject.id, children: missingChildren };
        }

        if (missingChildren.length === 0 && extraChildren.length === 0) {
          const index = objects.findIndex((obj) => obj === matchingObject);
          if (index !== -1) {
            objects.splice(index, 1);
          }
          break;
        }
      }

      if (foundMatch.id !== -1) {
        const matchingObject = matchingObjects.find(
          (curr) => curr.id === foundMatch.id
        );
        if (matchingObject)
          matchingObject.children.push(...foundMatch.children);
      }
    } else {
      const filteredObjects = matchingObjects.filter(
        (obj) => obj.children.length === 0
      );
      if (filteredObjects.length > 0) {
        for (const obj of filteredObjects) {
          const index = objects.findIndex((o) => o === obj);
          if (index !== -1) {
            objects.splice(index, 1);
          }
        }
      } else {
        standardObject.status = "missing";
      }
    }
  }

  if (objects.length > 0) {
    objects.map((obj) => {
      if (obj.children.length === 0) {
        if (!obj.status) {
          obj.status = "extra";
        }
      } else {
        obj.children.map((child) => {
          if (child.status !== "missing") {
            child.status = "extra";
          }
        });
      }
    });
  }

  return objects;
}

function compareChildren(objectChildren, standardChildren) {
  const missingChildren = [];
  const extraChildren = [...objectChildren];

  for (const standardChild of standardChildren) {
    const foundMatchIndex = objectChildren.findIndex((objectChild) => {
      if (objectChild.class === standardChild.class) {
        if (
          standardChild.children &&
          objectChild.children &&
          standardChild.children.length > 0 &&
          objectChild.children.length > 0
        ) {
          const {
            missingChildren: subMissingChildren,
            extraChildren: subExtraChildren,
          } = compareChildren(objectChild.children, standardChild.children);

          if (
            subMissingChildren.length === 0 &&
            subExtraChildren.length === 0
          ) {
            extraChildren.splice(foundMatchIndex, 1);
            return true;
          }
        } else {
          extraChildren.splice(foundMatchIndex, 1);
          return true;
        }
      }
      return false;
    });

    if (foundMatchIndex === -1) {
      missingChildren.push({ ...standardChild, status: "missing" });
    }
  }

  extraChildren.forEach((child) => {
    child.status = "extra";
  });

  return { missingChildren, extraChildren };
}
