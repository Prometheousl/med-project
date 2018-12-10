const fludetector = (() => {
  let test = (redDst, greenDst, blueDst) => {
    let x1 = 160
    let x2 = 480
    let y1 = 50
    let y2 = 450
    let redBool = redPercent(redDst, x1, x2, y1, y2);
    let greenBool = greenPercent(greenDst, x1, x2, y1, y2);
    let blueBool = bluePercent(blueDst, x1, x2, y1, y2);
    let result;
    let exp;

    if (redBool && greenBool && blueBool) {
      exp = 'AB';
    } else if (redBool && greenBool){
      exp = 'A';
    } else if (greenBool && blueBool){
      exp = 'B';
    } else if (greenBool){
      exp = 'N';
    } else {
      exp = 'Z'
    }

    switch(exp){
      case 'A':
        result = "Flu A";
        break;
      case 'B':
        result = "Flu B";
        break;
      case 'AB':
        result = "Flu AB";
        break;
      case 'N':
        result = "No Flu";
        break;
      case 'Z':
        result = "Inconclusive";
        break;
      default:
        result = "Default";
    }
    return result;
  }

  let redPercent = (dstR, x1, x2, y1, y2) => {
    let numOfRows = y2 - y1;
    let numOfCols = x2 - x1;
    let numerator = 0;
    let rowArray = null;
    for (let i = y1; i < numOfRows; i++){
      rowArray = dstR.row(i).data
      for (let j = x1; j < numOfCols; j++){
        if (rowArray[j] > 0)
          numerator++;
      }
    }
    let result = ((numerator/numOfCols) * 100);
    if (result > 20) {    // % temperary threshold
      return true;
    } else {
      return false;
    }
  }

  let greenPercent = (dstG, x1, x2, y1, y2) => {
    let numOfRows = y2 - y1;
    let numOfCols = x2 - x1;
    let numerator = 0;
    let rowArray = null;
    for (let i = y1; i < numOfRows; i++){
      rowArray = dstG.row(i).data
      for (let j = x1; j < numOfCols; j++){
        if (rowArray[j] > 0)
          numerator++;
      }
    }
    let result = ((numerator/numOfCols) * 100);
    if (result > 20) {    // % temperary threshold
      return true;
    } else {
      return false;
    }
  }

  let bluePercent = (dstB, x1, x2, y1, y2) => {
    let numOfRows = y2 - y1;
    let numOfCols = x2 - x1;
    let numerator = 0;
    let rowArray = null;
    for (let i = y1; i < numOfRows; i++){
      rowArray = dstB.row(i).data
      for (let j = x1; j < numOfCols; j++){
        if (rowArray[j] > 0)
          numerator++;
      }
    }
    let result = ((numerator/numOfCols) * 100);
    if (result > 20) {    // % temperary threshold
      return true;
    } else {
      return false;
    }
  }

  return {
      test: test
  }

}) ();

export default fludetector;
