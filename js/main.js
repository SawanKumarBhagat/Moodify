const video = document.getElementById("video");
const isScreenSmall = window.matchMedia("(max-width: 700px)");
const btn = document.getElementById("btn");
let predictedAges = [];

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (video.srcObject = stream),
    err => console.error(err)
  );
}
function screenResize(isScreenSmall) {
  if (isScreenSmall.matches) {
    // If media query matches
    video.style.width = "320px";
  } else {
    video.style.width = "500px";
  }
}

screenResize(isScreenSmall); // Call listener function at run time
isScreenSmall.addListener(screenResize);

video.addEventListener("playing", () => {
  console.log("playing called");
  const canvas = faceapi.createCanvasFromMedia(video);
  let container = document.querySelector(".container");
  container.append(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    console.log(resizedDetections);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    if (resizedDetections && Object.keys(resizedDetections).length > 0) {
      const expressions = resizedDetections.expressions;
      const maxValue = Math.max(...Object.values(expressions));
      const emotion = Object.keys(expressions).filter(
        item => expressions[item] === maxValue
      );
      const em = emotion[0];
      console.log(em);
      document.getElementById("loading").classList.remove("hide");
      if(em == "neutral"){
        document.getElementById("emotion").innerText = `So, your current emotion is NEUTRAL. We recommend you to listen to this playlist specially made for you.`;
        document.getElementById("playlist").href = `https://www.youtube.com/watch?v=_ae2j9jZY_U`;
        document.getElementById("playlist-icon").classList.remove("playlist-icon");
      }
      else if(em == "sad"){
        document.getElementById("emotion").innerText = `So, your current emotion is SAD. We recommend you to listen to this playlist specially made for you.`;
        document.getElementById("playlist").href = `https://www.youtube.com/watch?v=CveANi17YfU&list=PL3-sRm8xAzY-w9GS19pLXMyFRTuJcuUjy`;
        document.getElementById("playlist-icon").classList.remove("playlist-icon");
      }
      else if(em == "happy"){
        document.getElementById("emotion").innerText = `So, your current emotion is HAPPY. We recommend you to listen to this playlist specially made for you.`;
        document.getElementById("playlist").href = `https://www.youtube.com/watch?v=JGwWNGJdvx8&list=PLAQ7nLSEnhWTEihjeM1I-ToPDJEKfZHZu`;
        document.getElementById("playlist-icon").classList.remove("playlist-icon");
      }
      else if(em == "surprised"){
        document.getElementById("emotion").innerText = `So, your current emotion is SURPRISED. We recommend you to listen to this playlist specially made for you.`;
        document.getElementById("playlist").href = `https://www.youtube.com/watch?v=CveANi17YfU&list=PL3-sRm8xAzY-w9GS19pLXMyFRTuJcuUjy`;
        document.getElementById("playlist-icon").classList.remove("playlist-icon");
      }
      else if(em == "angry"){
        document.getElementById("emotion").innerText = `So, your current emotion is ANGRY. We recommend you to listen to this playlist specially made for you.`;
        document.getElementById("playlist").href = `https://www.youtube.com/watch?v=RBumgq5yVrA&list=PL7v1FHGMOadDghZ1m-jEIUnVUsGMT9jbH`;
        document.getElementById("playlist-icon").classList.remove("playlist-icon");
      }
    }
  }, 10);
});