import axios from "axios";
import { c_evaluation } from "./checklist";
import { isEmpty } from "./string";

const API_KEY = "YQqkSBcCWshZKil9jU2C";

const apiEndpoints = {
  countModel: "https://detect.roboflow.com/new-count-model/18",
  orderModel: "https://detect.roboflow.com/classroom-order-seg/20",
  pbModel: "https://detect.roboflow.com/classroom-type-identification/22",
  blueModel: "https://detect.roboflow.com/classroom-blue-det/7",
  yellowModel: "https://detect.roboflow.com/new_yellow_model/9",
};

async function makeApiRequest(endpoint, image, params = {}) {
  try {
    const response = await axios.post(endpoint, image, {
      params: {
        api_key: API_KEY,
        ...params,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(`${endpoint.split("/").pop()} >>>`, response.data);
    return response.data;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function countModel(image) {
  return makeApiRequest(apiEndpoints.countModel, image, {
    confidence: 70,
    overlap: 70,
  });
}

async function orderModel(image) {
  return makeApiRequest(apiEndpoints.orderModel, image, { confidence: 75 });
}

async function pbModel(image) {
  return makeApiRequest(apiEndpoints.pbModel, image, { confidence: 75 });
}

async function blueModel(image) {
  return makeApiRequest(apiEndpoints.blueModel, image);
}

async function yellowModel(image) {
  return makeApiRequest(apiEndpoints.yellowModel, image, { confidence: 75 });
}

function calculateOverlap(prediction1, prediction2) {
  const area1 = prediction1.width * prediction1.height;
  const area2 = prediction2.width * prediction2.height;

  const newX1 = prediction1.x - prediction1.width / 2;
  const newY1 = prediction1.y - prediction1.height / 2;

  const newX2 = prediction2.x - prediction2.width / 2;
  const newY2 = prediction2.y - prediction2.height / 2;

  // Check for complete containment of one rectangle in the other
  const isContained1 =
    newX1 <= newX2 &&
    newX1 + prediction1.width >= newX2 + prediction2.width &&
    newY1 <= newY2 &&
    newY1 + prediction1.height >= newY2 + prediction2.height;
  const isContained2 =
    newX2 <= newX1 &&
    newX2 + prediction2.width >= newX1 + prediction1.width &&
    newY2 <= newY1 &&
    newY2 + prediction2.height >= newY1 + prediction1.height;

  if (isContained1) {
    return { overlap: 1, overlapArea: area2, bigger: "first" };
  } else if (isContained2) {
    return { overlap: 1, overlapArea: area1, bigger: "second" };
  }

  // Calculate overlap area
  const x_overlap = Math.max(
    0,
    Math.min(newX1 + prediction1.width, newX2 + prediction2.width) -
      Math.max(newX1, newX2)
  );
  const y_overlap = Math.max(
    0,
    Math.min(newY1 + prediction1.height, newY2 + prediction2.height) -
      Math.max(newY1, newY2)
  );
  const overlapArea = x_overlap * y_overlap;

  // Determine which rectangle is bigger
  const bigger = area1 > area2 ? "first" : "second";

  // Calculate overlap ratio with respect to the smaller rectangle's area
  const smallerArea = Math.min(area1, area2);
  const overlap = overlapArea / smallerArea;

  return { overlap, overlapArea, bigger };
}

export default async function evaluate(images, standard, isCalibrate) {
  let result = {
    scores: {
      sort: { unwanted: [], missing: [], score: 0 },
      set: {
        unorganized: 0,
        airsystem: { ventilation: 0, aircon: 0, exhaust: 0 },
        score: 0,
      },
      shine: { damage: 0, litter: 0, smudge: 0, adhesive: 0, score: 0 },
    },
    count: {},
    airsystem: false,
    predictions: [],
    standard: "",
  };

  let objects = [];
  let allFlag = 0;
  let objectId = 0;

  for (const imageObject of images) {
    console.log(imageObject);

    let predictions = [];
    let objects_temp = [];

    let model1, model2, model3, model5;

    if (imageObject.forType === "std" || allFlag === 0) {
      model1 = await countModel(imageObject.image);
      model3 = await pbModel(imageObject.image);

      if (model1) {
        model1.predictions.forEach((pred) => {
          if (!result.count[pred.class]) {
            result.count[pred.class] = { qty: 1, class: pred.class };
          } else {
            result.count[pred.class].qty++;
          }
        });
      }

      if (model1 && model3) {
        let models = model1.predictions;
        if (!isEmpty(standard) && !isCalibrate) {
          models = model1.predictions.concat(model3.predictions);
        }

        models.forEach((prediction, index) => {
          objects_temp.push({
            id: objectId++,
            class: prediction.class,
            indexFrom: undefined,
            prediction: {
              height: prediction.height,
              width: prediction.width,
              x: prediction.x,
              y: prediction.y,
            },
            children: [],
          });
        });

        const commonParents = ["table", "chair", "sofa"];
        const commonChildrens = [
          "basket",
          "lamp",
          "bag",
          "cap",
          "cloth",
          "earphones",
          "headset",
          "laptop",
          "personal belongings",
          "paper",
          "phone",
          "sling",
          "wallet",
        ];
        const commonAbstracts = [
          "pot",
          "litter",
          "aircon",
          "ventilation",
          "electronics",
        ];

        objects_temp.forEach((first_object, outerIndex) => {
          objects_temp.forEach((second_object, innerIndex) => {
            const { class: first_key } = first_object;
            const { class: second_key } = second_object;

            if (
              first_key === second_key ||
              commonAbstracts.includes(first_key) ||
              commonAbstracts.includes(second_key) ||
              (commonParents.includes(first_key) &&
                commonParents.includes(second_key)) ||
              (commonChildrens.includes(first_key) &&
                commonChildrens.includes(second_key)) ||
              first_object.indexFrom === second_object.id ||
              second_object.indexFrom === first_object.id
            )
              return;

            const result = calculateOverlap(
              first_object.prediction,
              second_object.prediction
            );

            if (result.overlap > 0) {
              if (
                result.bigger === "first" &&
                commonParents.includes(first_key) &&
                commonChildrens.includes(second_key)
              ) {
                if (second_object.indexFrom === undefined) {
                  second_object.indexFrom = outerIndex;
                  first_object.children.push({ ...second_object, result });
                } else {
                  updateChildObject(
                    objects_temp,
                    second_object,
                    outerIndex,
                    first_object,
                    result
                  );
                }
              } else if (
                result.bigger === "second" &&
                commonParents.includes(second_key) &&
                commonChildrens.includes(first_key)
              ) {
                if (first_object.indexFrom === undefined) {
                  first_object.indexFrom = innerIndex;
                  second_object.children.push({ ...first_object, result });
                } else {
                  updateChildObject(
                    objects_temp,
                    first_object,
                    innerIndex,
                    second_object,
                    result
                  );
                }
              }
            }
          });
        });

        // Filter out objects that are children to avoid double counting
        objects_temp = objects_temp.filter(
          (object) => object.indexFrom === undefined
        );
      }

      objects = [...objects, ...objects_temp];

      model2 = await orderModel(imageObject.image);
      if (model2) {
        const filteredOrder = model2.predictions.filter(
          (obj) => obj.class === "disorganized"
        );
        result.scores.set.unorganized += filteredOrder.length;
      }
    }

    if (imageObject.forType === "all" || imageObject.forType === "std") {
      model5 = await yellowModel(imageObject.image);
      if (model5) {
        model5.predictions.forEach((obj) => {
          if (obj.class !== "score") {
            result.scores.shine[obj.class]++;
          }
        });
      }
    }

    predictions.push(model1 ? model1.predictions : []);
    predictions.push(model2 ? model2.predictions : []);
    predictions.push(model3 ? model3.predictions : []);
    predictions.push(model5 ? model5.predictions : []);
    result.predictions.push(predictions);

    if (imageObject.forType === "all" && allFlag === 0) allFlag = 1;
  }

  if (!isEmpty(standard) && !isCalibrate) {
    const c_result = await c_evaluation(objects, standard);

    console.log("c_result >> ", c_result);

    result.scores.sort.missing.push(
      c_result.filter(
        (obj) =>
          obj.status === "missing" ||
          obj.children.filter((child) => child.status === "missing").length > 0
      )
    );

    result.scores.sort.unwanted.push(
      c_result.filter(
        (obj) =>
          obj.status === "extra" ||
          obj.children.filter((child) => child.status === "extra").length > 0
      )
    );

    score(result, images.length);
  }

  console.log("result result", result);

  if (isCalibrate) result.standard = JSON.stringify(objects);

  return result;
}

function countStatus(arr, status) {
  let total = 0;
  if (arr.length === 0) return total;
  arr.forEach((obj) => {
    obj.forEach((item) => {
      if (item.status === status) {
        total++;
      }
      if (item.children.length === 0) return;
      item.children.forEach((child) => {
        if (child.status === status) {
          total++;
        }
      });
    });
  });
  return total;
}

function score(data, imagesLength) {
  const { sort, set, shine } = data.scores;

  const decrementPercentageSort = 0.5;
  const decrementPercentageSet = 2;
  const decrementPercentageShine = 1.5;

  // Calculate total unwanted and missing items, including children
  let totalUnwanted = countStatus(sort.unwanted, "extra");
  let totalMissing = countStatus(sort.missing, "missing");

  const totalUnwantedAndMissing = totalUnwanted + totalMissing;

  // Calculate sort score
  sort.score = Math.max(
    0,
    Math.min(10, 10 - totalUnwantedAndMissing * decrementPercentageSort)
  );

  // Calculate set score
  let setDecrement = decrementPercentageSet / imagesLength;
  set.score = Math.max(0, Math.min(10, 10 - set.unorganized * setDecrement));

  // Calculate shine score
  let shineDecrement =
    (shine.damage * 2 + shine.litter + shine.smudge) *
    (decrementPercentageShine / imagesLength);
  // shineDecrement =
  //   shine.damage >= imagesLength
  //     ? shineDecrement / imagesLength
  //     : shineDecrement;
  shine.score = Math.max(0, Math.min(10, 10 - shineDecrement));

  return {
    sort: sort.score,
    set: set.score,
    shine: shine.score,
  };
}

// function score(data, imagesLength) {
//   const { sort, set, shine } = data.scores;

//   const decrementPercentageSort = 0.5;
//   const decrementPercentageSet = 2;
//   const decrementPercentageShine = 1.5;

//   // Calculate total unwanted and missing items, including children

//   let totalUnwanted = countStatus(sort.unwanted, "extra");
//   let totalMissing = countStatus(sort.missing, "missing");

//   const totalUnwantedAndMissing = totalUnwanted + totalMissing;

//   sort.score = Math.max(
//     0,
//     Math.min(
//       10,
//       10 - totalUnwantedAndMissing * decrementPercentageSort * imagesLength
//     )
//   );

//   set.score = Math.max(
//     0,
//     Math.min(10, 10 - set.unorganized * decrementPercentageSet * imagesLength)
//   );

//   shine.score = Math.max(
//     0,
//     Math.min(
//       10,
//       10 -
//         ((shine.damage * 2 * decrementPercentageShine +
//           shine.litter +
//           shine.smudge +
//           shine.adhesive) *
//           decrementPercentageShine *
//           imagesLength) /
//           4
//     )
//   );

//   return {
//     sort: sort.score,
//     set: set.score,
//     shine: shine.score,
//   };
// }

function updateChildObject(
  objects_temp,
  childObject,
  newParentIndex,
  newParentObject,
  result
) {
  const previousParentIndex = childObject.indexFrom;
  const previousParentObject = objects_temp[previousParentIndex];
  const previousChildIndex = previousParentObject.children.findIndex(
    (child) => child.id === childObject.id
  );
  const previousChild = previousParentObject.children[previousChildIndex];

  if (result.overlapArea > previousChild.result.overlapArea) {
    childObject.indexFrom = newParentIndex;
    newParentObject.children.push({ ...childObject, result });
    previousParentObject.children.splice(previousChildIndex, 1);
  }

  if (newParentObject.indexFrom !== undefined) {
    const grandParentIndex = newParentObject.indexFrom;
    const grandParentObject = objects_temp[grandParentIndex];
    const grandChildIndex = grandParentObject.children.findIndex(
      (child) => child.id === newParentObject.id
    );
    grandParentObject.children.splice(grandChildIndex, 1, newParentObject);
  }
}
