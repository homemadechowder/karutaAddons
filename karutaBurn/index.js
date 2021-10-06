// eslint-disable-next-line no-undef
module.exports = function karutaBurn(tag, string, ed = 1) {
  let resultString = `kt ${tag} `;
  const valid = new RegExp("[a-z0-9]");
  const splitByLine = string.split("\n");
  splitByLine.forEach((line, i) => {
    const lineArr = line.split("`").join("").split("**");
    if (i === 0 || i === 1) {
      return;
    }
    const star = lineArr[2].split(" · ")[3];

    if (ed !== "*") {
      if (star !== `◈${ed}`) {
        return;
      }
    }

    if (valid.test(lineArr[1])) {
      resultString += lineArr[1].trim() + " ";
    } else {
      throw lineArr[1];
    }
  });
  return resultString;
};
