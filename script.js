const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 700;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const lineWidth = document.getElementById('line-width')
ctx.lineWidth = lineWidth.value; 
ctx.lineCap = 'round'; //브러쉬 끝 둥글게 (butt/round/square)

/* 
마우스를 클릭(눌렀다가 뗐을 때) & 움직일 때 마다 선 그리기
const colors = [
    '#f3a683', '#f7d794', '#778beb', '#f19066', '#cf6a87', '#786fa6', '#63cdda', '#ea8685', '#f78fb3', '#574b90'
];

canvas.addEventListener('click', onClick);
//canvas.addEventListener('mousemove', onClick);

function onClick(e){
    //console.log(e) 클릭한 좌표값: offsetX, offsetY
    ctx.beginPath();
    ctx.moveTo(400,400) //순서 주의
    const color = colors[Math.floor(Math.random()*colors.length)];
    ctx.strokeStyle = color;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke(); //선을 보이게 긋기
}
 */


//마우스를 드래그할 때(마우스를 누르고 있을 때: mousedown) 선 그리기
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);

let isPainting = false; //false면 브러쉬가 움직이기만 하도록, true면 그림을 그리도록 만드는 변수

function startPainting(){
    isPainting = true;
}

function stopPainting(){ 
    isPainting = false;
}

function onMove(e){
    if(isPainting){ //true라면
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        return; //함수 끝
    }
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY); 
}

//화면 밖으로 나가면 멈추도록 만들기
canvas.addEventListener('mouseleave', stopPainting);

//선 굵기 조절하기
lineWidth.addEventListener('change', onLineWidthChange)

function onLineWidthChange(e){
    //console.log(e) //e.target.value 
    ctx.lineWidth = e.target.value;

}

//브러쉬 색상 변경하기
const color = document.getElementById('color');
const colorOptions = Array.from(document.getElementsByClassName('color-option')) 
//각 div에 이벤트리스너 추가하기
colorOptions.forEach(color => color.addEventListener('click', onColorClick)); //forEach는 array여야 사용가능

color.addEventListener('change', onColorChange);


function onColorChange(e){
    //console.log(e) //e.target.value
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
}

function onColorClick(e){
    //console.dir(e.target) //object로 상세확인 가능 dataset>color(html에서 data-뒤에 설정한 변수명)
    ctx.strokeStyle = e.target.dataset.color;
    ctx.fillStyle = e.target.dataset.color;
    color.value = e.target.dataset.color;
}


//채우기/그리기 모드
const modeBtn = document.getElementById('mode-btn');
let isFilling = false;

modeBtn.addEventListener('click', onModeClick)

function onModeClick(){
    if(isFilling){
        isFilling = false;
        modeBtn.innerText = '채우기 모드'
    } else{
        isFilling = true;
        modeBtn.innerText = '그리기 모드'
    }
}

canvas.addEventListener('click', onCanvasClick);
function onCanvasClick(){
    if(isFilling){
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}


//리셋버튼 만들기
const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', onResetClick);
function onResetClick(){
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}


//지우개버튼 만들기
const eraserBtn = document.getElementById('eraser-btn');
eraserBtn.addEventListener('click', onEraserClick);
function onEraserClick(){
    ctx.strokeStyle = 'white';
    isFilling = false;
    modeBtn.innerText = '채우기'
}


//이미지 업로드하기
const fileInput = document.getElementById('file');
fileInput.addEventListener('change', onFileChange);

function onFileChange(e){
    //console.dir(e) >> files>0
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    //console.log(url); 파일의 url을 얻음
    const image = new Image()
    image.src = url;
    image.onload = function(){
        ctx.drawImage(image, 0, 0/* , CANVAS_WIDTH, CANVAS_HEIGHT */)
        /* fileInput.value = null; */
    }
}


//텍스트 추가하기
const textInput = document.getElementById('text');

canvas.addEventListener('dblclick', onDoubleClick);
function onDoubleClick(e){
    //console.log(e.offsetX, e.offsetY); //텍스트를 배치할 좌표
    const text = textInput.value;
    if(text !==''){
        ctx.save(); //현재 상태, 색상, 스타일 저장
        ctx.lineWidth = 1;
        ctx.font = '46px serif'
        ctx.fillText(text, e.offsetX, e.offsetY)
        ctx.restore(); //저장한 상태, 색상, 스타일 불러오기
    }
}

//이미지 저장
const saveBtn = document.getElementById('save');
saveBtn.addEventListener('click', onSaveClick);
function onSaveClick(){
    const url = canvas.toDataURL();
    const a = document.createElement('a'); //<a href="" download 생성
    a.href = url
    a.download = 'myDrawing.png'
    a.click();
}


