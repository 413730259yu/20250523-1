let facemesh;
let video;
let predictions = [];
// 指定要連接的點的編號
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];

function setup() {
  // 建立並置中畫布
  let cnv = createCanvas(640, 480);
  centerCanvas(cnv);

  // 啟用視訊
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 facemesh
  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', gotResults);
}

function centerCanvas(cnv) {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas(canvas);
}

function modelReady() {
  console.log('Facemesh model loaded!');
}

function gotResults(results) {
  predictions = results;
}

function draw() {
  background(220);

  // 顯示視訊畫面
  image(video, 0, 0, width, height);

  // 畫出指定點的紅色粗線
  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    for (let i = 0; i < indices.length - 1; i++) {
      let idxA = indices[i];
      let idxB = indices[i + 1];
      let [x1, y1] = keypoints[idxA];
      let [x2, y2] = keypoints[idxB];
      line(x1, y1, x2, y2);
    }
  }
}
