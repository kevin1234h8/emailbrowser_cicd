export const getPath = (pathArray) => {
  let pathString = "";
  for (let i = 0; i < pathArray.length; i++) {
    pathString += pathArray[i].Name;
    if (i < pathArray.length - 1) {
      pathString += " / ";
    }
  }
  return pathString;
};
