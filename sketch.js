let facemesh;
let video;
let predictions = [];
let canvas; // 新增 canvas 變數
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];
const indices2 = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];

function setup() {
  // 建立並置中畫布
  canvas = createCanvas(640, 480);
  centerCanvas();

  // 啟用視訊
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 facemesh（注意大小寫）
  facemesh = ml5.faceMesh(video, modelReady);
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function modelReady() {
  console.log('Facemesh model loaded!');
  facemesh.predict(gotResults); // 正確啟動預測
}

function gotResults(results) {
  predictions = results;
  facemesh.predict(gotResults); // 持續預測
}

function draw() {
  background(220);

  // 顯示視訊畫面
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;

    // 取得第一組與第二組點的座標
    let pts1 = indices.map(idx => keypoints[idx]);
    let pts2 = indices2.map(idx => keypoints[idx]);

    // 畫出第一組與第二組之間的綠色區域
    fill(0, 255, 0, 150); // 半透明綠色
    noStroke();
    beginShape();
    for (let pt of pts1) {
      vertex(pt[0], pt[1]);
    }
    for (let i = pts2.length - 1; i >= 0; i--) {
      vertex(pts2[i][0], pts2[i][1]);
    }
    endShape(CLOSE);

    // 畫出第一組紅色粗線
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    for (let i = 0; i < pts1.length - 1; i++) {
      line(pts1[i][0], pts1[i][1], pts1[i + 1][0], pts1[i + 1][1]);
    }

    // 畫出第二組藍色細線（可依需求調整顏色）
    stroke(0, 0, 255);
    strokeWeight(8);
    for (let i = 0; i < pts2.length - 1; i++) {
      line(pts2[i][0], pts2[i][1], pts2[i + 1][0], pts2[i + 1][1]);
    }
  }
}
