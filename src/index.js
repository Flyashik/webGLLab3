function initWebGL(canvas) {
	gl = null;
	try { // Попытаться получить стандартный контекст.
// Если не получится, попробовать получить экспериментальный.
		gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimentalwebgl");
	} catch (e) {
		console.log(e.toString())
	}
// Если мы не получили контекст GL, завершить работу
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
		gl = null;
	}
	//canvas.width = window.innerWidth
	//canvas.height = window.innerHeight
	return gl;
}


let vsSource =
	[
		'precision mediump float;',
		'attribute vec3 vertPosition;',
		'attribute vec3 vertColor;',
		'varying vec3 fragColor;',
		'',
		'uniform vec3 uColors;',
		'uniform mat4 mWorld;',
		'uniform mat4 mView;',
		'uniform mat4 mProj;',
		'',
		'void main()',
		'{',
		'   fragColor = uColors;',
		'   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
		'}',
	].join('\n');

let fsSource =
	[
		'precision mediump float;',
		'',
		'varying vec3 fragColor;',
		'void main()',
		'{',
		'   gl_FragColor = vec4(fragColor, 1.0);',
		'}',
	].join('\n');

function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
// Send the source to the shader object
	gl.shaderSource(shader, source);
// Compile the shader program
	gl.compileShader(shader);
// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}


function initShaderProgram(gl, vsSource, fsSource) {

	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}
	return shaderProgram;
}

let canvas = document.getElementById("cubeCanvas");
initWebGL(canvas)
if (gl)
{ // продолжать только если WebGL доступен и работает
	// Устанавливаем размер вьюпорта
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	// установить в качестве цвета очистки буфера цвета черный, полная непрозрачность
	gl.clearColor(0.0, 0.3, 0.6, 1.0);
	// включает использование буфера глубины
	gl.enable(gl.DEPTH_TEST);
	// определяет работу буфера глубины: более ближние объекты перекрывают дальние
	gl.depthFunc(gl.LEQUAL);
	// очистить буфер цвета и буфер глубины
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}
function initBuffersCube()
{
	let squareVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	let vertices =
		[ // X, Y, Z           R, G, B
			// Front
			-0.5, -0.5, -0.5, 0.5, 0.5, 0.5, // 3
			-0.5, 0.5, -0.5, 0.5, 0.5, 0.5, // 1
			0.5, 0.5, -0.5, 0.5, 0.5, 0.5, // 2

			-0.5, -0.5, -0.5, 0.5, 0.5, 0.5, // 3
			0.5, 0.5, -0.5, 0.5, 0.5, 0.5, // 2
			0.5, -0.5, -0.5, 0.5, 0.5, 0.5, // 4

			// Top
			-0.5, 0.5, -0.5, 0.2, 0.7, 0.1, // 1
			-0.5, 0.5, 0.5, 0.2, 0.7, 0.1, // 5
			0.5, 0.5, 0.5, 0.2, 0.7, 0.1, // 6

			-0.5, 0.5, -0.5, 0.2, 0.7, 0.1, // 1
			0.5, 0.5, -0.5, 0.2, 0.7, 0.1, // 2
			0.5, 0.5, 0.5, 0.2, 0.7, 0.1, // 6

			// Bottom
			-0.5, -0.5, -0.5, 0.1, 0.5, 0.0, // 3
			0.5, -0.5, 0.5, 0.1, 0.5, 0.0, // 8
			0.5, -0.5, -0.5, 0.1, 0.5, 0.0, // 4

			-0.5, -0.5, -0.5, 0.1, 0.5, 0.0, // 3
			0.5, -0.5, 0.5, 0.1, 0.5, 0.0, // 8
			-0.5, -0.5, 0.5, 0.1, 0.5, 0.0, // 7

			// Left
			-0.5, -0.5, -0.5, 0.5, 0.0, 1.0, // 3
			-0.5, 0.5, -0.5, 0.5, 0.0, 1.0, // 1
			-0.5, -0.5, 0.5, 0.5, 0.0, 1.0, // 7

			-0.5, 0.5, 0.5, 0.5, 0.0, 1.0, // 5
			-0.5, 0.5, -0.5, 0.5, 0.0, 1.0, // 1
			-0.5, -0.5, 0.5, 0.5, 0.0, 1.0, // 7

			//Right
			0.5, 0.5, -0.5, 0.2, 1.0, 0.1, // 2
			0.5, -0.5, 0.5, 0.2, 1.0, 0.1, // 8
			0.5, -0.5, -0.5, 0.2, 1.0, 0.1, // 4

			0.5, 0.5, -0.5, 0.2, 1.0, 0.1, // 2
			0.5, -0.5, 0.5, 0.2, 1.0, 0.1, // 8
			0.5, 0.5, 0.5, 0.2, 1.0, 0.1, // 6

			//Back
			-0.5, 0.5, 0.5, 0.2, 0.3, 0.5, // 5
			0.5, 0.5, 0.5, 0.2, 0.3, 0.5, // 6
			-0.5, -0.5, 0.5, 0.2, 0.3, 0.5, // 7

			0.5, -0.5, 0.5, 0.2, 0.3, 0.5, // 8
			0.5, 0.5, 0.5, 0.2, 0.3, 0.5, // 6
			-0.5, -0.5, 0.5, 0.2, 0.3, 0.5, // 7
		];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

const shaderProgramCube = initShaderProgram(gl, vsSource, fsSource);

initBuffersCube()
vertexPositionAttribute = gl.getAttribLocation(shaderProgramCube, "vertPosition");
vertColorAttribute = gl.getAttribLocation(shaderProgramCube, "vertColor");
gl.useProgram(shaderProgramCube);

gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(vertColorAttribute, 3, gl.FLOAT, false, 6*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT);

gl.enableVertexAttribArray(vertexPositionAttribute);
gl.enableVertexAttribArray(vertColorAttribute);

let goldCubeTop = new Float32Array(16);
let goldCubeBot = new Float32Array(16);
let silverCubeLeft = new Float32Array(16);
let bronzeCubeRight = new Float32Array(16);

const startPosX = 0.5;
const startPosY = -1;
const startPosZ = -1;

let worldMatrix = new Float32Array(16);
let viewMatrix = new Float32Array(16);
let projMatrix = new Float32Array(16);

let matWorldLocationCube = gl.getUniformLocation(shaderProgramCube, "mWorld");
let matViewLocationCube = gl.getUniformLocation(shaderProgramCube, "mView");
let matProjLocationCube = gl.getUniformLocation(shaderProgramCube, "mProj");
let uColors = gl.getUniformLocation(shaderProgramCube, "uColors");

glMatrix.mat4.identity(worldMatrix)
glMatrix.mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrix, Math.PI / 7, canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrix);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrix);

let identityMatrix = glMatrix.mat4.identity(new Float32Array(16));

glMatrix.mat4.translate(goldCubeTop, identityMatrix, [startPosX, startPosY + 1, startPosZ]);

glMatrix.mat4.translate(goldCubeBot, identityMatrix, [startPosX, startPosY, startPosZ]);

glMatrix.mat4.translate(silverCubeLeft, identityMatrix, [startPosX + 1, startPosY, startPosZ]);

glMatrix.mat4.translate(bronzeCubeRight, identityMatrix, [startPosX - 1, startPosY, startPosZ]);

let cubes = [goldCubeBot, goldCubeTop, silverCubeLeft, bronzeCubeRight];
let switcher = 0;

document.addEventListener('keyup', (event) => {
	if(event.code === 'KeyF') {
		switcher = switcher === 3 ? 0 : switcher + 1;
	}
});

let currentAngleLeftX = 0;
let currentAngleLeftZ = 0;

let currentAngleRightX = 0;
let currentAngleRightZ = 0;

document.addEventListener('keydown', (event) => {
	if(event.code === 'ArrowLeft') {
		currentAngleLeftX = cubes[switcher] === silverCubeLeft ? currentAngleLeftX - 0.05 : currentAngleLeftX;
		currentAngleLeftZ = cubes[switcher] === silverCubeLeft ? currentAngleLeftZ - 0.05 : currentAngleLeftZ;
		currentAngleRightX = cubes[switcher] === bronzeCubeRight ? currentAngleRightX - 0.05 : currentAngleRightX;
		currentAngleRightZ = cubes[switcher] === bronzeCubeRight ? currentAngleRightZ - 0.05 : currentAngleRightZ;
		glMatrix.mat4.rotate(cubes[switcher], cubes[switcher], -0.05, [0, 1, 0]);
	}
	if(event.code === 'ArrowRight') {
		currentAngleLeftX = cubes[switcher] === silverCubeLeft ? currentAngleLeftX + 0.05 : currentAngleLeftX;
		currentAngleLeftZ = cubes[switcher] === silverCubeLeft ? currentAngleLeftZ + 0.05 : currentAngleLeftZ;
		currentAngleRightX = cubes[switcher] === bronzeCubeRight ? currentAngleRightX + 0.05 : currentAngleRightX;
		currentAngleRightZ = cubes[switcher] === bronzeCubeRight ? currentAngleRightZ + 0.05 : currentAngleRightZ;
		glMatrix.mat4.rotate(cubes[switcher], cubes[switcher], 0.05, [0, 1, 0]);
	}
	if (event.code === 'KeyQ')
	{
		glMatrix.mat4.rotate(viewMatrix, viewMatrix, -0.05, [0, 1, 0]);
	}
	if (event.code === 'KeyE')
	{
		glMatrix.mat4.rotate(viewMatrix, viewMatrix, 0.05, [0, 1, 0]);
	}
	if (event.code === 'KeyA')
	{
		currentAngleLeftX -= 0.05;
		currentAngleRightX -= 0.05;
		glMatrix.mat4.rotate(goldCubeTop, goldCubeTop, -0.05, [0, 1, 0]);
		glMatrix.mat4.rotate(goldCubeBot, goldCubeBot, -0.05, [0, 1, 0]);

		glMatrix.mat4.translate(silverCubeLeft, identityMatrix, [Math.cos(-currentAngleLeftX + currentAngleLeftZ) + startPosX, startPosY, Math.sin(-currentAngleLeftX + currentAngleLeftZ) + startPosZ]);
		glMatrix.mat4.rotate(silverCubeLeft, silverCubeLeft, currentAngleLeftX, [0, 1, 0]);

		glMatrix.mat4.translate(bronzeCubeRight, identityMatrix, [Math.cos(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosX, startPosY, Math.sin(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosZ]);
		glMatrix.mat4.rotate(bronzeCubeRight, bronzeCubeRight, currentAngleLeftX, [0, 1, 0]);
	}
	if (event.code === 'KeyD')
	{
		currentAngleLeftX += 0.05;
		currentAngleRightX += 0.05;
		glMatrix.mat4.rotate(goldCubeTop, goldCubeTop, 0.05, [0, 1, 0]);
		glMatrix.mat4.rotate(goldCubeBot, goldCubeBot, 0.05, [0, 1, 0]);

		glMatrix.mat4.translate(silverCubeLeft, identityMatrix, [Math.cos(-currentAngleLeftX + currentAngleLeftZ) + startPosX, startPosY, Math.sin(-currentAngleLeftX + currentAngleLeftZ) + startPosZ]);
		glMatrix.mat4.rotate(silverCubeLeft, silverCubeLeft, currentAngleLeftX, [0, 1, 0]);

		glMatrix.mat4.translate(bronzeCubeRight, identityMatrix, [Math.cos(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosX, startPosY, Math.sin(Math.PI - currentAngleRightX + currentAngleRightZ) + startPosZ]);
		glMatrix.mat4.rotate(bronzeCubeRight, bronzeCubeRight, currentAngleRightX, [0, 1, 0]);
	}
});


let draw = () => {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrix);

	gl.uniform3fv(uColors, [0.72, 0.52, 0.04]);
	glMatrix.mat4.copy(worldMatrix, goldCubeTop);
	gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 40);

	glMatrix.mat4.copy(worldMatrix, goldCubeBot);
	gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 40);

	gl.uniform3fv(uColors, [0.75, 0.75, 0.75])
	glMatrix.mat4.copy(worldMatrix, silverCubeLeft);
	gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 40);

	gl.uniform3fv(uColors, [0.8, 0.5, 0.2])
	glMatrix.mat4.copy(worldMatrix, bronzeCubeRight);
	gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, 40);

	requestAnimationFrame(draw);
}

draw();