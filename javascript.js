CANVAS_HEIGHT = 1000
CANVAS_WIDTH = 1000

game.width = CANVAS_WIDTH
game.height = CANVAS_HEIGHT

CUBE_COLOR = 'blue'
CORNER_COLOR = 'red'
BACKGROUND_COLOR = 'BLACK'
DOT_COLOR = 'white'

const ctx = game.getContext('2d')
ctx.fillStyle = CUBE_COLOR

function drawOx() {
	ctx.beginPath()
	ctx.moveTo(0, CANVAS_HEIGHT/2)
	ctx.lineTo(CANVAS_HEIGHT, CANVAS_HEIGHT/2)
	ctx.strokeStyle = DOT_COLOR
	ctx.stroke()
}

function drawOy() {
	ctx.beginPath()
	ctx.moveTo(CANVAS_WIDTH/2, 0)
	ctx.lineTo(CANVAS_WIDTH/2, CANVAS_HEIGHT)
	ctx.strokeStyle = DOT_COLOR
	ctx.stroke()
}

function drawGrid() {
	const dot_size = 1
	ctx.fillStyle = DOT_COLOR
	for (let i = 0; i <= 10; ++i)
		for (let j = 0; j <= 10; ++j) {
			ctx.fillRect(j * 100, i * 100, dot_size, dot_size)
		}
}

function clear() {
	ctx.fillStyle = BACKGROUND_COLOR
	ctx.fillRect(0, 0, game.width, game.height)

	drawGrid()
	drawOx()
	drawOy()
}

function createPoint({ x, y }) {
	const size = 5
	ctx.fillStyle = CORNER_COLOR
	ctx.fillRect(x - size / 2, y - size / 2, size, size)
}

function line(p1, p2) {
	ctx.beginPath()
	ctx.moveTo(p1.x, p1.y)
	ctx.lineTo(p2.x, p2.y)
	ctx.strokeStyle = CUBE_COLOR
	ctx.stroke()
}

function screen(p) {
	return {
		x: (p.x + 1) / 2 * game.width,
		y: (1 - (p.y + 1) / 2) * game.height,
	}
}

function project({ x, y, z }) {
	return {
		x: x / z,
		y: y / z,
	}
}

const FPS = 60

function rotatexz({ x, y, z }, angle) {
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	return {
		x: x * cos - z * sin,
		y: y,
		z: x * sin + z * cos,
	}
}

function rotateyz({x, y, z}, angle) {
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	return {
		x: x,
		y: y*cos - z*sin,
		z: y*sin + z*cos,
	}
}

function rotatexy({x, y, z}, angle) {
	const cos = Math.cos(angle)
	const sin = Math.sin(angle)
	return {
		x: x*cos - y*sin,
		y: x*sin + y*cos,
		z: z
	}
}

const points = [
	{ x: 0.5, y: 0.5, z: 0.5 },
	{ x: -0.5, y: 0.5, z: 0.5 },
	{ x: -0.5, y: -0.5, z: 0.5 },
	{ x: 0.5, y: -0.5, z: 0.5 },

	{ x: 0.5, y: 0.5, z: -0.5 },
	{ x: -0.5, y: 0.5, z: -0.5 },
	{ x: -0.5, y: -0.5, z: -0.5 },
	{ x: 0.5, y: -0.5, z: -0.5 },
]

const faces = [
	[0, 1, 2 ,3],
	[4, 5, 6, 7],
	[0, 4],
	[1, 5],
	[2, 6],
	[3, 7],
]

function translatez({ x, y, z }, dz) {
	return { x, y, z: z + dz }
}

let dz = 1.1
let angle = 0

const rotationSlider = document.getElementById('rotationSpeed')
const moveSlider = document.getElementById('moveSpeed')

const rotationValueDisplay = document.getElementById('rotationValue')
const moveValueDisplay = document.getElementById('moveValue')

rotationSlider.addEventListener('input', () => {
	rotationValueDisplay.textContent = rotationSlider.value
} )

moveSlider.addEventListener('input', () => {
	moveValueDisplay.textContent = moveSlider.value
})

const MIN_Z = 1.1
const MAX_Z = 7.5
let returning = false
function frame() {
	const dt = 1 / FPS;

	const rotation = rotationSlider.valueAsNumber
	angle += rotation*Math.PI * dt

	const move = moveSlider.valueAsNumber
	dz = dz + (move*dt)*(returning ? -1 : 1)

	if(dz <= MIN_Z)
		returning = false
	if(dz >= MAX_Z)
		returning = true

	clear()
	for(const face of faces){
		for(let i=0; i<face.length; i++){
			const a = points[face[i]];
			const b = points[face[(i+1)%face.length]];
			line(
				screen(project(translatez(rotatexz(a, angle),dz))),
				screen(project(translatez(rotatexz(b, angle), dz)))
			)
		}
	}
	setTimeout(frame, 1000 / FPS)
}
setTimeout(frame, 1000 / FPS)