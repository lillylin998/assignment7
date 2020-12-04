
let facemesh;
let video;
let predictions = [];
let r,g,b;
let allPixels;
let model = false;
let x = 0;
//let keypoints = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148];
//let verticesX = [];
//let verticesY = [];
//let poly = [];



function setup() {
  pixelDensity(1);
  createCanvas(640, windowHeight);

  video = createCapture(VIDEO);
  video.size(640, 480);

  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", results => {
    predictions = results;
  });    

  // Hide the video element, and just show the canvas
  video.hide();
    allPixels = Array(640);
    
    for(let i=0; i<allPixels.length; i++){
        allPixels[i] = Array(480);
    }
    
    for (let i=0; i<640; i++){
        for (let j=0; j<480; j++){
            allPixels[i][j] = false;
        }
    }
   // print(allPixels);
}

function modelReady() {
  console.log("Model ready!");
  model = true;
}

function draw() {
    background(255);
    textSize(20);
    text('Move your face to color the image!', 10, 500)
      if(model === false){
      loading();
  }
  translate(video.width, 0);
  scale(-1.0,1.0);
  image(video, 0, 0, 640, 480);
 
   // print(predictions);
   loadPixels();
    bw();
    faceColor();
    updatePixels();
   
}



function faceColor(){
    for(let i=0; i<predictions.length; i++){
        let allpositions = predictions[i].scaledMesh;
        //print(allpositions);
        
        for (let j=0; j<allpositions.length; j++){
            let x = floor(allpositions[j][0]);
            let y = floor(allpositions[j][1]);
            
            
            let ind = (640-x+y*640)*4;

             
            pixels[ind+0] = r;
            pixels[ind+1] = g;
            pixels[ind+2] = b;
            pixels[ind+3] = 255;
            allPixels[640-x][y] = true;
        
        }
    }
    
}

//this function is from the example code in class
function bw(){
    for (var y = 0; y < 480; y++) {
        for (var x = 0; x < 640; x++) {
            
        if (allPixels[x][y] === false){
          var index = (x + y * 640)*4;
        
          r = pixels[index+0];
          g = pixels[index+1];
          b = pixels[index+2];
          let a = pixels[index+3];   
          
          let avg = (r + g + b) / 3;
          
          pixels[index+0] = avg;
          pixels[index+1] = avg;
          pixels[index+2] = avg;
          pixels[index+3] = 100;
            
        }
        }
      }
}

function loading(){
    push();
    textSize(20);
    fill(0,0,0,x)
    text("Loading", 320, 240);
    pop();
    x += 5;
    print(x);
    if(x>255){
        x=0;
    }
    
}
