export function removeProperties(obj, propertiesToRemove) {
  const seen = new WeakSet();

  function remove(obj) {
    if (typeof obj === "object" && obj !== null) {
      if (seen.has(obj)) return;
      seen.add(obj);
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            remove(item);
          }
        });
      } else {
        Object.keys(obj).forEach((key) => {
          if (propertiesToRemove.includes(key)) {
            delete obj[key];
          } else {
            remove(obj[key]);
          }
        });
      }
    }
  }

  remove(obj);
  return obj;
}
