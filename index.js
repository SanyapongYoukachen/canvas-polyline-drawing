var canvas,
  context,
  dragging = false,
  drawing = true,
  repeat = false,
  dragStartLocation,
  snapshot,
  diffX,
  diffY;

points = new Array();

function getCanvasCoordinates(event) {
  var x = event.clientX - canvas.getBoundingClientRect().left,
    y = event.clientY - canvas.getBoundingClientRect().top;

  return { x: x, y: y };
}

function takeSnapshot() {
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
  context.putImageData(snapshot, 0, 0);
}

function drawLine(position) {
  context.beginPath();
  context.moveTo(dragStartLocation.x, dragStartLocation.y);
  context.lineTo(position.x, position.y);
  context.stroke();
}

function drawCircle(dragStartLocation) {
  context.beginPath();
  context.strokeStyle = "black";
  context.arc(dragStartLocation.x, dragStartLocation.y, 2, 0, 2 * Math.PI);
  context.fill();
  context.stroke();
}

function drawClosePath() {
  console.log("Close Path");
  clearCanvas();

  context.moveTo(points[0].x, points[0].y);

  for (var i = 1; i < points.length; i++) {
    context.lineTo(points[i].x, points[i].y);
  }

  context.closePath();
  context.fill();
  context.stroke();
}

function findDiffPoint(pA, pB) {
  diffX = Math.abs(pA.x - pB.x);
  diffY = Math.abs(pA.y - pB.y);
  return diffX, diffY;
}

function dragStart(event) {
  console.log(points);
  repeatPoint = false;

  if (drawing == true) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);

    if (points.length >= 3) {
      // can create close loop

      diffX, (diffY = findDiffPoint(dragStartLocation, points[0]));

      if (diffX < 10 && diffY < 10) {
        console.log("Diff x: ", diffX);
        console.log("Diff y: ", diffY);
        // current point close to start point, so create close path (with current point)
        dragStop();

        drawClosePath();
      }
    }

    points.push({ x: dragStartLocation.x, y: dragStartLocation.y });
    drawCircle(dragStartLocation);
    takeSnapshot();
  }
}

function drag(event) {
  var position;
  context.strokeStyle = "purple";

  if (dragging === true) {
    restoreSnapshot();
    position = getCanvasCoordinates(event);

    diffX, (diffY = findDiffPoint(position, points[0]));

    if (diffX < 10 && diffY < 10) {
      console.log("repeat point");

      context.beginPath();
      context.arc(points[0].x, points[0].y, 5, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
    } else {
      // pass
    }

    drawLine(position);
  }
}

function dragStop(event) {
  drawing = false;
  dragging = false;
  restoreSnapshot();
  console.log(points);
  // check if close loop or not

  // if close loop: pass

  // else choose which side is in or out
}

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  context.strokeStyle = "purple";
  context.lineWidth = 6;
  context.lineCap = "round";

  canvas.addEventListener("mousedown", dragStart, false);
  canvas.addEventListener("mousemove", drag, false);
}

function checkKeyPress(key) {
  console.log(key.keyCode);
  console.log(typeof key.keyCode);
  if (key.keyCode === 13 || 27 || 8) {
    if (dragging) {
      // has something on canvas
      dragStop();
    } else {
      //pass
    }
  }
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function reset() {
  drawing = true;
  dragging = false;

  points = new Array();

  clearCanvas();
  takeSnapshot();
}

function submit() {
  // submit points
  drawing = false;
  console.log(points);
}

window.addEventListener("load", init, false);
window.addEventListener("keydown", checkKeyPress, false);
