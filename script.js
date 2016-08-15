
document.addEventListener("DOMContentLoaded", function() {

	"use strict";

	/* Variables and Elements */

	var game = {
		"strict": false,
		"userTurn": false,
		"userStep": 0,
		"maxRounds": 20,
		"roundNum": 0,
		"sequence": []
	};

	var sound1 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
		sound2 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
		sound3 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
		sound4 = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

	var sounds = [sound1, sound2, sound3, sound4];

	var message = document.getElementById("message");

	var roundTxt = document.getElementById("round-num");

	var greenBtn = document.getElementById("green-sq"),
		redBtn = document.getElementById("red-sq"),
		yellowBtn = document.getElementById("yellow-sq"),
		blueBtn = document.getElementById("blue-sq"),
		strictBtn = document.getElementById("strict-btn");

	var squares = [greenBtn, redBtn, yellowBtn, blueBtn];

	/* Click Events */

	document.getElementById("start-btn").addEventListener("click", newGame);
	document.getElementById("reset-btn").addEventListener("click", newGame);
	strictBtn.addEventListener("click", strictMode);
	greenBtn.addEventListener("mousedown", function(){userClick(0);});
	redBtn.addEventListener("mousedown", function(){userClick(1);});
	yellowBtn.addEventListener("mousedown", function(){userClick(2);});
	blueBtn.addEventListener("mousedown", function(){userClick(3);});

	// Toggle strict mode when the strict button is clicked
	function strictMode() {
		if (game.strict) {
			game.strict = false;
			strictBtn.classList.remove("active");
		} else {
			game.strict = true;
			strictBtn.classList.add("active");
		}
	}

	function newGame() {
		game.userTurn = false;
		game.userStep = 0;
		game.roundNum = 0;
		game.sequence = [];
		message.innerHTML = "Play back the sequence.";
		addStep();
		setTimeout(playSequence, 2000);
	}

	// Adds a random square to the sequence [0-3]
	function addStep() {
		game.sequence.push(Math.floor(Math.random() * 4));
		game.roundNum++;
		roundTxt.innerHTML = game.roundNum;
	}

	// Play the current sequence to the user
	function playSequence() {
		// Display a message based on the current round
		switch (game.roundNum) {
		case 5:
			message.innerHTML = "Keep it up!";
			break;
		case 10:
			message.innerHTML = "You're half-way there!";
			break;
		case 15:
			message.innerHTML = "Just 5 more to go.";
			break;
		default:
			message.innerHTML = "Play back the sequence.";
		}
		// Play each square with a 1s delay between them
		for (var i = 0; i < game.roundNum; i++) {
			setTimeout(animateSquare, i * 1000, game.sequence[i]);
		}
		// Allow the user to click after the sequence plays
		setTimeout(function(){game.userTurn = true;}, (game.roundNum - 1) * 1000);
	}

	// Animate the square [0-3] and play its corresponding sound
	function animateSquare(squareNum) {
		sounds[squareNum].play();
		squares[squareNum].style.opacity = "1";
		setTimeout(function unclick(){squares[squareNum].style.opacity = "0.6";}, 400);
	}

	function userClick(squareNum) {
		// Prevent clicks while the sequence is being played
		if (game.userTurn === true) {
			animateSquare(squareNum);
			// Case 1: Sequence was completed successfully
			if (squareNum === game.sequence[game.userStep] && game.userStep === game.roundNum - 1) {
				game.userTurn = false;
				// User wins at round 20
				if (game.roundNum === game.maxRounds) {
					message.innerHTML = "20 rounds completed. You've won!";
					setTimeout(newGame, 2000);
					return;
				}
				// Otherwise next round is started 
				else {
					addStep();
					setTimeout(playSequence, 2000);
					game.userStep = 0;
					return;
				}
			// Case 2: User input is correct, but there is more in the sequence
			} else if (squareNum === game.sequence[game.userStep]) {
				game.userStep++;
				return;
			// Case 3: User input is incorrect
			} else {
				game.userTurn = false;
				// Game restarts if in strict mode
				if (game.strict) {
					message.innerHTML = "Game over! Start again.";
					setTimeout(newGame, 2000);
					return;
				// Otherwise sequence replays and user tries again
				} else {
					message.innerHTML = "Try again!";
					setTimeout(playSequence, 2000);
					game.userStep = 0;
					return;
				}
			}
		}
	}

});
