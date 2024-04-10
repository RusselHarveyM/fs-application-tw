import axios from "axios";

const API_KEY = "OeSBdrSNcfGEme3a9fDf";

const SORT = {
  wasteDisposal: 0,
  clutter: 0,
  cabinet: 0,
  danglings: 0,
  drawer: 0,
  shelf: 0,
  score: 0,
};

const SET = {
  chairs: 0,
  desks: 0,
  disorganizedRow: 0,
  organizedRow: 0,
  organization: 0,
  ventilation: 0,
  aircon: 0,
  exhaust: 0,
  score: 0,
};

const SHINE = {
  adhesives: 0,
  damage: 0,
  dirt: 0,
  dust: 0,
  litter: 0,
  smudge: 0,
  stain: 0,
  score: 0,
};

async function countDesksChairs(image) {
  let response = {
    predictions: [],
  };
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-count-det/8",
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
  return {
    count: response.predictions.length,
    data: response,
    predictions: response.predictions,
  };
}

async function organizationCheck(image, set) {
  let prediction;
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-order-seg/9",
    params: {
      api_key: API_KEY,
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (res) {
      prediction = res.data.predictions;
      console.log("organize check >>>", res.data);
      res.data.predictions.map((prediction) => {
        if (prediction.class === "disorganized") set.disorganizedRow++;
        if (prediction.class === "organized") set.organizedRow++;
      });
    })
    .catch(function (error) {
      console.log(error.message);
    });
  let overall = set.organizedRow + set.disorganizedRow;
  set.organization = (set.organizedRow / overall) * 10;
  return prediction;
}

async function personalBelongingsCheck(image) {
  let response = {
    predictions: [],
  };
  let predictions;
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-3igmn/11",
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
      predictions = res.data.predictions;
      console.log("personalBelongings check >>> ", res.data);
    })
    .catch(function (error) {
      console.log(error.message);
    });

  let personalBelongings = response.predictions.filter(
    (pred) => pred.class === "personal belongings"
  );
  return { personalBelongings, predictions };
}

async function blueDetection(image, sort, set) {
  let response = {
    predictions: [],
  };
  let predictions;

  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-blue-det/2",
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
      predictions = res.data.predictions;
    })
    .catch(function (error) {
      console.log(error.message);
    });
  response.predictions.forEach((prediction) => {
    console.log("blue prediction foreach", prediction);
    if (prediction.class == "trashcan") sort.wasteDisposal++;
    if (prediction.class == "cabinet") sort.cabinet++;
    if (prediction.class == "dangling wire/cable") sort.danginglings++;
    if (prediction.class == "drawer") sort.drawer++;
    if (prediction.class == "shelf") sort.shelf++;
    if (prediction.class == "aircon") set.aircon++;
    if (prediction.class == "exhaust fan") set.exhaust++;
    if (prediction.class == "ventilation") set.ventilation++;
  });
  return predictions;
}

async function cleanlinessDetection(image, shine) {
  let response = {
    predictions: [],
  };
  let prediction;
  await axios({
    method: "POST",
    url: "https://detect.roboflow.com/classroom-yellow-seg/7",
    params: {
      api_key: API_KEY,
    },
    data: image,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (res) {
      prediction = res.data.predictions;
      console.log("cleanliness detection >>> ", res.data);
      response = res.data;
    })
    .catch(function (error) {
      console.log(error.message);
    });
  response.predictions.forEach((prediction) => {
    console.log("clean prediction foreach", prediction);
    if (prediction.class == "adhesive") shine.adhesives++;
    if (prediction.class == "damage") shine.damage++;
    if (prediction.class == "litter") shine.litter++;
  });

  return prediction;
}

function isCluttered(dcObjects, pbObjects) {
  let clutteredStatus = [];

  const PBObjects = pbObjects;
  if (PBObjects.length === 0 || dcObjects.length === 0) return clutteredStatus;

  console.log(" PBObjects>>>> ??? ", PBObjects);
  console.log(" dcObjects>>>> ??? ", dcObjects);

  PBObjects.forEach((pbObject) => {
    dcObjects.forEach((dcObject) => {
      if (
        pbObject.x < dcObject.x + dcObject.width &&
        pbObject.x + pbObject.width > dcObject.x &&
        pbObject.y < dcObject.y + dcObject.height &&
        pbObject.y + pbObject.height > dcObject.y
      ) {
        clutteredStatus.push(dcObject);
      }
    });
  });

  return clutteredStatus;
}

async function computeScores(s3, isClutterResults) {
  const trashCanRecommendedNo = 3;
  const cabinetRecommendedNo = 1;
  const danglings = 0;

  const idealOrganization = 10;
  const idealAEV = 1;

  let clutterNo = isClutterResults.length;
  s3.sort.clutter = clutterNo;

  console.log("clutter numbers >>>>> ", clutterNo);

  let sort = s3.sort;
  let set = s3.set;
  let shine = s3.shine;

  //sort score
  const cabinetScore = Math.min(sort.cabinet, cabinetRecommendedNo) * 1;
  const clutterScore = (sort.clutter === 0 ? 1 : 0) * 2;
  const danglingsScore = (sort.danglings === danglings ? 1 : 0) * 6;
  const wasteDisposalScore =
    Math.min(sort.wasteDisposal, trashCanRecommendedNo) * 1;

  const sortScore =
    ((cabinetScore + clutterScore + danglingsScore + wasteDisposalScore) / 10) *
    10;

  //set score
  // const organizationScore = (set.organization / idealOrganization) * 8;
  const atLeastOneHVACScore =
    (set.aircon + set.exhaust + set.ventilation >= idealAEV ? 1 : 0) * 2;

  const setScore = Math.max(
    ((set.organization + atLeastOneHVACScore) / 10) * 10,
    1
  );

  // shine score
  // const totalCount = Object.values(shine).reduce((total, c) => total + c, 0);
  // const maxCount = Math.max(...Object.values(shine));

  // Calculate the score based on the distance from zero
  const shineScore = Object.values(shine).reduce((total, c) => total + c, 0);
  const maxScore = Object.keys(shine).length;
  const normalizedShineScore = maxScore - shineScore;
  const scaledShineScore = (normalizedShineScore / maxScore) * 10;
  // Normalize the score to be between 0 and 1

  // Scale the score to be between 1 and 10

  s3.sort.score = sortScore;
  s3.set.score = setScore;
  s3.shine.score = scaledShineScore >= 0 ? scaledShineScore : 0;

  return s3;
}

export default async function evaluate(images) {
  const s3Results = [];

  let overalls3 = {
    sort: { ...SORT },
    set: { ...SET },
    shine: { ...SHINE },
  };

  let allPredictions = [];

  let organizationCountImage = 0;
  let length = images[0].length;

  // let organizeScore = 0;

  // Loop through the images array
  for (let index = 0; index < length; index++) {
    let sort = { ...SORT };
    let set = { ...SET };
    let shine = { ...SHINE };
    let predictionsPoints = [];

    const image = images[0][index];

    const count = await countDesksChairs(image);
    predictionsPoints.push(count.predictions);
    const predictions = count.data.predictions;
    console.log("count {}{}{}{}{}{}", count);
    predictions.map((prediction) => {
      console.log("prediction.class >>>> ", prediction.class);
      if (prediction.class == "desk") set.desks++;
      if (prediction.class == "chair") set.chairs++;
    });

    if (count.count >= 10) {
      predictionsPoints.push(await organizationCheck(image, set));
      // organizeScore += set.organization;
      organizationCountImage++;
    }
    predictionsPoints.push(await blueDetection(image, sort, set));
    const pb_result_temp = await personalBelongingsCheck(image);
    predictionsPoints.push(pb_result_temp.predictions);
    const pb_result = pb_result_temp.personalBelongings;
    const ic_result = isCluttered(predictions, pb_result);
    predictionsPoints.push(await cleanlinessDetection(image, shine));
    let s3 = {
      sort: sort,
      set: set,
      shine: shine,
    };

    const s3Result = await computeScores(s3, ic_result);
    s3Results.push(s3Result);
    // Calculate overall scores and add them to overalls3
    for (let prop in sort) {
      overalls3.sort[prop] += sort[prop];
    }
    for (let prop in set) {
      overalls3.set[prop] += set[prop];
    }
    for (let prop in shine) {
      overalls3.shine[prop] += shine[prop];
    }
    allPredictions.push(predictionsPoints);
  }
  overalls3.sort.score /= length;
  overalls3.sort.clutter /= length;

  overalls3.set.score /= length;
  overalls3.set.organization /=
    organizationCountImage !== 0 ? organizationCountImage : 0;

  overalls3.shine.score /= length;

  console.log("srResultsssss >>>>> ", s3Results);
  return {
    result: overalls3,
    predictions: allPredictions,
  };
}
