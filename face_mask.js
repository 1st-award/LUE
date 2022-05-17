
/* 눈썹 및 입술 화장 프로그램
 * 안면 인식 코드를 활용한 유저 커스텀 색상 변경
 * mouth, eyebrow버튼을 클릭하여 원하는 색상으로 눈썹 및 입술 색 변경 가능
 * 명도 또한 변경 가능하여 색상의 명도 조절 가능
 * 왼쪽엔 적용된 색상을 사진에 입혀볼 수 있음
 * 오른쪽에 색상을 미리 볼 수 있음
 */
let img, parts;
let options = {withLandmarks: true, withDescriptors: false};
let colorR, colorG, colorB, colorRT, colorGT, colorBT;
let colorMouthR, colorMouthG, colorMouthB;
let colorMouthPR, colorMouthPG, colorMouthPB;
let colorEyeBrowR, colorEyeBrowG, colorEyeBrowB;
let colorEyeBrowPR, colorEyeBrowPG, colorEyeBrowPB;
let mouthBrightness, eyeBrowBrightness;
let selectParts;
let bright;
let selectColorActivate = 0;
let bright;
const SELECT_MOUTH = 0;
const SELECT_EYEBROW = 1;
const ENABLE = 1;


function preload() {
    imgColor = loadImage('color.png');
    imgFace = loadImage('face.png');
}

function setup() {
    if(imgFace.height < 292){
      createCanvas(imgFace.width + 320, 292);
    }
    else{
        createCanvas(imgFace.width + 320, imgFace.height);
    }
    faceapi = ml5.faceApi(options, modelReady);
    background(255);
    textSize(10);
    image(imgFace, 0, 0);
    image(imgColor, imgFace.width, 0);
    colorMouthR = 237, colorMouthG = 34, colorMouthB = 93;
    colorMouthPR = 237, colorMouthPG = 34, colorMouthPB = 93;
    colorEyeBrowR = 0, colorEyeBrowG = 0, colorEyeBrowB = 0;
    colorEyeBrowPR = 0, colorEyeBrowPG = 0, colorEyeBrowPB = 0;
    mouthBrightness = 255, eyeBrowBrightness = 255;
    button = new Button();
    bright = new Brightness(imgFace.width, imgColor.height);
}

function draw() {
    noStroke(0, 0, 255);
    button.drawButton();
    if (selectColorActivate == ENABLE) {
        // 결과 출력 후 색 변환 활성화
        if (selectParts == SELECT_MOUTH) {
            // 선택한 버튼이 입술일 때 명도 및 색상 변경
            if (mouseIsPressed) {
                if (bright.brightnessIsPressed()) {
                    // 명도 블럭이 눌렸을 때 명도 변경
                    mouthBrightness = bright.getBrightness();
                }
                selectColor(selectParts, imgFace.width, 0, mouthBrightness);
            }
        }
        if (selectParts == SELECT_EYEBROW) {
            // 선택한 버튼이 눈썹일 때 명도 및 색상 변경
            if (mouseIsPressed) {
                if (bright.brightnessIsPressed()) {
                    // 명도 블럭이 눌렸을 때 명도 변경
                    eyeBrowBrightness = bright.getBrightness();
                }
                selectColor(selectParts, imgFace.width, 0, eyeBrowBrightness);
            }
        }
        // 색상변경 후 입술, 눈썹(왼쪽, 오른쪽) 재 출력
        paintMouth(parts.mouth);
        paintEyeBrow(parts.leftEyeBrow);
        paintEyeBrow(parts.rightEyeBrow);
    }
}

function modelReady() {
    // 안면 인식 이벤트
    faceapi.detectSingle(imgFace, gotResults);
}

function gotResults(err, results) {
    // 안면 인식 후 기본 색칠 및 출력
    if (err) {
        console.error(err);
        return;
    }
    console.log(results);
    parts = results.parts;
    noFill();
    strokeWeight(3);
    paintMouth(parts.mouth);
    paintEyeBrow(parts.leftEyeBrow);
    paintEyeBrow(parts.rightEyeBrow);
    selectColorActivate = ENABLE;
}

function paintEyeBrow(part) {
    // 눈 색칠 함수
    push();
    stroke(colorEyeBrowR, colorEyeBrowG, colorEyeBrowB);
    fill(colorEyeBrowR, colorEyeBrowG, colorEyeBrowB);
    beginShape();
    for (var i = 0; i < 5; i++) {
        vertex(part[i]._x, part[i]._y);
    }
    endShape(CLOSE);
    pop();
}

function paintMouth(part) {
    // 입술 색칠 함수
    push();
    stroke(colorMouthR, colorMouthG, colorMouthB);
    fill(colorMouthR, colorMouthG, colorMouthB);
    beginShape();
    for (var i = 0; i < 7; i++) {        
        vertex(part[i]._x, part[i]._y);
    }
    for (i = 16; i > 11; i--) {            
        vertex(part[i]._x, part[i]._y);
    }
    endShape(CLOSE);
    beginShape();
    for (i = 6; i < 13; i++) {            
        vertex(part[i]._x, part[i]._y);
    }
    for (i = 20; i > 15; i--) {            
        vertex(part[i % 20]._x, part[i % 20]._y);
    }
    endShape(CLOSE);
    pop();
}

class Brightness {
    constructor(_width, _height) {
      // 맴버 변수
      this.width = _width;
      this.height = _height;
      // 명도 블록 생성
    /* 명도 클래스
     * 이미지의 길이와 높이를 입력받아 width, height로 사용
     */
    constructor(_width, _height) {
        // 맴버 변수
        this.width = _width;
        this.height = _height;
        // 명도 블럭 생성
        push();
        stroke(0, 0, 255);
        rect(this.width + 5, this.height + 15, 255, 45)
        for (var i = 0; i < 256; i++) {
            stroke(i);
            line(this.width + 5 + i, this.height + 15, this.width + 5 + i, this.height + 60);
        }
        pop();
    }

    brightnessIsPressed() {
        // 명도 블럭 범위에 마우스가 입력됐으면 true. 아니면 false
        if (mouseX >= this.width + 5 && mouseX <= this.width + 260 &&
            mouseY >= this.height + 15 && mouseY <= this.height + 60) {
            return true;
        }
        return false;
    }

    getBrightness() {
        // 마우스 위치에 따라 명도 0 ~ 255 return
        let brightness = map(mouseX, imgFace.width + 5, imgFace.width + 260, 0, 255);
        return brightness;
    }
}

function selectColor(selectPart, posX, posY, brightness) {
    // 색 선택 알고리즘
    if (dist(mouseX, mouseY, imgColor.width / 2 + posX, imgColor.height / 2 + posY) < imgColor.width / 2) {
        // 마우스가 imgColor에 있을 때 R,G,B 지점으로 부터의 거리 측정
        colorR = dist(imgColor.width / 2 + posX, imgColor.height + posY, mouseX, mouseY);
        colorG = dist(imgColor.width / 2 * (1 - sqrt(3) / 2) + posX, imgColor.height / 2 / 2 + posY, mouseX, mouseY);
        colorB = dist(imgColor.width / 2 * (1 + sqrt(3) / 2) + posX, imgColor.height / 2 / 2 + posY, mouseX, mouseY);
        if (colorR > imgColor.height / 2) {
            // colorR이 원의 중심까지의 길이보다 멀면 255~0으로 설정
            colorR = map(colorR, imgColor.height / 2, imgColor.height, 255, 0);
            colorRT = colorR;
        } else {
            // colorR이 원의 중심까지의 길이보다 가까우면 255로 설정
            colorR = 255;
            colorRT = colorR;
        }
        if (colorG > imgColor.height / 2) {
            // colorG가 원의 중심까지의 길이보다 멀면 255~0으로 설정
            colorG = map(colorG, imgColor.height / 2, imgColor.height, 255, 0);
            colorGT = colorG;
        } else {
            // colorG가 원의 중심까지의 길이보다 가까우면 255로 설정
            colorG = 255;
            colorGT = colorG;
        }
        if (colorB > imgColor.height / 2) {
            // colorB가 원의 중심까지의 길이보다 멀면 255~0으로 설정
            colorB = 255;
            colorBT = colorB;
        } else {
            // colorB가 원의 중심까지의 길이보다 가까우면 255로 설정
            colorB = map(colorB, 0, imgColor.height / 2, 255, 255);
            colorBT = colorB;
        }
    }
    if (dist(mouseX, mouseY, imgColor.width / 2 + posX, imgColor.height / 2 + posY) < imgColor.width / 2 || bright.brightnessIsPressed() === true) {
    //마우스가 imgColor 내에 있거나 명도 안에 있을 때 실행
        if (brightness != 255) {
            //명도가 255가 아니라면 명도에 따른 색 조절
            if (colorR == 255) {
                colorRT = brightness;
            } else {
                colorRT = map(colorR, 255, 0, brightness, 0);
            }
            if (colorG == 255) {
                colorGT = brightness;
            } else {
                colorGT = map(colorG, 255, 0, brightness, 0);
            }
            if (colorB == 255) {
                colorBT = brightness;
            } else {
                colorBT = map(colorB, 255, 0, brightness, 0);
            }
        }
    }
    if (selectPart == SELECT_MOUTH) {
        // 선택된 버튼이 입술일 때, 선택한 색상을 입술 변수에 저장
        colorMouthR = colorRT;
        colorMouthG = colorGT;
        colorMouthB = colorBT;
        colorMouthPR = colorR;
        colorMouthPG = colorG;
        colorMouthPB = colorB;
        drawColorNum(colorMouthR, colorMouthG, colorMouthB, brightness);
    }
    if (selectPart == SELECT_EYEBROW) {
        // 선택된 버튼이 눈썹일 때, 선택한 색상을 눈썹 변수에 저장
        colorEyeBrowR = colorRT;
        colorEyeBrowG = colorGT;
        colorEyeBrowB = colorBT;
        colorEyeBrowPR = colorR;
        colorEyeBrowPG = colorG;
        colorEyeBrowPB = colorB;
        drawColorNum(colorEyeBrowR, colorEyeBrowG, colorEyeBrowB, brightness);
    }
}

function drawColorNum(colorTR, colorTG, colorTB, brightness) {
    // 선택한 색 미리보기 도형 출력
    stroke(0);
    fill(colorR, colorG, colorB);
    rect(imgFace.width + imgColor.width + 10, 50, 55, 55);
    fill(colorTR, colorTG, colorTB)
    rect(imgFace.width + imgColor.width + 10, 105, 55, 55);
    fill(brightness);
    rect(imgFace.width + imgColor.width + 10, 160, 55, 55);
    noStroke();
    fill(255);
    rect(imgFace.width + imgColor.width + 70, 50, 40, 200);
    fill(0);
    text(colorR, imgFace.width + imgColor.width + 70, 65);
    text(colorG, imgFace.width + imgColor.width + 70, 80);
    text(colorB, imgFace.width + imgColor.width + 70, 95);
    text(colorTR, imgFace.width + imgColor.width + 70, 55 + 65);
    text(colorTG, imgFace.width + imgColor.width + 70, 55 + 80);
    text(colorTB, imgFace.width + imgColor.width + 70, 55 + 95);
    text(brightness, imgFace.width + imgColor.width + 70, 110 + 80);
}

class Button{
  construct(){
    let buttonMouth,buttonEyeBrow;
  }
  drawButton() {
    // 버튼 생성 및 이벤트 설정
    this.buttonMouth = createButton('mouth');
    this.buttonEyeBrow = createButton('eyebrow');
    this.buttonMouth.position(imgFace.width + imgColor.width, 0);
    this.buttonEyeBrow.position(imgFace.width + imgColor.width, 20);
    this.buttonMouth.mousePressed(this.selectMouthEvent);
    this.buttonEyeBrow.mousePressed(this.selectEyeBrowEvent);
}

  selectMouthEvent() {
    // 마우스를 눌렀을 때 입술 색칠 이벤트
    selectParts = SELECT_MOUTH;
    colorR = colorMouthPR;
    colorRT = colorMouthR;
    colorG = colorMouthPG;
    colorGT = colorMouthG;
    colorB = colorMouthPB;
    colorBT = colorMouthB;
    selectColor(selectParts, imgFace.width, 0, mouthBrightness);
}

  selectEyeBrowEvent() {
    // 마우스를 눌렀을 때 눈 색칠 이벤트
    selectParts = SELECT_EYEBROW;
    colorR = colorEyeBrowPR;
    colorRT = colorEyeBrowR;
    colorG = colorEyeBrowPG;
    colorGT = colorEyeBrowG;
    colorB = colorEyeBrowPB;
    colorBT = colorEyeBrowB;
    selectColor(selectParts, imgFace.width, 0, eyeBrowBrightness);
}
}
