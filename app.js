"use strict"

var
	canvas = document.getElementById("hackCanvas"),
 	ctx    = canvas.getContext("2d"),
 	canvasWidth  = $("#hackCanvas").width(),
 	canvasHeight = $("#hackCanvas").height(),

 	canvasText = document.getElementById("textCanvas"),
 	ctx_txt = canvasText.getContext("2d");

 	ctx_txt.font = "60px Arial";
 	ctx_txt.fillStyle = "red";


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Point(x,y, ctx) {
	this.x = x;
	this.y = y;
	this.ctx = ctx;
};

Point.prototype.print = function() {
	this.ctx.fillStyle = "red";
	ctx.fillRect(this.x*10, this.y*10, 10,10);
};

Point.prototype.move = function(direction) {
	if (direction === "right") {
		this.x += 1;
	}
	else if (direction === "left") {
		this.x -= 1;
	}
}

var Snake = (function(ctx) {
	var body = [],
			head, top, direction="",ate;

	[1,2,3].forEach(function(i) {
		body.push(new Point(i,10,ctx));
	});

	head = body[body.length - 1];
	top = body[0];

	var print = function() {
		body.forEach(function(p) {
			p.print();
		});
	}

	var grow = function(Point) {
		body.push(Point);
		this.print();
	};

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
		if (new_head.x >= canvasWidth/10) {
			new_head = new Point(0,head.y,ctx);
		}
		else if (new_head.x <= 0) {
			new_head = new Point(canvasWidth/10, head.y, ctx);
		}

		body.push(new_head);

		ctx_txt.clearRect(0,0,canvasWidth, canvasHeight);
		ate = (new_head.x === food.x && new_head.y === food.y);

		if(!ate) {
			body.shift();
		}
		head = new_head;
		top = body[0];

		ctx_txt.fillText(body.length, 240, 170);
	};
	var setDirection = function(d) {
		direction = d;
	};

	var hungry = function() {
		return !ate;
	}


	return {
		print: print,
		grow: grow,
		move: move,
		setDirection: setDirection,
		hungry: hungry
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
	};

	$(document).keydown(function(e) {
     Snake.setDirection(initKeyBrdTable[e.keyCode]);
   });

	Snake.print();

	setInterval(function() {
		ctx.clearRect(0,0,canvasWidth, canvasHeight);
		Snake.move(food);
		Snake.print();
		if (!Snake.hungry()) {
		food = new Point(getRandomInt(0,canvasHeight/10 - 2 ),
										 getRandomInt(0,canvasHeight/10 - 2),
										 ctx); }
		food.print();
	},100);

});

