game.width = 800
game.height = 800

CUBE_COLOR = 'blue'
CORNER_COLOR = 'red'
BACKGROUND_COLOR = 'BLACK'

const ctx = game.getContext('2d')
ctx.fillStyle = CUBE_COLOR

function clear() {
	ctx.fillStyle = BACKGROUND_COLOR
	ctx.fillRect(0, 0, game.width, game.height)
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

function frame() {
	const dt = 1 / FPS;
	angle += Math.PI * dt

	dz += (0.5 * dt)

	clear()
	for (const point of points) {
		createPoint(screen(project(translatez(rotatexz(point, angle),dz))))
	}
	for( const face of faces){
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