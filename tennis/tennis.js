function main() {
	started = false;
	
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	var bg = document.getElementById("bg");
	
	var intro = document.getElementById("intro");
	var intro_p = false;
	
	var warning = document.getElementById("warning");
	var warn = false;
	
	var center = {x: canvas.width/2, y: canvas.height/2};
	
	var p_w = 180;
	var p_h = 10;	
	
	var p1 = 0;
	var p2 = 0;
	
	var y1 = p_h;
	var y2 = canvas.height - p_h;

	var ball = { x: 0, y: 0, r: 20, vx: 0, vy: 0, color: 'rgba(255,0,0,1)' }
	var player1 = {x: center.x-p_w/2, vx: 0, color: 'rgba(0,255,0,1)'};
	var player2 = {x: center.x-p_w/2, vx: 0, color: 'rgba(0,0,255,1)'};

	
	var buttons = {l1: 0, r1: 0, l2: 0, r2: 0};
	
	ball.x = center.x;
	ball.y = center.y;
	
	function start() {
		if(!started) {
			document.body.onkeydown = keyDown;
			document.body.onkeyup = keyUp;
			canvas.removeEventListener('click', start);
			ball.x = center.x;
			ball.y = center.y;
			if(getRandomNumber(-1,1)<0) var k1 = -1;
			else var k1 = 1;
			if(getRandomNumber(-1,1)<0) var k2 = -1;
			else var k2 = 1;
			ball.vx = k1*getRandomNumber(1,5);
			ball.vy = k2*getRandomNumber(2,5);
			started = true;
			intro_p = true;
			warn = false;
		}
	}
	

	function step() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(bg,0,0);
		ballPlayer();
		drawBall(ball);
		drawPlayers([player1, player2]);
		moveBall(ball);
		movePlayers();
		if(!intro_p) {
			ctx.drawImage(intro, canvas.width/2-intro.width/2, canvas.height/2-intro.height/2-warning.height/2);
			ctx.drawImage(warning, canvas.width/2-warning.width/2, canvas.height/2+intro.height/2+10-warning.height/2);
		}
		if(warn) ctx.drawImage(warning, canvas.width/2-warning.width/2, canvas.height/2+warning.height/2);
	}
	
	function drawBall(c) {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
		ctx.fillStyle = c.color;
		ctx.fill();
	}
	
	function drawPlayers(players) {
		for(var i = 0; i<players.length; i++) {
			ctx.beginPath();
			ctx.rect(players[i].x,(canvas.height-10)*i,p_w,p_h);
			ctx.fillStyle = players[i].color;
			ctx.fill();
		}
	}
	
	function keyDown(e) {
	    if (e.which == 37)
			buttons.l1 = 1;
        else if (e.which == 39)
            buttons.r1 = 1;
		if (e.which == 65)
            buttons.l2 = 1;
        else if (e.which == 68)
            buttons.r2 = 1;
	}
	
	function keyUp(e) {
	    if (e.which == 37)
			buttons.l1 = 0;
        else if (e.which == 39)
            buttons.r1 = 0;
		if (e.which == 65)
            buttons.l2 = 0;
        else if (e.which == 68)
            buttons.r2 = 0;
    }
	
	function movePlayers() {
        if (buttons.l1 == 1)
			if(player1.x > 0)
				player1.x -= 10;
        if (buttons.r1 == 1)
			if(player1.x < canvas.width-p_w)
				player1.x += 10;
		if (buttons.l2 == 1)
			if(player2.x > 0)
				player2.x -= 10;
        if (buttons.r2 == 1)
			if(player2.x < canvas.width-p_w)
				player2.x += 10;
    }
	
	function moveBall(c) {
		// изменение скорости
		if (c.x < c.r || c.x > canvas.clientWidth - c.r)
			c.vx = -c.vx;
		if (c.y < c.r) playerOne();
		if (c.y > canvas.clientHeight - c.r) playerTwo();

		// изменение координат
		c.x += c.vx;
		c.y += c.vy;
	}
	
	function ballPlayer() {
		if(ball.y+ball.r >= y2)
			if(ball.x+ball.r >= player2.x && ball.x-ball.r <= player2.x+p_w) {
				ball.vy = -ball.vy;
				if (buttons.l2 == 1) ball.vx=ball.vx-2;
				else if (buttons.r2 == 1) ball.vx=ball.vx+2;
			}
		if(ball.y-ball.r <= y1)
			if(ball.x+ball.r >= player1.x && ball.x-ball.r <= player1.x+p_w) {
				ball.vy = -ball.vy;
				if (buttons.l1 == 1) ball.vx=ball.vx-2;
				else if (buttons.r1 == 1) ball.vx=ball.vx+2;
			}
	}
	
	function playerOne() {
		p2++;
		document.getElementById("pl2").innerHTML=p2;
		stop();
	}
	
	function playerTwo() {
		p1++;
		document.getElementById("pl1").innerHTML=p1;
		stop();
	}
	
	function stop() {
		started = false;
		player1 = {x: center.x-p_w/2, vx: 0, color: 'rgba(0,255,0,1)'};
		player2 = {x: center.x-p_w/2, vx: 0, color: 'rgba(0,0,255,1)'};		
		ball.x = center.x;
		ball.y = center.y;
		ball.vx = 0;
		ball.vy = 0;
		warn = true;
		document.body.onkeydown = space;
	}
	
	function getRandomNumber(min, max) { // рандомизатор
		return Math.random() * (max - min) + min;
	}
	
	var timer = setInterval(step, 10);
	canvas.onclick = start;
	
	function space(e) {
		if(e.which == 32)
			start();
	}
	document.body.onkeydown = space;
	
	canvas.addEventListener('click', start, false);
}

window.onload = main;