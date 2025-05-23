let video;
let facemesh;
let predictions = [];
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];
const indices2 = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];

// 左眼點位編號
const leftEyeIndices = [243,190,56,28,27,29,30,247,130,25,110,24,23,22,26,112];

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  // 模型載入完成，可選擇顯示訊息
}

function drawLeftEyeLines(predictions) {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 畫綠色線條
    stroke(0, 255, 0);
    strokeWeight(2);
    for (let i = 0; i < leftEyeIndices.length - 1; i++) {
      const idxA = leftEyeIndices[i];
      const idxB = leftEyeIndices[i + 1];
      const [x1, y1] = keypoints[idxA];
      const [x2, y2] = keypoints[idxB];
      line(x1, y1, x2, y2);
    }
    // 串接最後一點到第一點
    const [xStart, yStart] = keypoints[leftEyeIndices[0]];
    const [xEnd, yEnd] = keypoints[leftEyeIndices[leftEyeIndices.length - 1]];
    line(xEnd, yEnd, xStart, yStart);

    // 計算外框
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    // 畫紅色方框
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(minX, minY, maxX - minX, maxY - minY);
  }
}

function drawLeftEyeFilled(predictions) {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 紅色填滿，綠色線條
    fill(255, 0, 0);
    stroke(0, 255, 0);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 計算外框
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    // 畫紅色方框
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(minX, minY, maxX - minX, maxY - minY);
  }
}

function draw() {
  // 鏡面反轉攝影機畫面
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 先畫第一組紅色線
    stroke(255, 0, 0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y); // X座標鏡像
    }
    endShape();

    // 再畫第二組紅色線並填滿黃色
    stroke(255, 0, 0);
    strokeWeight(2);
    fill(255, 255, 0, 200); // 半透明黃色
    beginShape();
    for (let i = 0; i < indices2.length; i++) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y); // X座標鏡像
    }
    endShape(CLOSE);

    // 在第一組與第二組之間充滿綠色
    fill(0, 255, 0, 150); // 半透明綠色
    noStroke();
    beginShape();
    // 先畫第一組
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y); // X座標鏡像
    }
    // 再畫第二組（反向，避免交錯）
    for (let i = indices2.length - 1; i >= 0; i--) {
      const idx = indices2[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y); // X座標鏡像
    }
    endShape(CLOSE);

    drawLeftEyeLinesMirror(predictions);
    drawLeftEyeFilledMirror(predictions);
  }
}

// 新增鏡像版本的左眼繪製
function drawLeftEyeLinesMirror(predictions) {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    stroke(0, 255, 0);
    strokeWeight(2);
    for (let i = 0; i < leftEyeIndices.length - 1; i++) {
      const idxA = leftEyeIndices[i];
      const idxB = leftEyeIndices[i + 1];
      const [x1, y1] = keypoints[idxA];
      const [x2, y2] = keypoints[idxB];
      line(width - x1, y1, width - x2, y2);
    }
    // 串接最後一點到第一點
    const [xStart, yStart] = keypoints[leftEyeIndices[0]];
    const [xEnd, yEnd] = keypoints[leftEyeIndices[leftEyeIndices.length - 1]];
    line(width - xEnd, yEnd, width - xStart, yStart);

    // 計算外框
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      const mx = width - x;
      if (mx < minX) minX = mx;
      if (y < minY) minY = y;
      if (mx > maxX) maxX = mx;
      if (y > maxY) maxY = y;
    }
    // 畫紅色方框
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(minX, minY, maxX - minX, maxY - minY);
  }
}

function drawLeftEyeFilledMirror(predictions) {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    fill(255, 0, 0);
    stroke(0, 255, 0);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      vertex(width - x, y);
    }
    endShape(CLOSE);

    // 計算外框
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < leftEyeIndices.length; i++) {
      const idx = leftEyeIndices[i];
      const [x, y] = keypoints[idx];
      const mx = width - x;
      if (mx < minX) minX = mx;
      if (y < minY) minY = y;
      if (mx > maxX) maxX = mx;
      if (y > maxY) maxY = y;
    }
    // 畫紅色方框
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(minX, minY, maxX - minX, maxY - minY);
  }
}
