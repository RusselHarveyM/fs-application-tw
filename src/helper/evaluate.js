import axios from "axios";
import { c_evaluation } from "./checklist";
import { isEmpty } from "./string";

const API_KEY = "OeSBdrSNcfGEme3a9fDf";
// const API_KEY = "7kfXkOSEwHiflj4IHiHI";
// const API_KEY = "FGmG3dRIEifT1HLzdCRS";

async function countModel(image) {
  let response;
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/new-count-model/14",
    params: {
      api_key: API_KEY,
      confidence: 70,
      overlap: 70,
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
    url: "https://detect.roboflow.com/classroom-order-seg/17",
    // url: "https://detect.roboflow.com/classroom-order-seg/17",
    params: {
      api_key: API_KEY,
      confidence: 75,
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
    url: "https://detect.roboflow.com/classroom-type-identification/20",
    params: {
      api_key: API_KEY,
      confidence: 75,
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
    url: "https://detect.roboflow.com/new_yellow_model/9",
    params: {
      api_key: API_KEY,
      confidence: 75,
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
  let area1 = prediction1.width * prediction1.height;
  let area2 = prediction2.width * prediction2.height;

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

  let overlapArea = x_overlap * y_overlap;

  let totalArea = area1 + area2 - overlapArea;

  let bigger = area1 > area2 ? "first" : "second";

  let smallerArea = Math.min(area1, area2);

  let overlap = overlapArea / smallerArea;

  return {
    overlap,
    overlapArea: totalArea,
    bigger,
  };
}

function score(data, imagesLength) {
  const sort = data.scores.sort;
  const set = data.scores.set;
  const shine = data.scores.shine;

  const decrementPercentageSort = 0.5; // Adjust this value to control the decrement severity of sort
  const decrementPercentageSet = 2; // Adjust this value to control the decrement severity of set in order
  const decrementPercentageShine = 1.5; // Adjust this value to control the decrement severity of shine

  // Calculate sort score with decrement for unwanted/missing items
  sort.score = Math.max(
    0,
    Math.min(
      10,
      10 -
        (sort.unwanted.length + sort.missing.length) *
          decrementPercentageSort *
          imagesLength
    )
  );

  // Calculate air system score with penalty for missing elements
  const totalAS =
    set.airsystem.ventilation + set.airsystem.aircon + set.airsystem.exhaust;
  // const airSystemPenalty =
  //   (3 - totalAS) * decrementPercentageSet * imagesLength; // Penalty increases with missing systems

  // // Calculate set score with penalty for unorganized items and air system

  set.score = Math.max(
    0,
    Math.min(10, 10 - set.unorganized * decrementPercentageSet * imagesLength)
  );

  // Calculate shine score with decrement for damage, litter, etc.
  shine.score = Math.max(
    0,
    Math.min(
      10,
      10 -
        ((shine.damage * 2 * decrementPercentageShine +
          shine.litter +
          shine.smudge +
          shine.adhesive) *
          decrementPercentageShine *
          imagesLength) /
          4
    )
  );

  return {
    // Assuming you want to return the final scores
    sort: sort.score,
    set: set.score,
    shine: shine.score,
  };
}

export default async function evaluate(
  images,
  spacename,
  standard,
  isCalibrate
) {
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
  // let model4 = undefined;
  let model5 = undefined;
  let prevModel1 = model1;
  let prevModel2 = model2;
  let prevModel3 = model3;
  // let prevModel4 = model4;
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
        // if (pred.confidence >= 0.75) {
        if (!Object.hasOwn(result.count, pred.class)) {
          result.count[pred.class] = {
            qty: 1,
            class: pred.class,
          };
        } else {
          result.count[pred.class].qty++;
        }
        // }
      }

      model3 = await pbModel(imageObject.image);

      // structure
      if (model1 !== undefined && model3 !== undefined) {
        let models = model1.predictions;
        if (!isEmpty(standard) && !isCalibrate) {
          // model3.predictions = model3.predictions.filter(
          //   (pred) => pred.confidence >= 0.75
          // );
          models = model1.predictions.concat(model3.predictions);
          console.log("models ';';';'", models);
        }

        for (const [index, prediction] of models.entries()) {
          // if (prediction.confidence >= 0.5) {
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
          // }
        }
        const commonParents = ["table", "chair", "sofa"];
        let commonChildrens;
        commonChildrens = [
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

        for (const [outerIndex, first_object] of objects_temp.entries()) {
          objects_temp.forEach((second_object, innerIndex) => {
            const first_key = first_object.class;
            const second_key = second_object.class;
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
            if (first_object && second_object) {
              const result = calculateOverlap(
                first_object.prediction, // outer
                second_object.prediction // inner
              );
              if (result.overlap) {
                if (result.bigger === "first") {
                  if (
                    !commonParents.includes(first_key) ||
                    !commonChildrens.includes(second_key)
                  )
                    return;
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
                      result.overlapArea >
                      childObject_result?.result.overlapArea
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
                  if (
                    !commonParents.includes(second_key) ||
                    !commonChildrens.includes(first_key)
                  )
                    return;
                  if (first_object.indexFrom === undefined) {
                    first_object.indexFrom = innerIndex;
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
                    ParentObject.children.splice(
                      foundIndex,
                      1,
                      childObject_raw
                    );
                  }
                }
              }
            }
          });
        }
        // remove the items with indexFrom
        for (const [index, object] of objects_temp.entries()) {
          // console.log("object 11", object);
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
      if (model2 !== undefined) {
        const filteredOrder = model2.predictions.filter(
          (obj) => obj.class === "disorganized"
        );
        if (filteredOrder.length > 0)
          result.scores.set.unorganized += filteredOrder.length;
      }
    }

    // shine
    if (imageObject.forType === "all" || imageObject.forType === "std") {
      model5 = await yellowModel(imageObject.image);
      if (model5 !== undefined) {
        for (const obj of model5.predictions) {
          if (obj.class === "score") continue;
          result.scores.shine[obj.class]++;
        }
      }
    }

    predictions.push(prevModel1 !== model1 ? model1?.predictions : []);
    predictions.push(prevModel2 !== model2 ? model2?.predictions : []);
    predictions.push(prevModel3 !== model3 ? model3?.predictions : []);
    // predictions.push(prevModel4 !== model4 ? model4?.predictions : []);
    predictions.push(prevModel5 !== model5 ? model5?.predictions : []);
    result.predictions.push(predictions);
    prevModel1 = model1;
    prevModel2 = model2;
    prevModel3 = model3;
    // prevModel4 = model4;
    prevModel5 = model5;

    if (imageObject.forType === "all" && allFlag === 0) allFlag = 1;
    // end
  }
  console.log("before", objects);
  console.log("standard", standard);

  if (!isEmpty(standard) && !isCalibrate) {
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
    score(result, images.length);
  }
  if (isCalibrate) result.standard = JSON.stringify(objects);

  return result;
}
