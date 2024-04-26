const WIL_CHECKLIST = {
  // start
  lounge: [
    {
      id: 0,
      class: "pot",
      children: [],
    },
    {
      id: 1,
      class: "chair",
      children: [],
    },
    {
      id: 2,
      class: "chair",
      children: [],
    },
    {
      id: 3,
      class: "sofa",
      children: [],
    },
    {
      id: 4,
      class: "sofa",
      children: [],
    },
    {
      id: 5,
      class: "table",
      children: [
        {
          id: 50,
          class: "basket",
          children: [],
        },
      ],
    },
    {
      id: 6,
      class: "table",
      children: [],
    },
  ],
  // end
};

export async function c_evaluation(data, spacename, standard) {
  // let space = WIL_CHECKLIST[spacename].map((obj) => ({
  //   ...obj,
  //   children: [...obj.children],
  // }));
  const SPACE_STANDARD = JSON.parse(standard);
  let missing_objects = [];
  const objects = [...data];

  for (const wilObj of SPACE_STANDARD) {
    let filteredObjects = objects.filter((obj) => obj.class === wilObj.class);
    if (filteredObjects.length === 0) {
      wilObj.status = "missing";
      missing_objects.push(wilObj);
    } else {
      if (wilObj.children.length > 0) {
        let newFiltered = filteredObjects.filter(
          (obj) => obj.children.length > 0
        );
        if (newFiltered.length === 0) {
          wilObj.status = "c_missing";
          missing_objects.push(wilObj);
        } else {
          const base = wilObj.children;
          // note: must separate multiple/single classes
          let missing_objects_children = [];
          for (const curr of newFiltered) {
            const curObj = curr.children;
            base.forEach((baseObj, index) => {
              const filteredData = curObj.filter(
                (obj) => obj.class === baseObj.class
              );
              if (filteredData.length === 0) {
                baseObj.status = "missing";
                missing_objects_children.push(baseObj);
              } else {
                const foundIndex = curObj.findIndex(
                  (obj) => obj.id === filteredData[0].id
                );

                curObj.splice(foundIndex, 1);
                base.splice(index, 1);
                if (base.length === 0) {
                  if (curObj.length === 0) {
                    const foundIndex = objects.findIndex(
                      (obj) => obj.id === curr.id
                    );
                    objects.splice(foundIndex, 1);
                  } else {
                    curr.status = "c_extra";
                  }
                }
              }
            });
          }

          const foundObj = missing_objects_children.find(
            (obj) => obj.status === "missing"
          );
          if (foundObj) {
            // if there is extra/unwanted
            if (newFiltered.length > 0) {
              newFiltered.forEach((obj) => {
                if (obj.status !== "c_extra") obj.status = "extra";
                base.push(obj);
              });
            }
            missing_objects.push(wilObj);
          }
          // unwanted_objects_children = [...newFiltered];
        }
      } else {
        const foundObj = filteredObjects.find(
          (obj) => obj.children.length === 0
        );
        if (foundObj) {
          const foundObjIndex = objects.findIndex(
            (obj) => obj.id === foundObj.id
          );
          // found_objects.push(wilObj);
          objects.splice(foundObjIndex, 1);
        }
      }
    }
  }
  console.log(" objects 12312 ", objects);
  if (objects.length > 0) {
    objects.forEach((obj) => {
      obj.status = "extra";
      missing_objects.push(obj);
    });
  }

  return missing_objects;
}
