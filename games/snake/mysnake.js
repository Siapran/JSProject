console.log($("#canvas"));

$(document).ready(function() {


	//Objets et globales :

	var snake = {
		size: 5,
		snake_array: new Array(),
		create: function() {
			this.snake_array = new Array();
			for (var i = 0; i <= 4; i++) {
				this.snake_array.push({
					x: i,
					y: 0
				});
			}
		},
		getSnakeHead: function() {
			return {
				x: snake.snake_array[0].x,
				y: snake.snake_array[0].y
			};
		},
		draw: function() {
			for (var i = 0; i < this.snake_array.length; i++) {
				remplir_cellule(this.snake_array[i].x, this.snake_array[i].y, "#0CED4D");
			};
		},
		deplacer: function(d) {

			// temp est une COPIE de la tête du serpent
			// var temp = this.snake_array[0];
			var temp = {
				x: this.snake_array[0].x,
				y: this.snake_array[0].y
			};

			if (d == "right") temp.x++;
			else if (d == "left") temp.x--;
			else if (d == "up") temp.y--;
			else if (d == "down") temp.y++;

			//Cas de relancement du jeu : on sort des bornes ou on rentre en collision
			//Les bornes sont en -1 et en taille du canvas/taille des rectangles
			//									soit la width ou la length
			// || check_collision(temp.x, temp.y, this.snake_array)
			if (check_collision(temp.x, temp.y, this.snake_array)) {
				console.log("hey");
			}
			if (temp.x == -1 || temp.x == canvas.width / sizeOfRectangle || temp.y == -1 || temp.y == canvas.height / sizeOfRectangle) {
				game.restart();
			} else {
				//Cas ou le serpent mange la nourriture
				if (temp.x == game.food.x && temp.y == game.food.y) {
					//on récupère la tête du serpent EN PRENANT EN COMPTE LES MODIFICATIONS EVENMENETIEL
					var tail = {
						x: temp.x,
						y: temp.y
					};
					game.score++;
					game.createFood();
				} else { // Cas ou le serpent se déplace sans manger
					//on récupère la queue en la retirant
					var tail = this.snake_array.pop();
					tail.x = temp.x;
					tail.y = temp.y;
					// la queue a désormais les valeurs de notre tête EN PRENANT EN COMPTE LES MODIFICATIONS EVENMENETIEL
				}

				//Insère la queue en tête
				//Ainsi si on a mangé, on ne retire pas d'élément et on ajoute un élément devant la tête
				//Si on a rien mangé, on insère le dernière élément qui a les nouvelles valeurs de la modification devant
				this.snake_array.unshift(tail);
			}
		}
	};


	//Variables du jeu stockées dans game :


	var game = {
		food: {
			x: 0,
			y: 0
		},
		createFood: function() {
			//On normifie la valeur avec sizeOfRectangle car sur le canvas on manipule x et y par la taille de ce rectangle
			this.food.x = Math.round(Math.random() * (canvas.width - sizeOfRectangle) / sizeOfRectangle);
			this.food.y = Math.round(Math.random() * (canvas.height - sizeOfRectangle) / sizeOfRectangle);
			//dessiner la nourriture
			remplir_cellule(this.food.x, this.food.y, "#FF4A0C");
		},
		drawFood: function() {
			//dessiner la nourriture
			remplir_cellule(this.food.x, this.food.y, "#FF4A0C");
		},
		restart: function() {
			this.d = "right";
			this.score = 0;
			snake.create();
			game.createFood();
			play();
		},
		d: "right", // par défault on fait partir le snake vers le bas
		score: 0 // par défaut score de 0
	}

	var canvas = {
		width: $("#canvas").width(),
		height: $("#canvas").height(),
		context: $("#canvas")[0].getContext("2d")
	};
	var sizeOfRectangle = 10;



	//Fonction remplissant une celulle en position(x,y) de la couleur demandée avec une bordure blanche
	function remplir_cellule(x, y, color) {
		canvas.context.fillStyle = color;
		canvas.context.fillRect(x * sizeOfRectangle, y * sizeOfRectangle, sizeOfRectangle, sizeOfRectangle);
		canvas.context.strokeStyle = "white";
		canvas.context.strokeRect(x * sizeOfRectangle, y * sizeOfRectangle, sizeOfRectangle, sizeOfRectangle);
	}


	//Afin d'éviter d'avoir l'ancien serpent dessiné on redessinera le fond
	function drawBackGround() {
		canvas.context.fillStyle = "white";
		canvas.context.fillRect(0, 0, canvas.width, canvas.height);
		canvas.context.strokeStyle = "black";
		canvas.context.strokeRect(0, 0, canvas.width, canvas.height);
	}


	// renvoie vrai si une case de l'array est la même que la case(x,y)
	// typiquement on appliquera cette fonction sur la tête du serpent avec le serpent
	function check_collision(x, y, array) {
		for (var i = 0; i < array.length; i++) {
			// console.log(x + " = " + array[i].x);
			// console.log(y + " = " + array[i].y);

			if (array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}

	//On récupère l'évènement de touche enfoncée
	$(document).keydown(function(e) {
		//On récupère la touche enfoncée
		var key = e.which;
		//On la compare avec les numéro de touches (37 = flèche de droite etc.)
		//On vérifie aussi que la nvl direction est pas opposée à l'ancienne
		if (key == "37" && game.d != "right") game.d = "left";
		else if (key == "38" && game.d != "down") game.d = "up";
		else if (key == "39" && game.d != "left") game.d = "right";
		else if (key == "40" && game.d != "up") game.d = "down";
	})

	snake.create();
	game.createFood();



	if (typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(play, 100);


	function play() {
		snake.deplacer(game.d);
		drawBackGround();
		snake.draw();
		game.drawFood();
	}

});