"use strict"

var
	canvas = document.getElementById("snakeCanvas"),
 	ctx    = canvas.getContext("2d"),
 	canvasWidth  = $("#snakeCanvas").width(),
 	canvasHeight = $("#snakeCanvas").height(),

 	canvasText = document.getElementById("scoreCanvas"),
 	ctx_txt = canvasText.getContext("2d");
 	ctx_txt.font = "60px Arial";
 	ctx_txt.fillStyle = "red";


var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var myIndexOf = function (arr, obj) {
	var hateJS = false;
  arr.forEach(function (item) {
		if (obj.equals(item)) { // O(??)
			hateJS = true;
		}
	});
	return hateJS;
};

function Point(x,y,ctx) {
	this.x = x;
	this.y = y;
	this.ctx = ctx;
};

Point.prototype.print = function() {
	this.ctx.fillStyle = "red";
	ctx.fillRect(this.x*10, this.y*10, 10,10);
};
Point.prototype.equals = function(other) {
	return (this.x === other.x) && (this.y === other.y);
};

var Snake = (function(ctx) {
	var body = [],
			head, direction, ate;

	[1,2,3].forEach(function(i) {
		body.push(new Point(i,10,ctx));
	});

	head = body[body.length - 1];

	var print = function() {
		body.forEach(function(p) {
			p.print();
		});
	}

	var move = function (food) {
		var new_head;
		switch (direction) {
			case "right":
				new_head = new Point(head.x + 1, head.y, ctx);
				break;
			case "up":
				new_head = new Point(head.x, head.y - 1, ctx);
				break;
			case "down":
				new_head = new Point(head.x, head.y + 1, ctx);
				break;
			case "left":
				new_head = new Point(head.x - 1, head.y, ctx);
				break;
			default: return;
		};

		if (validMove(new_head)) {
			body.push(new_head);
		}
		else {return gameOver();}

		ate = food.equals(new_head);

		if(!ate) {
			body.shift();
		}
		head = new_head;
	};

	var validMove = function(new_head) {
		return !((new_head.x >= canvasWidth/10) || (new_head.x < 0) || (new_head.y >= canvasHeight/10) || (new_head.y < 0)
						|| (myIndexOf(body, new_head))); // O(n) -> can go O(1) if the body is a dictionary!..but too much refactoring
	}
	var setDirection = function(d) {
		direction = d;
	};

	var hasAte = function() {
		return ate;
	}

	var showScore = function() {
		ctx_txt.fillText("Score: " + (body.length - 3), 240, 170);
	}
	var gameOver = function() {
		ctx.font = "60px Arial";
 		ctx.fillStyle = "red";
 		ctx.textAlign = "center";

		ctx.fillText("GAME OVER!!!", canvasWidth/2, canvasHeight/2);
	}

	var setLvl = function() {
			return Math.floor((body.length - 3) / 15) + 1;
			//през 15, the speed is raising
	}

	return {
		print: print,
		move: move,
		validMove: validMove,
		setDirection: setDirection,
		hasAte: hasAte,
		showScore: showScore,
		gameOver: gameOver,
		setLvl: setLvl
	}
}(ctx));


$(document).ready(function() {
	var
		randomX = getRandomInt(0,canvasWidth/10),
		randomY = getRandomInt(0,canvasHeight/10),
		food = new Point(randomX, randomY, ctx),

		initKeyBrdTable = {
		 "37": "left",
		 "38": "up",
		 "39": "right",
		 "40": "down"
	},
		levelsTable = {
			"1": "100",
			"2" : "75",
			"3" : "50",
			"4" : "25"

		};

	$(document).keydown(function(e) {
     Snake.setDirection(initKeyBrdTable[e.keyCode]);
   });

	Snake.print();

	setInterval(function() {
		ctx.clearRect(0,0,canvasWidth, canvasHeight);
		ctx_txt.clearRect(0,0,canvasWidth, canvasHeight);

		Snake.showScore();
		Snake.move(food);
		Snake.print();
		if (Snake.hasAte()) {
		food = new Point(getRandomInt(0,canvasHeight/10 - 2),
                     getRandomInt(0,canvasHeight/10 - 2),
                     ctx); }
		food.print();
		Snake.setLvl();
	},levelsTable[Snake.setLvl()]);
});

