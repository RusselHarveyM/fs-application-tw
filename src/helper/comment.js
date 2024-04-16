const COMMENT_FORMAT = {
  summary: "Summary: The model found  ",
  thingsToImprove: "Things to improve: ",
};

//EXAMPLE
//   {
//     set: {
//       aircon: 0;
//       chairs: 38;
//       desks: 43;
//       disorganizedRow: 5;
//       exhaust: 0;
//       organization: 3.75;
//       organizedRow: 3;
//       score: 2.375;
//       ventilation: 0;
//     }
//     shine: {
//       adhesives: 0;
//       damage: 1;
//       dirt: 0;
//       dust: 0;
//       litter: 1;
//       score: 9.375;
//       smudge: 0;
//       stain: 0;
//     }
//     sort: {
//       cabinet: 0;
//       clutter: 10.5;
//       danglings: 0;
//       drawer: 0;
//       score: 7;
//       shelf: 0;
//       wasteDisposal: 0;
//     }
//   }

export default function commentFormatter(comment) {
  let comments = {
    sort: "",
    set: "",
    shine: "",
  };
  let writeFlag = {
    sort: 0,
    set: 0,
    shine: 0,
  };
  for (const category in comment) {
    let commentFormat = { ...COMMENT_FORMAT };
    for (const property in comment[category]) {
      if (comment[category][property] > 0) {
        if (
          property === "clutter" ||
          property === "organizedRow" ||
          property === "score" ||
          property === "organization"
        ) {
          continue;
        }
        writeFlag[category] = 1;

        if (property === "disorganizedRow") {
          commentFormat.summary += `${comment[category][property]} disorganized rows of tables/chairs, `;
          commentFormat.thingsToImprove += `* organization of chairs/desks\n`;
          continue;
        }
        if (property === "litter") {
          commentFormat.thingsToImprove += `* remove litters \n`;
        }
        if (property === "damage") {
          commentFormat.thingsToImprove += `* fix damages found on tables/chairs/walls \n`;
        }
        commentFormat.summary += `${comment[category][property]} ${property}, `;
      }
    }

    console.log("writeFlag >> ", writeFlag);
    console.log("category >> ", category);
    if (writeFlag[category] === 0) {
      if (category === "shine" && writeFlag["set"] === 0) {
        comments.sort =
          "Summary: Is this even an image of a room? Please try again. \n Things to improve:";
        comments.set =
          "Summary: Is this even an image of a room? Please try again. \n Things to improve:";
        comments.shine =
          "Summary: Is this even an image of a room? Please try again. \n Things to improve:";
        continue;
      } else {
        if (category === "sort") {
          commentFormat.summary = `Summary: The model found a well kept space  `;
        } else if (category === "shine") {
          commentFormat.summary = "Summary: The model found a shiny space  ";
        }
      }
    }
    let summary = commentFormat.summary.slice(0, -2);
    summary += ".";

    commentFormat.summary = summary;
    comments[category] =
      commentFormat.summary + " \n " + commentFormat.thingsToImprove;
  }

  console.log("comments >>> ", comments);

  // Remove the trailing comma and space

  return comments;
}
