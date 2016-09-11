var test = function(claim, message) {
	if (claim) {
		return true;
	} else {
		throw message;
	}
};


var board = {
	columns: [],

	Column: function() {
		this.stack = ["none", "none", "none", "none", "none", "none"];				
	},

	makeColumns: function() {
		for (i = 0; i < 7; i += 1) {
			this.columns.push(new this.Column());
		};
	},

	turn: "red",

	isGameOver: false,

	switchTurn: function(){
	// switches palyers turn by changing background color red or black
		if (this.turn == "red"){

			this.turn = "black";
			test(this.turn == "black", "Turn was never switched.");

			var mouse = document.getElementById("container");
			mouse.style.cursor = "url(black.png), auto";

			var goRed = document.getElementById("goRed");
			goRed.style.opacity = "0.2";

			var goBlack = document.getElementById("goBlack");
			goBlack.style.opacity = "1.0";

		} else if (this.turn == "black"){

			this.turn = "red";
			test(this.turn == "red", "Turn was never switched.");

			var mouse = document.getElementById("container");
			mouse.style.cursor = "url(red.png), auto";

			var goRed = document.getElementById("goRed");
			goRed.style.opacity = "1.0";

			var goBlack = document.getElementById("goBlack");
			goBlack.style.opacity = "0.2";

		}
	},

	checkStack: function(xCor, yCor, cell) {
	// Checks the stack array to decide what color to make the cell
		if (board.columns[xCor].stack[yCor] == "red"){
			cell.style.backgroundColor = "red";
			test(cell.style.backgroundColor == "red", "Cell not assigned correct background color (red) in board.checkStack");
		} else if (board.columns[xCor].stack[yCor] == "black") {
			cell.style.backgroundColor = "black";
			test(cell.style.backgroundColor == "black", "Cell not assigned correct background color (black) in board.checkStack");
		}
	},

	cellClick: function(xCor, yCor) {
	// What will happen when a cell is clicked

		//Update stack
		var checkThis = board.columns[xCor].stack.indexOf("none");
		if(checkThis != -1) {
			test(Number.isInteger(checkThis), "checkThis is not an integer in board.cellClick");
			board.columns[xCor].stack[checkThis] = board.turn;
			test(board.columns[xCor].stack[checkThis] == board.turn, "Stack not updated properly in board.cellClick");
		} else if (checkThis == -1) {
			alert("This column is full.");
		}
		
		// Dropping chip into column
		var cols = document.getElementsByClassName("column")[xCor];
		test(cols, "No element in cols in board.cellClick");
		var targetCell = cols.getElementsByClassName("cell");
		test(targetCell, "No element in targetCell in board.cellClick");
		targetCell[checkThis].style.backgroundColor = board.turn;
		test(targetCell[checkThis].style.backgroundColor, "targetCell not assigned a background color in board.cellClick");

		//Destroy the board
		var target = document.getElementById("container");
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		test(target.firstChild == null, "board not destroyed in board.cellClick");

		// Switch turns
		board.switchTurn();

		// Call in the board again
		board.makeTable();

		// Check if anyone has won
		board.checkForAWin();
	},

	mouseIn: function(xCor) {
	// Previews where the chip will be placed when hovering over a column
		test(Number.isInteger(xCor), "xCor is not an integer in mouseIn");

		var checkIndex = board.columns[xCor].stack.indexOf("none");

		if(checkIndex == 0){
			var cellCor = 5; 
		} else if (checkIndex == 1){
			var cellCor = 4;
		} else if (checkIndex == 2){
			var cellCor = 3;
		} else if (checkIndex == 3){
			var cellCor = 2;
		} else if (checkIndex == 4) {
			var cellCor = 1;
		} else if (checkIndex == 5) {
			var cellCor = 0;
		}

		var allCols = document.getElementsByClassName("column")[xCor];
		var tarCell = allCols.getElementsByClassName("cell");
		test(tarCell, "No element in tarCell in board.cellClick");
		tarCell[cellCor].style.backgroundColor = board.turn;
		tarCell[cellCor].style.opacity = "0.6";
		test(tarCell[cellCor].style.backgroundColor, "tarCell not assigned a background color in board.cellClick");		
	},

	mouseOut: function(xCor) {
	// Returns the background color of the previewed cell to normal when no longer hovering on column
		test(Number.isInteger(xCor), "xCor is not an integer");

			var checkIndex = board.columns[xCor].stack.indexOf("none");
			if(checkIndex == 0){
			var cellCor = 5; 
			} else if (checkIndex == 1){
				var cellCor = 4;
			} else if (checkIndex == 2){
				var cellCor = 3;
			} else if (checkIndex == 3){
				var cellCor = 2;
			} else if (checkIndex == 4) {
				var cellCor = 1;
			} else if (checkIndex == 5) {
				var cellCor = 0;
			}
			var allCols = document.getElementsByClassName("column")[xCor];
			var tarCell = allCols.getElementsByClassName("cell");
			test(tarCell, "No element in tarCell in board.cellClick");
			tarCell[cellCor].style.backgroundColor = "transparent";
			tarCell[cellCor].style.opacity = "1.0";
			test(tarCell[cellCor].style.backgroundColor, "tarCell not assigned a background color in board.cellClick");
	},

	cellLoop: function(xCor, yCor) {
		// Creates an individual cell
		var cell = document.createElement("div");
		test(cell, "cell does not exist in board.displayBoard");
		cell.setAttribute("class", "cell");
		cell.style.backgroundImage = "url(connectFourYellow.png)";
		test(cell.style.backgroundImage, "cell was not assigned background image in board.displayBoard");
		this.checkStack(xCor, yCor, cell);
		//cell.innerHTML = xCor + ", " + yCor;
		
		cell.onmouseover = function(){
			board.mouseIn(xCor);
		}
		cell.onmouseout = function() {
			board.mouseOut(xCor);
		}
		cell.onclick = function() {
			// Attaches onclick function to each cell
			board.cellClick(xCor, yCor);

		};
		return cell;
	},

	cellLoopFinal: function(xCor, yCor) {
		// Creates an individual cell
		var cell = document.createElement("div");
		test(cell, "cell does not exist in board.displayBoard");
		cell.setAttribute("class", "cell");
		cell.style.backgroundImage = "url(connectFourYellow.png)";
		test(cell.style.backgroundImage, "cell was not assigned background image in board.displayBoard");
		this.checkStack(xCor, yCor, cell);
		return cell;
	},

	columnLoop: function() {
		// Creates a single column and appends 6 cells to the column.
		var col = document.createElement("div");
		test(col, "col does not exist in board.displayBoard");
		col.setAttribute("class", "column");
		col.xCor = c;
		var xCoordinate = col.xCor;
		for (var i = 5; i >= 0; i--) {
			col.yCor = i;
			if (this.isGameOver == false){
				col.appendChild(this.cellLoop(col.xCor, col.yCor));
			}
			else if (this.isGameOver == true) {
				col.appendChild(this.cellLoopFinal(col.xCor, col.yCor));
			}
			
		}		
		return col;
	},

	makeTable: function() {
		// Calls in container and appends seven columns to container
			var container = document.getElementById("container");
			test(container, "There is nothing assigned to container in board.displayBoard");
			for (c = 0; c < 7; c++) {
				container.appendChild(this.columnLoop());
			}
		
	},

	wins: [[{"column":0,"stack":0},{"column":0,"stack":1},{"column":0,"stack":2},{"column":0,"stack":3}],[{"column":0,"stack":1},{"column":0,"stack":2},{"column":0,"stack":3},{"column":0,"stack":4}],[{"column":0,"stack":2},{"column":0,"stack":3},{"column":0,"stack":4},{"column":0,"stack":5}],[{"column":1,"stack":0},{"column":1,"stack":1},{"column":1,"stack":2},{"column":1,"stack":3}],[{"column":1,"stack":1},{"column":1,"stack":2},{"column":1,"stack":3},{"column":1,"stack":4}],[{"column":1,"stack":2},{"column":1,"stack":3},{"column":1,"stack":4},{"column":1,"stack":5}],[{"column":2,"stack":0},{"column":2,"stack":1},{"column":2,"stack":2},{"column":2,"stack":3}],[{"column":2,"stack":1},{"column":2,"stack":2},{"column":2,"stack":3},{"column":2,"stack":4}],[{"column":2,"stack":2},{"column":2,"stack":3},{"column":2,"stack":4},{"column":2,"stack":5}],[{"column":3,"stack":0},{"column":3,"stack":1},{"column":3,"stack":2},{"column":3,"stack":3}],[{"column":3,"stack":1},{"column":3,"stack":2},{"column":3,"stack":3},{"column":3,"stack":4}],[{"column":3,"stack":2},{"column":3,"stack":3},{"column":3,"stack":4},{"column":3,"stack":5}],[{"column":4,"stack":0},{"column":4,"stack":1},{"column":4,"stack":2},{"column":4,"stack":3}],[{"column":4,"stack":1},{"column":4,"stack":2},{"column":4,"stack":3},{"column":4,"stack":4}],[{"column":4,"stack":2},{"column":4,"stack":3},{"column":4,"stack":4},{"column":4,"stack":5}],[{"column":5,"stack":0},{"column":5,"stack":1},{"column":5,"stack":2},{"column":5,"stack":3}],[{"column":5,"stack":1},{"column":5,"stack":2},{"column":5,"stack":3},{"column":5,"stack":4}],[{"column":5,"stack":2},{"column":5,"stack":3},{"column":5,"stack":4},{"column":5,"stack":5}],[{"column":6,"stack":0},{"column":6,"stack":1},{"column":6,"stack":2},{"column":6,"stack":3}],[{"column":6,"stack":1},{"column":6,"stack":2},{"column":6,"stack":3},{"column":6,"stack":4}],[{"column":6,"stack":2},{"column":6,"stack":3},{"column":6,"stack":4},{"column":6,"stack":5}],[{"column":0,"stack":0},{"column":1,"stack":0},{"column":2,"stack":0},{"column":3,"stack":0}],[{"column":1,"stack":0},{"column":2,"stack":0},{"column":3,"stack":0},{"column":4,"stack":0}],[{"column":2,"stack":0},{"column":3,"stack":0},{"column":4,"stack":0},{"column":5,"stack":0}],[{"column":3,"stack":0},{"column":4,"stack":0},{"column":5,"stack":0},{"column":6,"stack":0}],[{"column":0,"stack":1},{"column":1,"stack":1},{"column":2,"stack":1},{"column":3,"stack":1}],[{"column":1,"stack":1},{"column":2,"stack":1},{"column":3,"stack":1},{"column":4,"stack":1}],[{"column":2,"stack":1},{"column":3,"stack":1},{"column":4,"stack":1},{"column":5,"stack":1}],[{"column":3,"stack":1},{"column":4,"stack":1},{"column":5,"stack":1},{"column":6,"stack":1}],[{"column":0,"stack":2},{"column":1,"stack":2},{"column":2,"stack":2},{"column":3,"stack":2}],[{"column":1,"stack":2},{"column":2,"stack":2},{"column":3,"stack":2},{"column":4,"stack":2}],[{"column":2,"stack":2},{"column":3,"stack":2},{"column":4,"stack":2},{"column":5,"stack":2}],[{"column":3,"stack":2},{"column":4,"stack":2},{"column":5,"stack":2},{"column":6,"stack":2}],[{"column":0,"stack":3},{"column":1,"stack":3},{"column":2,"stack":3},{"column":3,"stack":3}],[{"column":1,"stack":3},{"column":2,"stack":3},{"column":3,"stack":3},{"column":4,"stack":3}],[{"column":2,"stack":3},{"column":3,"stack":3},{"column":4,"stack":3},{"column":5,"stack":3}],[{"column":3,"stack":3},{"column":4,"stack":3},{"column":5,"stack":3},{"column":6,"stack":3}],[{"column":0,"stack":4},{"column":1,"stack":4},{"column":2,"stack":4},{"column":3,"stack":4}],[{"column":1,"stack":4},{"column":2,"stack":4},{"column":3,"stack":4},{"column":4,"stack":4}],[{"column":2,"stack":4},{"column":3,"stack":4},{"column":4,"stack":4},{"column":5,"stack":4}],[{"column":3,"stack":4},{"column":4,"stack":4},{"column":5,"stack":4},{"column":6,"stack":4}],[{"column":0,"stack":5},{"column":1,"stack":5},{"column":2,"stack":5},{"column":3,"stack":5}],[{"column":1,"stack":5},{"column":2,"stack":5},{"column":3,"stack":5},{"column":4,"stack":5}],[{"column":2,"stack":5},{"column":3,"stack":5},{"column":4,"stack":5},{"column":5,"stack":5}],[{"column":3,"stack":5},{"column":4,"stack":5},{"column":5,"stack":5},{"column":6,"stack":5}],[{"column":0,"stack":0},{"column":1,"stack":1},{"column":2,"stack":2},{"column":3,"stack":3}],[{"column":0,"stack":1},{"column":1,"stack":2},{"column":2,"stack":3},{"column":3,"stack":4}],[{"column":0,"stack":2},{"column":1,"stack":3},{"column":2,"stack":4},{"column":3,"stack":5}],[{"column":1,"stack":0},{"column":2,"stack":1},{"column":3,"stack":2},{"column":4,"stack":3}],[{"column":1,"stack":1},{"column":2,"stack":2},{"column":3,"stack":3},{"column":4,"stack":4}],[{"column":1,"stack":2},{"column":2,"stack":3},{"column":3,"stack":4},{"column":4,"stack":5}],[{"column":2,"stack":0},{"column":3,"stack":1},{"column":4,"stack":2},{"column":5,"stack":3}],[{"column":2,"stack":1},{"column":3,"stack":2},{"column":4,"stack":3},{"column":5,"stack":4}],[{"column":2,"stack":2},{"column":3,"stack":3},{"column":4,"stack":4},{"column":5,"stack":5}],[{"column":3,"stack":0},{"column":4,"stack":1},{"column":5,"stack":2},{"column":6,"stack":3}],[{"column":3,"stack":1},{"column":4,"stack":2},{"column":5,"stack":3},{"column":6,"stack":4}],[{"column":3,"stack":2},{"column":4,"stack":3},{"column":5,"stack":4},{"column":6,"stack":5}],[{"column":0,"stack":5},{"column":1,"stack":4},{"column":2,"stack":3},{"column":3,"stack":2}],[{"column":0,"stack":4},{"column":1,"stack":3},{"column":2,"stack":2},{"column":3,"stack":1}],[{"column":0,"stack":3},{"column":1,"stack":2},{"column":2,"stack":1},{"column":3,"stack":0}],[{"column":1,"stack":5},{"column":2,"stack":4},{"column":3,"stack":3},{"column":4,"stack":2}],[{"column":1,"stack":4},{"column":2,"stack":3},{"column":3,"stack":2},{"column":4,"stack":1}],[{"column":1,"stack":3},{"column":2,"stack":2},{"column":3,"stack":1},{"column":4,"stack":0}],[{"column":2,"stack":5},{"column":3,"stack":4},{"column":4,"stack":3},{"column":5,"stack":2}],[{"column":2,"stack":4},{"column":3,"stack":3},{"column":4,"stack":2},{"column":5,"stack":1}],[{"column":2,"stack":3},{"column":3,"stack":2},{"column":4,"stack":1},{"column":5,"stack":0}],[{"column":3,"stack":5},{"column":4,"stack":4},{"column":5,"stack":3},{"column":6,"stack":2}],[{"column":3,"stack":4},{"column":4,"stack":3},{"column":5,"stack":2},{"column":6,"stack":1}],[{"column":3,"stack":3},{"column":4,"stack":2},{"column":5,"stack":1},{"column":6,"stack":0}]],

	checkForAWin: function() {
		// checks win array against the state of the board for winning combinations
		var cont = true;
		if(cont){
			test(this.wins.length == 69, "this.wins does not contain all possible wins.");
			for (var set = 0; set < this.wins.length; set++) {
				var str = "";
				var winCor = [];
				for (var coordinatePair = 0; coordinatePair < 4; coordinatePair++) {
					var outcome = board.columns[this.wins[set][coordinatePair].column].stack[this.wins[set][coordinatePair].stack];
					test((outcome == "red" || outcome == "black" || outcome == "none"), "There is an unknown entity found in board.columns.stack in board.checkForAWin");
					str += outcome;
					winCor.push([set, coordinatePair]);
				}
				var reRed = /^redredredred$/;
				var reBlack = /^blackblackblackblack$/;
				if(reRed.test(str)){
					alert("Red wins!");
					board.highlightWin(winCor);
					cont = false;
				} else if (reBlack.test(str)){
					alert("Black wins!");
					board.highlightWin(winCor);
					cont = false;
				}
			}
		}
		
	},

	highlightWin: function(winCor) {
		
		//Destroy the board
		var target = document.getElementById("container");
		while (target.firstChild) {
			target.removeChild(target.firstChild);
		}
		test(target.firstChild == null, "board not destroyed in board.cellClick");
		this.isGameOver = true;
		board.makeTable();
		for (var i = 0; i < 4; i++) {
			var set = winCor[i][0];
			var coordinatePair = winCor[i][1];
			var winningCols = document.getElementsByClassName("column")[this.wins[set][coordinatePair].column];

			if(this.wins[set][coordinatePair].stack == 0){
				var winStack = 5;
			} else if (this.wins[set][coordinatePair].stack == 1){
				var winStack = 4;
			} else if (this.wins[set][coordinatePair].stack == 2){
				var winStack = 3;
			} else if (this.wins[set][coordinatePair].stack == 3){
				var winStack = 2;
			} else if (this.wins[set][coordinatePair].stack == 4){
				var winStack = 1;
			} else if (this.wins[set][coordinatePair].stack == 5){
				var winStack = 0;
			}
			var winningRows = winningCols.getElementsByClassName("cell")[winStack];

			winningRows.style.opacity = "0.6";

		}

		var mouse = document.getElementById("container");
		mouse.style.cursor = "default";
	}

};


board.makeColumns();
board.makeTable();
console.log(board.isGameOver);
