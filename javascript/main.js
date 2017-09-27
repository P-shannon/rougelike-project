//World Logics//

//This makes the world
//Y axis
var world = new Array(25);
for (i=0;i < world.length;i++){
	// X axis
	world[i] = new Array(25);
	// remember, from now on when addressing paces the y axis comes first
	// then the x axis. So, world[y][x] like so.
}

function makeWorld(){
	//First step: fill the world with deep water
	//for everything in the y axis...
	for (i=0;i < world.length;i++){
		//for everything in the x axis...
		for(j=0;j < world[i].length;j++){
			//Put a deep blue '~'.
			world[i][j] = "<span style='color:blue'>~</span>";
		}
	}
}

function populateWorld(x,y,mark,length){
	//Second step: roughly attempts to add land masses and features to the 
	//ocean to roughly resemble an island 
	
	//Empty the screen
	clearLog();

	//Set the defaults...
	if (x === undefined){
		//randomly gets a coordinate that isn't out of bounds
		x = Math.floor(Math.random()*world[0].length);
	}
	if (y === undefined){
		y = Math.floor(Math.random()*world.length);
	}
	if (mark === undefined){
		//randomly gets a feature from an array of possible features.
		mark = pickFeature();
	}
	if (length === undefined){
		length = 5;
	}
	//Tell us where we landed in the console
	console.log("x: "+x+";y: "+y);
	//place the feature
	world[y][x] = mark;
	//set the global looping variables. 
	//These need to be global (or of elevated scope) 
	//because the child loops need to see the other loop's progress.
	var i = 0;
	var j = 0;
	var k = 0;

	//we start on the inside then spiral outward
	for (i = 1;i <= length;i++){
		//up
		for (j = (i * -1);j <= i;j++){
			console.log("J: "+j+" I: "+i+" one");
			//offset the initial point by our current iteration values
			world[y+j][x+k] = "!";
		};
		//right
		for (k = (i * -1);k <= i;k++){
			console.log("K: "+k+" I: "+i+" two");
			world[y+j][x+k] = "?";
		};
		//down
		for (j = i;j >= i*-1;j--){
			console.log("J: "+j+" I: "+i+" three");
			world[y+j][x+k] = "1";
		};
		//left
		for (k = i;k >= i*-1;k--){
			console.log("K: "+k+" I: "+i+" four");
			world[y+j][x+k] = "|";
		};
	}

	/*no comments for derelicted code*/

	//Box generation
	// var rx = Math.ceil((length/2)* -1);
	// var ry = Math.ceil((length/2)* -1);
	// for (i=1;i <= length;i++){
	// 	for (j=1;j <= length;j++){
	// 		if ((x+rx) < 0 || (x+rx) > world[0].length-1 || (y+ry) < 0 || (y+ry) > world.length-1){
	// 			//do nothing
	// 			console.log("out of bounds");
	// 			ry++;
	// 			count++;
	// 		}
	// 		else{	
	// 			console.log("x: "+Number(x)+Number(rx)+";y: "+Number(y)+Number(ry));
	// 			world[x+rx][y+ry] = mark;
	// 			ry++;
	// 			count++;
	// 		}
	// 	}
	// 	rx++;
	// 	ry=Math.ceil((length/2)* -1);
	// }

	//Stream like generation
	// for(i=0;i<count;i++){
	// 	x += (Math.floor(Math.random()*3))-1;
	// 	y += (Math.floor(Math.random()*3))-1;
	// 	console.log("x: "+x+"; y: "+y);
	// 		if (x < 0 || x > world[0].length-1 || y < 0 || y > world.length-1){
	// 			showWorld();
	// 			return 0;
	// 		}
	// 		else{
	// 			world[y][x] = mark;
	// 		}
	// }

	//print the changes to the game screen
	showWorld();
}

//prints the current state of the world to the screen
function showWorld(){
	//Oh come on, just scroll up.
	for (i=0;i < world.length;i++){
		//before the start of a NEW row, empty our 'row' string
		var row = "";
		for(j=0;j < world[i].length;j++){
			//adds the current pace to the string in order
			row += world[i][j];
		}
		//row by row add the world to the screen
		gameLog(row);
	}
}

//randomly pick our geological feature
function pickFeature(){
	//we are using inner HTML for putting things into the game screen...
	var selection = ["<span style='color:cyan'>~</span>","<span style='color:white'>^</span>","<span style='color:yellow'>.</span>","<span style='color:green'>*</span>"]
	//randomly select our feature INCLUDING the last feature and the first feature.
	return selection[Math.floor(Math.random()*selection.length)];
}

//Mob Logics//
function Mob(name,atk,def,hp){
	this.name = name;
	this.atk = atk; 		//attack
	this.def = def; 		//defense
	this.hp = hp;   		//health points
	this.dead = false;		//are we dead?
	this.turnTimer = 1000;	//long long until our next turn?
	//attack other mobs
	this.attack = function(target){
		//tell the player(s) an attack occured
		gameLog(this.name+" attacks "+target.name);
		//make mob take damage according to it's defense
		target.takeDamage(this.atk-target.def);
	};
	//reduce a mob's health points
	this.takeDamage = function(dam) {
		//prevent negative damage
		if (dam <= 0) {
			dam = 0;
		};

		//tells us how much damage we took when we died
		if (dam < this.hp){
			this.hp -= dam;
			gameLog(this.name+" took "+dam+" damage leaving "+this.hp+" remaining.");
		}
		//tells us how much damage we took and how much more we can take
		else{
			this.hp = 0;
			this.dead = true;
			gameLog(this.name+" took "+dam+" damage and dies.");
		}
	};
	//sets a mob's properties
	this.initialize = function(name,atk,def,hp){
		this.name = name;
		this.atk = atk;
		this.def = def;
		this.hp = hp;
	};
};

//the object in charge of handling the mobs
function MobController(){
	//where all the mobs are created
	this.mobs = [];
	//add a new mob to the end of the array
	this.createMob = function(){
		this.mobs[this.mobs.length] = new Mob();
	};
	//allows a mob to take a turn (W.I.P.)
	this.giveTurn = function(Mob){
		//this.mobs[]
	}
}

//Create the player character
function createPlayer(){
	//get the values for the stats
	var name = prompt("What is your name?");
	var atk = prompt("Enter a number for your attack value.");
	var def = prompt("Enter a number for your defense value.");
	var hp = prompt("How much HP you want?");
	
	player.initialize(name,atk,def,hp);
	gameLog("Welcome to the world, "+player.name);
	unlockInterface();
};

function unlockInterface(){
	document.getElementById('primary').style.display="inline-block";
};

function gameLog(text){
	var log = document.getElementById('viewone');
	log.innerHTML += text+"<br>";
	log.scrollTop = log.scrollHeight;
}

function clearLog(){
	var log = document.getElementById('viewone');
	log.innerHTML = "";
}

//Main Runtime//
var gameMaster = new MobController();
var dummy = new Mob("dummy",0,5,1000);
var player = new Mob();

