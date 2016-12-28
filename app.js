(function() {

    var canvasElement = document.getElementById('canvas');
    var optionsDiv = document.getElementById('options');
    var strokeColor = document.getElementById('stroke-color');
    var backgroundColor = document.getElementById('background-color');
    var download = document.getElementById('download');
    var lineWidth = document.getElementById('line-width');
    var addImage = document.getElementById('add-image');
    var addImageInput = document.getElementById('add-image-input');
    var canvas = canvasElement.getContext('2d');
    var printImg = null;

    var getCanvasBGColor = function() {
        return "#" + backgroundColor.value;
    }

    backgroundColor.addEventListener('change', function() {
        canvasElement.style.backgroundColor = getCanvasBGColor();
    });

    var getCanvasWidthAndHeight = function() {
        return {
            "width": document.body.clientWidth,
            "height": document.body.clientHeight - options.offsetHeight
        }
    }

    var setCanvasWidthAndHeight = function() {
        var size = getCanvasWidthAndHeight();
        canvas.canvas.width = size.width;
        canvas.canvas.height = size.height;
    }
    setCanvasWidthAndHeight();

    window.addEventListener('resize', regenerateCanvas, false);
    var regenerateCanvas = function() {
        var tempCanvas = document.createElement('canvas');
        var size = getCanvasWidthAndHeight();
        tempCanvas.width = size.width;
        tempCanvas.height = size.height;
        tempCanvasCtx.drawImage(canvasElement, 0, 0);
        setCanvasWidthAndHeight();
        canvas.drawImage(tempCanvas, 0, 0);
    }

    var drawEnabled = false;
    var getCoordinatesFromEvent = function(e) {
        var rect = canvasElement.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    var mousedownPosition = null;
    canvasElement.addEventListener('mousedown', function(event) {
        canvasElement.focus();
        var cursorPosition = getCoordinatesFromEvent(event);
        mousedownPosition = cursorPosition;
        if (printImg) {
            canvas.drawImage(printImg, cursorPosition.x, cursorPosition.y);
            printImg = null;
        } else {
            canvas.beginPath();
            canvas.moveTo(cursorPosition.x, cursorPosition.y);
            drawEnabled = true;
        }
        // event.preventDefault();
    })

    canvasElement.addEventListener('mouseup', function(event) {
        var cursorPosition = getCoordinatesFromEvent(event);
        if (mousedownPosition.x === cursorPosition.x && mousedownPosition.y === cursorPosition.y) {
            draw(event);
        }
        drawEnabled = false;
    })
    var draw = function(event) {
        if (drawEnabled) {
            var cursorPosition = getCoordinatesFromEvent(event);
            canvas.lineTo(cursorPosition.x + 1, cursorPosition.y + 1);
            canvas.lineWidth = lineWidth.value;
            canvas.strokeStyle = "#" + strokeColor.value;
            canvas.stroke();
        }
    }
    canvasElement.addEventListener('mousemove', function(event) {
        draw(event);
    })

    canvasElement.addEventListener('mouseout', function(event) {
        drawEnabled = false;
        canvas.closePath();
    })


    // Redirect touch events (convert touch events to mouse events):
    canvasElement.addEventListener('touchstart', function(e) {
        mousePos = getCoordinatesFromEvent(e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvasElement.dispatchEvent(mouseEvent);
    }, false);

    canvasElement.addEventListener('touchend', function(e) {
        var mouseEvent = new MouseEvent('mouseup', {});
        canvasElement.dispatchEvent(mouseEvent);
    }, false);

    canvasElement.addEventListener('touchmove', function(e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvasElement.dispatchEvent(mouseEvent);
    }, false);


    // Options:
    document.getElementById('refresh').addEventListener('click', function() {
        var size = getCanvasWidthAndHeight();
        canvas.clearRect(0, 0, size.width, size.height);
    })

    download.addEventListener('click', function() {
        var tempCanvas = document.createElement("canvas"),
            tempCanvasCtx = tempCanvas.getContext("2d");
        var size = getCanvasWidthAndHeight();
        tempCanvas.width = size.width;
        tempCanvas.height = size.height;
        tempCanvasCtx.fillStyle = getCanvasBGColor();
        tempCanvasCtx.fillRect(0, 0, size.width, size.height);
        tempCanvasCtx.drawImage(canvasElement, 0, 0);
        var a = document.createElement("a");
        a.href = tempCanvas.toDataURL();
        a.download = "snapshot.png";
        a.click();
    })


    addImage.addEventListener('click', function() {
        addImageInput.click();
    })


    addImageInput.addEventListener('change', function(event) {
        var target = event.target,
            files = target.files;
        printImg = document.createElement("img");

        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function() {
                if (confirm("To print image on the view, select 'ok' and click anywhere on the view to print the image, else select 'calcel'")) {
                    printImg.src = fr.result;
                }
            }
            fr.readAsDataURL(files[0]);
        }
    })


})();
