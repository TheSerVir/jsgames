function main() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var bird = document.getElementById("bird");
	var tube = document.getElementById("tube");
	var play = document.getElementById("play");
	var gameover = document.getElementById("gameover");
	var bg = document.getElementById("bg");
	
	var y = canvas.height/2-bird.height/2; // координата птицы
	var vy = 0; // скорость падения/взлета
	var tube_x = 800; // положение труб
	var back_x = 0; // положение фона
	var speed = 2; // скорость движения птицы (на самом деле труб и фона)
	var x = canvas.width/3-bird.width/2+bird.width; // координата птицы
	
	var bg_copies = Math.ceil(canvas.width/bg.width)+1;
	
	var tubes_intr = 180; // между трубами горизонтально
	var tubes_intr_vert = 150; // между трубами вертикально
	
	var tubes = [ {y:-getRandomNumber(0,tube.height/2)}, 
	{y:-getRandomNumber(0, tube.height/2)},
	{y:-getRandomNumber(0, tube.height/2)},
	{y:-getRandomNumber(0, tube.height/2)},
	{y:-getRandomNumber(0, tube.height/2)}]; // добавляем трубы
	
	var started = false;
	
	function step() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		moveBackground(); // рисуем фон
		// выводим текущие очки
		i = 0;
		while(tube_x+i*(tube.width+tubes_intr) <= x) i++;
		document.getElementById("scores").innerHTML = i;
		
		if(started) {
			y+=vy; // падаем или взлетаем
			vy = 0.1+vy; // увеличиваем скорость падения
			tube_x-=speed; // смещаем трубы
			back_x-=speed; // смещаем фон
			drawTubes(tube_x); // рисуем трубы
		} else {
			ctx.drawImage(play, x+bird.width+20, canvas.height/2-play.height/2); // рисуем кнопку play
		}
		if(y>=canvas.height-bird.height || y <= 0) {
			i = 0;
			while(tube_x+i*(tube.width+tubes_intr) <= x) i++;
			gameOver(i);
			return;
		}
		//ctx.drawImage(bird,canvas.width/3-bird.width/2, y);
		drawImageRot(bird,x,y,bird.width,bird.height,vy*5)
	}
	
	function drawImageRot(img,x,y,width,height,deg){
		// Градусы в радианы
		var rad = deg * Math.PI / 180;
		// Задаем точкой вращения центр изображения
		ctx.translate(x + width / 2, y + height / 2);
		// Поворачиваем canvas
		ctx.rotate(rad);
		// Рисуем изображение  
		ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);
		// Возвращает canvas к начальному состоянию  
		ctx.rotate(rad * ( -1 ) );
		ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
	}
	
	function start() {
			vy = 1;
			started = true;
	}
	
	function click() {
		if(!started) start();
		vy = -4;
	}
	
	function getRandomNumber(min, max)
	{
		return Math.random() * (max - min) + min;
	}

	function drawTubes(tube_x) {
		for(var i = 0; i < tubes.length; i++) {
			if(tube_x+i*(tube.width+tubes_intr)+tube.width > 0) {
				drawImageRot(tube,tube_x+i*(tube.width+tubes_intr),tubes[i].y,tube.width,tube.height,180);
				ctx.drawImage(tube,tube_x+i*(tube.width+tubes_intr),tubes[i].y+tube.height+tubes_intr_vert);
				// проверяем на столкновение
				if(tube_x <= x+bird.width) { // если труба уже может быть задета
					if(x+bird.width >= tube_x+i*(tube.width+tubes_intr) && x <= tube_x+i*(tube.width+tubes_intr)+tube.width) {
						if(y+bird.height >= tubes[i].y+tube.height+tubes_intr_vert || y <= tubes[i].y+tube.height) {
							gameOver(i);
							return;
						}
					}
				}
			} else if(tubes[i+4] === undefined) tubes[tubes.length] = {y:-getRandomNumber(0, tube.height/2)}; // заменяем заехавший элемент на другой, если он еще не заменен
		}
	}
	
	function moveBackground() {
		if(back_x <= -bg.width)
			back_x = 0;
		for(var i = 0; i<bg_copies; i++)
			ctx.drawImage(bg,i*bg.width+back_x,canvas.height-bg.height);
	}
	
	function gameOver(i) {
		clearInterval(timer);
		if(i>document.getElementById("highscores").innerHTML) document.getElementById("highscores").innerHTML = i;
		x = -bird.width;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		moveBackground();
		ctx.drawImage(gameover, canvas.width/2-gameover.width/2, canvas.height/2-gameover.height/2);
		canvas.addEventListener('click', main, false);
	}
	
	var timer = setInterval(step, 10);
	
	canvas.removeEventListener('click', main);
	canvas.addEventListener('click', click, false);
}

window.onload = main;