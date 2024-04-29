import axios from "axios";
import { c_evaluation } from "./checklist";

const API_KEY = "7kfXkOSEwHiflj4IHiHI";
// const API_KEY = "FGmG3dRIEifT1HLzdCRS";

async function countModel(image) {
  let response;
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/new-count-model/4",
    // url: "https://detect.roboflow.com/classroom-count-det/13",
    params: {
      api_key: API_KEY,
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (res) {
      response = res.data;
      console.log("count >>> ", res.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
  return response;
}

async function orderModel(image) {
  let result;
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-order-seg/12",
    params: {
      api_key: API_KEY,
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (res) {
      result = res.data;
      console.log("organize check >>>", res.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
  return result;
}

async function pbModel(image) {
  let response;
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-type-identification/11",
    // url: "https://detect.roboflow.com/classroom-3igmn/11",
    params: {
      api_key: API_KEY,
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (res) {
      response = res.data;
      console.log("personalBelongings check >>> ", res.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });

  return response;
}

async function blueModel(image) {
  let response;

  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-blue-det/7",
    params: {
      api_key: API_KEY,
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (res) {
      // Log the response data for each request
      console.log("blue >>>", res.data);
      response = res.data;
    })
    .catch(function (error) {
      console.log(error.message);
    });

  return response;
}

async function yellowModel(image) {
  let response;

  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-yellow-seg/8",
    params: {
      api_key: API_KEY,
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (res) {
      console.log("cleanliness detection >>> ", res.data);
      response = res.data;
    })
    .catch(function (error) {
      console.log(error.message);
    });
  return response;
}

function calculateOverlap(prediction1, prediction2) {
  // Calculate the area of each prediction
  let area1 = prediction1.width * prediction1.height;
  let area2 = prediction2.width * prediction2.height;

  // Calculate the x and y coordinates of the intersection rectangle
  let x_overlap = Math.max(
    0,
    Math.min(
      prediction1.x + prediction1.width,
      prediction2.x + prediction2.width
    ) - Math.max(prediction1.x, prediction2.x)
  );
  let y_overlap = Math.max(
    0,
    Math.min(
      prediction1.y + prediction1.height,
      prediction2.y + prediction2.height
    ) - Math.max(prediction1.y, prediction2.y)
  );

  // Calculate the area of intersection
  let overlapArea = x_overlap * y_overlap;

  // Determine which prediction is bigger
  let bigger = area1 > area2 ? "first" : "second";

  let smallerArea = area1 < area2 ? area1 : area2;
  let overlap = overlapArea >= smallerArea * 0.1;

  return {
    overlap,
    overlapArea,
    bigger,
  };
}

function score(data) {
  /**
    let result = {
      scores: {
        sort: { ...SORT },
        set: { ...SET },
        shine: { ...SHINE },
      },
      predictions: [],
    };
   */
  const sort = data.scores.sort;
  const set = data.scores.set;
  const shine = data.scores.shine;

  sort.score = Math.min(
    10,
    Math.max(10 - (sort.unwanted.length + sort.missing.length) / 2, 0)
  );
  // Calculate the average air system
  const totalAS =
    set.airsystem.ventilation + set.airsystem.aircon + set.airsystem.exhaust;
  const airSystemScore = totalAS === 1 ? 1 : totalAS >= 2 ? 0 : 5; // Default value if no air systems

  // Calculate the final score
  set.score = Math.min(
    10,
    // Math.max(0, 10 - (airSystemScore + set.unorganized) / 2)
    Math.max(0, 10 - set.unorganized)
  );

  shine.score = Math.min(
    10,
    Math.max(
      10 -
        (shine.damage * 2 + shine.litter + shine.smudge + shine.adhesive) / 4,
      0
    )
  );
}

export default async function evaluate(images, spacename, standard) {
  let result = {
    scores: {
      sort: {
        unwanted: [],
        missing: [],
        score: 0,
      },
      set: {
        unorganized: 0,
        airsystem: {
          ventilation: 0,
          aircon: 0,
          exhaust: 0,
        },
        score: 0,
      },
      shine: {
        damage: 0,
        litter: 0,
        smudge: 0,
        adhesive: 0,
        score: 0,
      },
    },
    count: {},
    airsystem: false,
    predictions: [],
    standard: "",
  };

  let objects = [];
  let model1 = undefined;
  let model2 = undefined;
  let model3 = undefined;
  let model4 = undefined;
  let model5 = undefined;
  let prevModel1 = model1;
  let prevModel2 = model2;
  let prevModel3 = model3;
  let prevModel4 = model4;
  let prevModel5 = model5;
  let allFlag = 0;
  let objectId = 0;

  for (const imageObject of images) {
    // start
    console.log(imageObject);

    let predictions = [];
    let objects_temp = [];

    // sort and set
    if (imageObject.forType === "std" || allFlag === 0) {
      model1 = await countModel(imageObject.image);
      for (const pred of model1.predictions) {
        if (pred.confidence >= 0.5) {
          if (!Object.hasOwn(result.count, pred.class)) {
            result.count[pred.class] = {
              qty: 1,
              class: pred.class,
            };
          } else {
            result.count[pred.class].qty++;
          }
        }
      }
      model3 = await pbModel(imageObject.image);

      // structure
      if (model1 !== undefined && model3 !== undefined) {
        let models = model1.predictions;
        if (standard !== "") {
          model3.predictions = model3.predictions.filter(
            (pred) => pred.confidence >= 0.5
          );
          models = model1.predictions.concat(model3.predictions);
        }
        for (const [index, prediction] of models.entries()) {
          if (prediction.confidence >= 0.5) {
            const class_name = prediction.class;
            objects_temp.push({
              id: objectId,
              class: class_name,
              indexFrom: undefined,
              prediction: {
                height: prediction.height,
                width: prediction.width,
                x: prediction.x,
                y: prediction.y,
              },
              children: [],
            });
            objectId++;
          }
        }
        // structure object hierarchy
        // objects_temp.forEach((first_object, outerIndex) =>
        for (const [outerIndex, first_object] of objects_temp.entries()) {
          objects_temp.forEach((second_object, innerIndex) => {
            const first_key = first_object.class;
            const second_key = second_object.class;
            const notObjects = ["chair", "sofa", "pot"];
            if (
              first_key === second_key ||
              notObjects.includes(first_key) ||
              notObjects.includes(second_key)
            )
              return;
            if (first_object && second_object) {
              const result = calculateOverlap(
                first_object.prediction, // outer
                second_object.prediction // inner
              );

              if (result.overlap) {
                if (result.bigger === "first") {
                  if (second_object.indexFrom === undefined) {
                    second_object.indexFrom = outerIndex;
                    const object = { ...second_object, result };
                    first_object.children.push(object);
                  } else {
                    let childObject_raw = second_object;
                    const index = childObject_raw.indexFrom;
                    let ParentObject = objects_temp[index];
                    let foundIndex = ParentObject.children.findIndex(
                      (ch) => ch.id === childObject_raw.id
                    );
                    let childObject_result = ParentObject.children[foundIndex];
                    if (
                      result.overlapArea > childObject_result.result.overlapArea
                    ) {
                      second_object.indexFrom = outerIndex;
                      let object = { ...second_object, result };
                      first_object.children.push(object);
                      ParentObject.children.splice(foundIndex, 1);
                    }
                  }
                  if (first_object.indexFrom !== undefined) {
                    let childObject_raw = first_object;
                    const index = childObject_raw.indexFrom;
                    let ParentObject = objects_temp[index];
                    let foundIndex = ParentObject.children.findIndex(
                      (ch) => ch.id === childObject_raw.id
                    );
                    ParentObject.children.splice(
                      foundIndex,
                      1,
                      childObject_raw
                    );
                  }
                }
                if (result.bigger === "second") {
                  if (first_object.indexFrom === undefined) {
                    objects_temp[outerIndex].indexFrom = innerIndex;
                    const object = { ...first_object, result };
                    second_object.children.push(object);
                  } else {
                    let childObject_raw = first_object;
                    const index = childObject_raw.indexFrom;
                    let ParentObject = objects_temp[index];
                    let foundIndex = ParentObject.children.findIndex(
                      (ch) => ch.id === childObject_raw.id
                    );
                    let childObject_result = ParentObject.children[foundIndex];
                    if (
                      result.overlapArea > childObject_result.result.overlapArea
                    ) {
                      first_object.indexFrom = innerIndex;
                      let object = { ...second_object, result };
                      second_object.children.push(object);
                      ParentObject.children.splice(foundIndex, 1);
                    }
                  }
                  if (second_object.indexFrom !== undefined) {
                    let childObject_raw = second_object;
                    const index = childObject_raw.indexFrom;
                    let ParentObject = objects_temp[index];
                    let foundIndex = ParentObject.children.findIndex(
                      (ch) => ch.id === childObject_raw.id
                    );
                    ParentObject.splice(foundIndex, 1, childObject_raw);
                  }
                }
              }
            }
          });
        }
        // remove the items with indexFrom
        // objects_temp.forEach((object, index) => {
        for (const [index, object] of objects_temp.entries()) {
          if (object.indexFrom !== undefined) {
            objects_temp.splice(index, 1);
          }
        }
      }
      const newObject = [...objects, ...objects_temp];
      objects = newObject;

      console.log(objects);
      // order/organization
      model2 = await orderModel(imageObject.image);
      // model4 = await blueModel(imageObject.image);
      if (model2 !== undefined) {
        const filteredOrder = model2.predictions.filter(
          (obj) => obj.class === "disorganized"
        );
        if (filteredOrder.length > 0)
          result.scores.set.unorganized += filteredOrder.length;
        // for (const obj of model4.predictions) {
        //   const airwaysSystems = ["ventilation", "aircon", "exhaust"];
        //   if (obj.class in airwaysSystems) {
        //     result.scores.set.airsystem[obj.class]++;
        //     result.airsystem = true;
        //   }
        // }
      }
    }

    // shine
    if (imageObject.forType === "all" || imageObject.forType === "std") {
      model5 = await yellowModel(imageObject.image);
      if (model5 !== undefined) {
        // const yellowClasses = ["damage", "litter", "smudge", "adhesives"];
        for (const obj of model5.predictions) {
          if (obj.class === "score") continue;
          result.scores.shine[obj.class]++;
        }
      }
    }

    predictions.push(
      prevModel1 !== model1
        ? model1?.predictions.filter((obj) => obj.confidence >= 0.5)
        : []
    );

    predictions.push(prevModel2 !== model2 ? model2?.predictions : []);
    predictions.push(prevModel3 !== model3 ? model3?.predictions : []);
    predictions.push(prevModel4 !== model4 ? model4?.predictions : []);
    predictions.push(prevModel5 !== model5 ? model5?.predictions : []);
    result.predictions.push(predictions);
    prevModel1 = model1;
    prevModel2 = model2;
    prevModel3 = model3;
    prevModel4 = model4;
    prevModel5 = model5;

    if (imageObject.forType === "all" && allFlag === 0) allFlag = 1;
    // end
  }
  console.log("before", objects);

  if (standard !== "") {
    const c_result = await c_evaluation(objects, spacename, standard);
    console.log("c_result >>> ", c_result);

    result.scores.sort.missing.push(
      ...c_result.filter(
        (obj) => obj.status === "missing" || obj.status === "c_missing"
      )
    );
    result.scores.sort.unwanted.push(
      ...c_result.filter(
        (obj) => obj.status === "extra" || obj.status === "c_extra"
      )
    );

    console.log("result >>> ", result);
    score(result);
  } else {
    result.standard = JSON.stringify(objects);
  }

  return result;
}
