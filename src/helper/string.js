export function isEmpty(string) {
  if (string === "" || string === undefined || string === null) return true;
  return false;
}

export function getColor(name) {
  const pb = [
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

  const yellow = ["litter", "smudges"];

  const blue = ["electronics", "aircon"];

  return name === "chair"
    ? "purple"
    : name === "sofa"
    ? "pink"
    : name === "table"
    ? "violet"
    : yellow.includes(name)
    ? "yellow"
    : name === "basket" || name === "pot"
    ? "neutral"
    : pb.includes(name)
    ? "lime"
    : name === "disorganized"
    ? "red"
    : name === "organized"
    ? "green"
    : blue.includes(name)
    ? "blue"
    : undefined;
}
