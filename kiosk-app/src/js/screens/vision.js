import fludetector from './fludetector';

const vision = (() => {
  let video = null;
  let width = null;
  let height = null;
  let canvas = null;
  let image = null;
  let qvga = {width: {exact: 320}, height: {exact: 240}};
  let vga = {width: {exact: 640}, height: {exact: 480}};
  let resolution = window.innerWidth < 640 ? qvga : vga;
  let stream = null;
  let vidCapture = null;
  let visionSrc = null;
  let dst1 = null;

  let lowRangeRed = [170, 80, 80, 0];
  let highRangeRed = [180, 255, 255, 255];
  let lowRangeGreen = [30, 50, 50, 0];
  let highRangeGreen = [50, 255, 255, 255];
  let lowRangeBlue = [110, 60, 60, 0];
  let highRangeBlue = [130, 255, 255, 255];
  window.win = null;

  {/* Booleans*/}
  let streaming = false;

  let hsv = (src) => {
    let dst = new window.cv.Mat();
    let dst2 = new window.cv.Mat();
    window.cv.cvtColor(visionSrc, dst, window.cv.COLOR_RGBA2RGB);
    window.cv.cvtColor(dst, dst2, window.cv.COLOR_RGB2HSV);
    dst.delete();
    return dst2;
  }

  let startProcessing = () => {
    stopProcessing();
    visionSrc = new window.cv.Mat(height, width, window.cv.CV_8UC4);
    dst1 = new window.cv.Mat(height, width, window.cv.CV_8UC1);
    requestAnimationFrame(process);
  }

  let stopProcessing = () => {
    if (visionSrc != null && !visionSrc.isDeleted()) visionSrc.delete();
    if (dst1 != null && !dst1.isDeleted()) dst1.delete();
  }

  let process = () => {
    vidCapture.read(visionSrc);
    let result = hsv(visionSrc);

    let redSrc = getRed(result);
    let greenSrc = getGreen(result);
    let blueSrc = getBlue(result);

    let xMid = result.cols/2;
    let xDelta = 75;
    let point1 = new window.cv.Point(xMid - xDelta, 0);
    let point2 = new window.cv.Point(xMid + xDelta, result.rows);
    window.cv.rectangle(visionSrc, point1, point2, [0, 255, 0, 255], 3);
//commented out becuase canvases not included in VASCi website
    //window.win = window.cv.imshow("src", visionSrc);
    //window.cv.imshow("canvas1", redSrc);
    //window.cv.imshow("canvas2", greenSrc);
    //window.cv.imshow("canvas3", blueSrc);

    redSrc.delete();
    greenSrc.delete();
    blueSrc.delete();
    result.delete();

    setTimeout(function(){requestAnimationFrame(process)}, 500);
  }

  let getRed = (src) => {
    let result = hsv(src);
    result = inRange(result, lowRangeRed, highRangeRed);
    return result;
  }

  let getGreen = (src) => {
    let result = hsv(src);
    result = inRange(result, lowRangeGreen, highRangeGreen);
    return result;
  }

  let getBlue = (src) => {
    let result = hsv(src);
    result = inRange(result, lowRangeBlue, highRangeBlue);
    return result;
  }

  let inRange = (src, low, high) => {
    let dst = new window.cv.Mat();
    let l = new window.cv.Mat(src.rows, src.cols, src.type(), low);
    let h = new window.cv.Mat(src.rows, src.cols, src.type(), high);
    window.cv.inRange(src, l, h, dst);
    return dst;
  }

  let getResult = () => {
    let image = hsv(visionSrc);
    let redDst = getRed(image);
    let greenDst = getGreen(image);
    let blueDst = getBlue(image);

    let diagnosis = fludetector.test(redDst, greenDst, blueDst);
    if (diagnosis == 'Inconclusive'){
      alert("Inconclusive, please realign the strip and test again.");
      return diagnosis;
    } else {
      return diagnosis;
    }
  }

  let updateSize = () => {
    width = video.videoWidth;
    height = video.videoHeight;
    video.width = width;
    video.height = height;
//commented out becuase canvases not included in VASCi website
    //canvas.width = width;
    //canvas.height = height;
  }

  let startCamera = (videoID, canvasID) => {
    console.log("vision started")
    video = document.getElementById(videoID);
    canvas = document.getElementById(canvasID);
    image = document.getElementById("image");

    navigator.mediaDevices.getUserMedia({video: resolution, audio: false})
      .then(function(s) {
        console.log("got media")
        stream = s;
        video.srcObject = s;
        video.play();
    }).catch(function(err) {
      console.log("An error occured! " + err);
    })

    video.addEventListener("canplay", function(ev){
      if(!streaming) {
        console.log("start streaming")
        updateSize()
        streaming = true;
        vidCapture = new window.cv.VideoCapture(video);
        startProcessing();
      }
    }, false)

    return {"video": video, "canvas": canvas, "image": image}
  }

  return {
      startCamera: startCamera,
      getResult: getResult
  }

})();

export default vision;
