const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const vertexNodesInput = document.getElementById("vertex-nodes");
const centroidNodeInput = document.getElementById("centroid-node");
const edgesInput = document.getElementById("edges");
const linesInput = document.getElementById("lines");
const boundingBoxInput = document.getElementById("bounding-box");

let vertexNodes = vertexNodesInput.checked;
let centroidNode = centroidNodeInput.checked;
let edges = edgesInput.checked;
let lines = linesInput.checked;
let boundingBox = boundingBoxInput.checked;

const points = [];
let target = null;
let dragging = false;

const hitTest = function(x, y) {
	let i = points.length;
	while(i--) {
		const point = points[i];
		if(Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)) < 10)
			return point;
	}
};

const frame = function() {
	requestAnimationFrame(frame);

	const centroid = {
		x: points.reduce((acc, cur) => acc + cur.x, 0) / points.length,
		y: points.reduce((acc, cur) => acc + cur.y, 0) / points.length
	};

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();

	let i = points.length;

	if(i)
		context.moveTo(points[0].x, points[0].y);

	while(i--) {
		if(edges)
			context.lineTo(points[i].x, points[i].y);

		if(lines) {
			context.moveTo(centroid.x, centroid.y);
			context.lineTo(points[i].x, points[i].y);
		}
	}

	context.stroke();

	if(vertexNodes) {
		for(let point of points) {
			context.beginPath();
			context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
			context.stroke();
		}
	}

	if(centroidNode) {
		context.beginPath();
		context.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI);
		context.stroke();
	}

	if(boundingBox) {
		const max = {
			x: Math.max.apply(Math, points.map(point => point.x)),
			y: Math.max.apply(Math, points.map(point => point.y))
		};

		const min = {
			x: Math.min.apply(Math, points.map(point => point.x)),
			y: Math.min.apply(Math, points.map(point => point.y))
		};

		context.strokeRect(min.x, min.y, max.x - min.x, max.y - min.y);
	}
};

canvas.addEventListener("mousedown", e => {
	target = hitTest(e.offsetX, e.offsetY);

	if(!target) {
		target = { x: e.offsetX, y: e.offsetY };
		points.push(target);
	}

	dragging = true;
});

canvas.addEventListener("mouseup", e => {
	target = null;
	dragging = false;
});

canvas.addEventListener("mousemove", e => {
	if(target && dragging) {
		target.x = e.offsetX;
		target.y = e.offsetY;
	}

	canvas.style.cursor = hitTest(e.offsetX, e.offsetY) ? "pointer" : "default";
});

vertexNodesInput.addEventListener("change", e => vertexNodes = vertexNodesInput.checked);
centroidNodeInput.addEventListener("change", e => centroidNode = centroidNodeInput.checked);
edgesInput.addEventListener("change", e => edges = edgesInput.checked);
linesInput.addEventListener("change", e => lines = linesInput.checked);
boundingBoxInput.addEventListener("change", e => boundingBox = boundingBoxInput.checked);

let i = 3;
while(i--) {
	points.push({
		x: Math.floor(Math.random() * (canvas.width - 10 + 1)) + 10,
		y: Math.floor(Math.random() * (canvas.height - 10 + 1)) + 10,
	});
}

requestAnimationFrame(frame);
