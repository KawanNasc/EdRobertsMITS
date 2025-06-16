const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const proximapeca = document.getElementById('prox-peca');
const proximaPecaContext = proximapeca.getContext('2d');

context.scale(20, 20);

const colors = [
	null,
	'red',
	'blue',
	'violet',
	'green',
	'purple',
	'orange',
	'pink'
]

function criarmatriz(w, h) {
	const matriz = [];
	while (h--) {
		matriz.push(new Array(w).fill(0));
	}
	return matriz;
}

const arena = criarmatriz(14, 25);

function criarPeca(type) {
	if (type == 'T') {
		return [
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0]
		];
	}

	else if (type == 'O') {
		return [
			[2, 2],
			[2, 2]
		];
	}

	else if (type == 'L') {
		return [
			[0, 3, 0],
			[0, 3, 0],
			[0, 3, 3]
		];
	}

	else if (type == 'J') {
		return [
			[0, 4, 0],
			[0, 4, 0],
			[4, 4, 0]
		];
	}

	else if (type == 'I') {
		return [
			[0, 5, 0, 0],
			[0, 5, 0, 0],
			[0, 5, 0, 0],
			[0, 5, 0, 0]
		];
	}

	else if (type == 'S') {
		return [
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0]
		];
	}

	else if (type == 'Z') {
		return [
			[7, 7, 0],
			[0, 7, 7],
			[0, 0, 0]
		];
	}
}

function ProximaPeca(matriz) {
	const tamanho = 30;

	proximaPecaContext.fillStyle = "rgb(0 ,0, 0)";
	proximaPecaContext.fillRect(0, 0, proximapeca.width, proximapeca.height);

	const larguraMatriz = matriz[0].length * tamanho;
	const alturaMatriz = matriz.length * tamanho;

	const X = (proximapeca.width - larguraMatriz) / 2;
	const Y = (proximapeca.height - alturaMatriz) / 2;

	matriz.forEach((linha, y) => {
		linha.forEach((value, x) => {
			if (value !== 0) {
				const posX = X + x * tamanho;
				const posY = Y + y * tamanho;
				proximaPecaContext.fillStyle = colors[value];
				proximaPecaContext.fillRect(posX, posY, tamanho, tamanho);
			}
		});
	});
}

function inserirElementos() {
	outer: for (let y = arena.length - 1; y > 0; y--) {
		for (let x = 0; x < arena[y].length; x++) {
			if (arena[y][x] == 0) { continue outer; }
		}

		let linha = arena.splice(y, 1)[0].fill(0);
		arena.unshift(linha);
		let lineClear = new Audio('sons/line-clear.mp3');
		lineClear.volume = 0.2;
		lineClear.play();
		++y;

		jogador.score += 1 * 10;

		if (jogador.score < 900) {
			jogador.speed += 0.2
			intervaloqueda -= 40;
		}

	}
}

const sombra = criarmatriz(arena[0].length, arena.length);

function movimentarpecas(matriz, deslocamento) {
	matriz.forEach((linha, y) => {
		linha.forEach((value, x) => {
			if (value !== 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + deslocamento.x, y + deslocamento.y, 1, 1);
			}
		});
	});
}

const jogador = {
	matriz: criarPeca(),
	pos: { x: 0, y: 0 },
	score: 0,
	speed: 1
}

function movimento() {
	context.fillStyle = 'rgb(0 ,0, 0)';
	context.fillRect(0, 0, canvas.width, canvas.height);

	const pixel = 1;

	context.strokeStyle = 'rgba(255,255,255,0.2)';
	context.lineWidth = 0.1;

	for (let row = 0; row <= canvas.height; row++) {
		const y = row * pixel;
		context.beginPath();
		context.moveTo(0, y);
		context.lineTo(canvas.width, y);
		context.stroke();
	}

	for (let col = 0; col <= canvas.width; col++) {
		const x = col * pixel;
		context.beginPath();
		context.moveTo(x, 0);
		context.lineTo(x, canvas.height);
		context.stroke();
	}

	movimentarpecas(arena, { x: 0, y: 0 });
	movimentarpecas(jogador.matriz, jogador.pos);
}

function fundir(arena, jogador) {
	jogador.matriz.forEach((linha, y) => {
		linha.forEach((value, x) => {
			if (value != 0) {
				arena[y + jogador.pos.y][x + jogador.pos.x] = value;
			}
		})
	})
	let encaixe = new Audio('sons/drop-peca.mp3');
	encaixe.volume = 0.3;
	encaixe.play();
}

function intervaloCaixas(arena, jogador) {
	const [m, o] = [jogador.matriz, jogador.pos];

	for (let y = 0; y < m.length; y++) {
		for (let x = 0; x < m[y].length; x++) {
			if (m[y][x] != 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) != 0) return true;
		}
	}

	return false;
}

function jogadorDrop() {
	jogador.pos.y++;

	if (intervaloCaixas(arena, jogador)) {
		jogador.pos.y--;
		fundir(arena, jogador);
		jogadorReset();
		inserirElementos();
		atualizarPontos();
	}

	queda = 0;
}

function jogadorMove(dir) {
	jogador.pos.x += dir;
	if (intervaloCaixas(arena, jogador)) { jogador.pos.x -= dir; }
}

const NextPiece = [];

function gerarProxima() {
	const pecas = 'ILJOTSZ';
	while (NextPiece.length < 5) {
		let Piece = criarPeca(pecas[pecas.length * Math.random() | 0]);
		NextPiece.push(Piece);
	}

	return NextPiece
}

function jogadorReset() {
	gerarProxima();
	ProximaPeca(NextPiece[1]);
	if (NextPiece.length > 0) {
		jogador.matriz = NextPiece[0];
		NextPiece.shift();
	}
	jogador.pos.y = 0;
	jogador.pos.x = (arena[0].length / 2 | 0) - (jogador.matriz[0] / 2 | 0);

	if (intervaloCaixas(arena, jogador)) {
		arena.forEach(linha => linha.fill(0));
		jogador.score = 0;
		jogador.speed = 1;
		intervaloqueda = 1000;
		atualizarPontos();
	}
}

function jogadorRoate(dir) {

	let deslocamento = 1;
	let pos = jogador.pos.x;
	rotacionarpecas(jogador.matriz, dir);

	while (intervaloCaixas(arena, jogador)) {
		jogador.pos.x += deslocamento;

		deslocamento = -(deslocamento + (deslocamento > 0 ? 1 : -1));

		if (deslocamento > jogador.matriz[0].length) {
			rotacionarpecas(jogador.matriz, -dir);
			jogador.pos.x = pos;
			return;
		}
	}
}

function rotacionarpecas(matriz, dir) {
	for (let y = 0; y < matriz.length; y++) {
		for (let x = 0; x < y; x++) {
			[
				matriz[x][y],
				matriz[y][x]
			] = [
					matriz[y][x],
					matriz[x][y]
				]
		}
	}

	if (dir > 0) { matriz.forEach(linha => linha.reverse()); }
	else { matriz.reverse(); }
}

let queda = 0;
let intervaloqueda = 500;
let atualizar = 0;

function update(time = 0) {
	const deltaTime = time - atualizar;
	atualizar = time;
	queda += deltaTime;

	if (queda >= intervaloqueda) {
		jogadorDrop();
	}

	movimento();
	requestAnimationFrame(update);
}

function atualizarPontos() {
	document.getElementById('score').innerText = jogador.score;
	document.getElementById('speed').innerText = Math.floor(jogador.speed);
}


document.addEventListener('keydown', event => {
	let mover = new Audio('sons/mover.mp3');
	let rodar = new Audio('sons/rodar.mp3');
	rodar.volume = 0.1;
	mover.volume = 0.1;

	if (event.key == 'ArrowLeft') {
		jogadorMove(-1);
		mover.play();
	} else if (event.key == 'ArrowRight') {
		jogadorMove(1);
		mover.play();
	} else if (event.key == 'ArrowDown') {
		jogadorDrop();
	} else if (event.key == 'q') {
		jogadorRoate(-1);
		rodar.play();
	} else if (event.key == 'w' || event.key == 'ArrowUp') {
		jogadorRoate(1);
		rodar.play();
	}
})

const music = document.getElementById('music');
const audio = new Audio('sons/musica.mp3');
audio.volume = 0.05;
audio.loop = true
let estado = false;

function musica() {
	if (estado) {
		audio.pause();
		music.value = 'Tocar música';
	} else {
		audio.play();
		music.value = 'Parar música';
	}
	estado = !estado;
}

music.addEventListener('click', musica);

atualizarPontos();
jogadorReset();
update();