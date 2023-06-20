
var canvas;
var inputAngleSpeed;
var angleSpeed = 2;

window.onload = function() {

    inputAngleSpeed = document.querySelector('#inputAngleSpeed');
    angleSpeed = parseInt(inputAngleSpeed.value);

    canvas = document.querySelector('#canvas');
    canvas.width = 400;
    canvas.height = 400;
    var ctx = canvas.getContext('2d');

    var loadImage = function(imagePath) {
        return new Promise(function(resolve, reject) {
        var img = new Image();
        img.addEventListener('load', function() {
            resolve(img);
        });
        img.src = imagePath;
        });
    }

    loadImage("./img/icon.png").then(function(image) {

        var angle = 0;
        var loop = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate( angle * Math.PI / 180 );
        ctx.drawImage(image, 40, 40);
        ctx.restore();

        angle += angleSpeed;
        window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
    });

    inputAngleSpeed.addEventListener('change', (event) => {
        angleSpeed = parseInt(event.currentTarget.value);
    });

    document.querySelector('#btnDownload').addEventListener("click", function(event) {
        canvas.toBlob(function(blob) {
        var a = document.createElement("a");
        a.download = "icon.png";
        a.href = URL.createObjectURL(blob);
        a.target = '_blank';
        a.click();
        URL.revokeObjectURL(blob);
        }, "image/png", 0.9);
    });

    };
