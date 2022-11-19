let originalVideo = document.createElement('video');
let localVideo3 = null;
let selfieSegmentation = null;
let virtualBackgroundImage = document.getElementById("virtualBackgroundImage");
let backgroundBlurRange = 3;

let edgeBlurRange = 4;

let blurredEnabled = false;
let virtualBackgroundEnabled = true;

let effectCanvas = document.getElementById("effectCanvas"); //document.createElement('canvas');
effectCanvas.width = 480;
effectCanvas.height = 360;
let ctx = effectCanvas.getContext("2d");
ctx.fillStyle = "blue";
ctx.font = "bold 16px Arial";
ctx.fillText("Zibri", (effectCanvas.width / 2) - 17, (effectCanvas.height / 2) + 8);

let readyToPlay = false;

let localVideo2 = null;

function loadMediapipe(that, localVideoId) {
    debugger;
    if (selfieSegmentation) return;
    createSelfieSegmentation(that, localVideoId);
}

function createSelfieSegmentation(that, localVideoId) {
    selfieSegmentation = new SelfieSegmentation({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
        }
    });
    selfieSegmentation.setOptions({
        selfieMode: false,
        modelSelection: 1,
        effect: "background"
    });
    selfieSegmentation.onResults(onResults);

    localVideo2 = document.getElementById("localVideo");//localVideoId);

    playing();
}

async function playing() {
    //while (true) {
    if (selfieSegmentation !== undefined) {
        await selfieSegmentation.send({image: localVideo2});
    }
    //window.requestAnimationFrame(() => playing);
    //sleep(1000);
    //}
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function drawSegmentationMask(segmentation) {
    ctx.drawImage(segmentation, 0, 0, effectCanvas.width, effectCanvas.height);
}

function blurBackground(image, blurAmount) {
    ctx.globalCompositeOperation = "destination-over";
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(image, 0, 0, effectCanvas.width, effectCanvas.height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
}

function onResults(results) {
    runPostProcessing(
        results.image,
        results.segmentationMask,
        backgroundBlurRange
    );
    setTimeout(playing, 100);
}

function runPostProcessing(image, segmentation, blurAmount) {
    if (localVideo3 === null) {
        localVideo3 = document.getElementById("localVideo2");//localVideoId);
        const canvasStream = effectCanvas.captureStream(10);
        localVideo3.srcObject = canvasStream;
        //that.localStream = canvasStream;
        localVideo3.play();
    }
    if (blurredEnabled) {
        drawBlurBackground(image, segmentation, blurAmount);
    } else if (virtualBackgroundEnabled) {
        drawVirtualBackground(image, segmentation, virtualBackgroundImage);
    }
}

function drawVirtualBackground(image, segmentation, virtualBackgroundImage) {
    ctx.save();
    clearCanvas();
    ctx.drawImage(segmentation, 0, 0, effectCanvas.width, effectCanvas.height);
    ctx.globalCompositeOperation = 'source-out';
    ctx.drawImage(virtualBackgroundImage, 0, 0, virtualBackgroundImage.width, virtualBackgroundImage.height, 0, 0, effectCanvas.width, effectCanvas.height);
    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(image, 0, 0, effectCanvas.width, effectCanvas.height);
    ctx.restore();
}

function drawBlurBackground(image, segmentation, blurAmount) {
    clearCanvas();

    ctx.globalCompositeOperation = "copy";
    ctx.filter = "none";

    ctx.filter = `blur(${edgeBlurRange}px)`;
    drawSegmentationMask(segmentation);
    ctx.globalCompositeOperation = "source-in";
    ctx.filter = "none";

    ctx.drawImage(image, 0, 0, effectCanvas.width, effectCanvas.height);

    blurBackground(image, blurAmount);

    ctx.restore();
}