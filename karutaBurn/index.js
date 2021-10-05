module.exports = function karutaBurn(tag, string){
    let resultString = `kt ${tag} `;
    const valid = new RegExp('[a-z0-9]');
    const splitByLine = string.split('\n')
    splitByLine.forEach((line,i)=>{
       const lineArr = line.split('`').join('').split('**');
       if (i === 0 || i === 1){
           return;
       }
       if (valid.test(lineArr[1])){
            resultString += lineArr[1].trim() + ' ';
       } else {
           throw lineArr[1];
       }
    });
    return resultString;
}

