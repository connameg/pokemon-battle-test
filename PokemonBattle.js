//Pokemon Battle Simulator! (work in progress)

//Pokemon constructor function
function Pokemon(name, maxHP, maxAtk, maxDef, maxSpAtk, maxSpDef, maxSpeed, HP, atk, def, spAtk, spDef, speed, statCondition, moves, type, items) {
	this.name = name;
  //max stats: these CANNOT be changed, except by level up
  this.maxHP = maxHP;
  this.maxAtk = maxAtk;
  this.maxDef = maxDef;
  this.maxSpAtk = maxSpAtk;
  this.maxSpDef = maxSpDef; 
  this.maxSpeed = maxSpeed;
  //these stats CAN be changed:
	this.HP = HP;
	this.atk = atk;
	this.def = def;
	this.spAtk = spAtk;
	this.spDef = spDef; 
	this.speed = speed;
	this.statCondition = statCondition;
	this.moves = moves;                   //takes an array of moves
	this.type = type;                     //elemental typing of the pokemon
  this.items = items;
	//reduces HP:
	this.takeDamage = function(amt){      //called by Move.dealDamage() method
		this.HP -= amt;                     //subtract damage from HP stat
		console.log(this.name + " took " + amt + " damage!");
			if (this.HP <= 0) {               //when HP reaches 0, the Pokemon faints
        console.log(this.name + " has fainted!");
			} else {
        console.log(this.name + " has " + this.HP + " HP left");
			}
	};
  //raises a single stat:
	this.raiseStat = function(stat, amt){                  //called by Item.heal() and StatusMove.changeStat()
    if (stat === "HP") {                                 //if HP is being raised...
      if (this.HP + amt >= this.maxHP) {                           //if heal amount is greater than the maxHP
        console.log(this.name + " gained " + (this.maxHP - this.HP) + " HP");
        var healHP = this.maxHP;                         //cap the HP at its max value
        this.HP = healHP;                                //set HP stat back to max HP
        console.log(this.name + "'s total HP: " + this.HP);
      } else {
        this.HP += amt;                                  //otherwise, heal the given amount
        console.log(this.name + " gained " + amt + " HP. Total HP: " + this.HP);
      }
    }   //for all other stats, raise the stat by the given amount
    else if (stat === "atk") {this.atk += amt; console.log("Raised " + this.name + "'s " + stat + " by " + amt + ".");}
    else if (stat === "def") {this.def += amt; console.log("Raised " + this.name + "'s " + stat + " by " + amt + ".");}
		else if (stat === "spAtk") {this.spAtk += amt; console.log("Raised " + this.name + "'s " + stat + " by " + amt + ".");}
    else if (stat === "spDef") {this.spDef += amt; console.log("Raised " + this.name + "'s "  + stat + " by " + amt + ".");}
    else if (stat === "speed") {this.speed += amt; console.log("Raised " + this.name + "'s " + stat + " by " + amt + ".");}
	};  
  //lowers a single stat of a pokemon:
  this.lowerStat = function(stat, amt){
    //lowering HP is covered specifically by the Pokemon.takeDamage() method
    if (stat === "atk") {this.atk -= amt; console.log("Lowered " + this.name + "'s " + stat + " by " + amt + ".");}
    else if (stat === "def") {this.def -= amt; console.log("Lowered " + this.name + "'s " + stat + " by " + amt + ".");}
    else if (stat === "spAtk") {this.spAtk -= amt; console.log("Lowered " + this.name + "'s " + stat + " by " + amt + ".");}
    else if (stat === "spDef") {this.spDef -= amt; console.log("Lowered " + this.name + "'s " + stat + " by " + amt + ".");}
    else if (stat === "speed") {this.speed -= amt; console.log("Lowered " + this.name + "'s " + stat + " by " + amt + ".");}
  };  
  //call on a Pokemon to initiate an attack:
	this.attack = function(move, target){
		console.log(this.name + " used " + move.name + " on " + target.name + "!");
    if (move.hasOwnProperty("kind")) {      //if it is a physical or special attack...
      var attacker = this.atk;              //attack stat of the pokemon who is currently attacking
      var spAttacker = this.spAtk;          //special attack stat of the pokemon who is currently attacking
      move.dealDamage(target, attacker, spAttacker);              //call Move.dealdamage method
    } else {                                //if it is a status move...
      move.changeStat(target);              //call the StatusMove.changeStat method
    }
  };
  //call on a Pokemon to restore its HP with an item:
  this.heal = function(item, target) {
      item.heal(target);       //call the item's heal function
  };
}

//move constructor function (for damage-dealing moves)
function Move(kind, name, power, accuracy, type, PP) {
  this.kind = kind;                     //physical or special
	this.name = name;
	this.power = power;
	this.accuracy = accuracy;
	this.type = type;                     //elemental typing of the move
	this.PP = PP;
	this.dealDamage = function(target, attack, specialAttack){    //called by Pokemon.attack() method
    //I'm using an arbitrary damage calculation here, NOT the official Pokemon damage calc
    if (this.kind === "physical") {
      var defense = Math.round(target.def / 5);      //target's defense divided by 5
      var damage = Math.round(((this.power + attack)/ 10) - defense);   //amount of damage dealt
      target.takeDamage(damage);
    } else if (this.kind === "special"){
      var specialDefense = Math.round(target.spDef / 5);   //target's special defense divided by 5
      var damage = Math.round(((this.power + specialAttack)/10) - specialDefense); //amount of damage dealt
      target.takeDamage(damage);
    }
	};
}

//status move constructor function
function StatusMove(name, power, accuracy, type, PP, plusStat, minusStat, stage){
  this.name = name;
  this.power = power;
  this.accuracy = accuracy;
  this.type = type;                      //elemental typing of the move
  this.PP = PP;
  this.plusStat = plusStat;              //stat to be raised by the move
  this.minusStat = minusStat;            //stat to be lowered by the move
  this.stage = stage;                    //how much to raise/lower the stat by
    this.changeStat = function(target){
    var amt = this.stage;
    if (this.minusStat) {                //if it is a stat lowering move,
      var stat = this.minusStat;         //store the stat that will be lowered in a variable
      target.lowerStat(stat, amt);       //call pokemon.lowerStat method
    }
    else if (this.plusStat){             //if it is a stat raising move,
      var stat = this.plusStat;          //store the stat that will be raised in a variable
      target.raiseStat(stat, amt);       //call pokemon.raiseStat method
    }
  };
  this.changeStatus = function(status){};
};

//item constructor function
function Item(name, healAmount, healStat){
  this.name = name;
  this.healAmount = healAmount;     //how much does it heal
  this.healStat = healStat;         //which stat does it heal
  this.heal = function (target){    //heals HP of a Pokemon. Called by Pokemon.heal method
    var amt = this.healAmount;      //how much the item heals
    var stat = this.healStat;       //which stat will be raised
    console.log("used " + this.name + " on " + target.name);
    target.raiseStat(stat, amt);     //calls pokemon.raiseStat method
  };
}

//define item objects
//name, healAmount, healStat
var potion = new Item("potion", 10, "HP");   //potion restores 10 HP here

//define move objects
//kind, name, power, accuracy, type, PP
var tackle = new Move("physical", "tackle", 50, 100, "normal", 35); 
var scratch = new Move("physical", "scratch", 40, 100, "normal", 35);
var vineWhip = new Move("physical", "vine whip", 45, 100, "grass", 25);
var waterGun = new Move("special", "water gun", 40, 100, "water", 25);
var ember = new Move("special", "ember", 40, 100, "fire", 25);

//define status move objects
//name, power, accuracy, type, PP, plusStat, minusStat, stage
var growl = new StatusMove("growl", 0, 100, "normal", 40, false, "atk", 1);           //lowers enemy's attack
var tailWhip = new StatusMove("tail whip", 0, 100, "normal", 30, false, "def", 1);     //lowers enemy's defense
var howl = new StatusMove("howl", 0, 100, "normal", 30, "atk", false, 1);             //raises user's attack
howl.self = true;     //howl affects the pokemon that uses the move, not the target

//define Pokemon objects
//based on level 1 stats with perfect IVs
//name, maxHP, maxAtk, maxDef, maxSpAtk, maxSpDef, maxSpeed, HP, atk, def, spAtk, spDef, speed, statCondition, [moves], type, items
var bulbasaur = new Pokemon("Bulbasaur", 12, 6, 6, 6, 6, 7, 12, 6, 6, 6, 6, 7, "none", [tackle, growl, vineWhip, howl], "grass");
var charmander = new Pokemon("Charmander", 12, 6, 6, 6, 6, 6, 12, 6, 6, 6, 6, 6, "none", [scratch, growl, ember, howl], "fire");
var squirtle = new Pokemon("Squirtle", 12, 6, 6, 6, 6, 6, 12, 6, 6, 6, 6, 6, "none", [tackle, tailWhip, waterGun, howl], "water");



//user input (global variables)
//prompt user to choose pokemon
function selectPokemon(){
  var myPokemon = prompt("Do you choose BULBASAUR, CHARMANDER, or SQUIRTLE?").toLowerCase();
  if (myPokemon === "bulbasaur") {            //if user picks bulbasaur, bot picks charmander
    var myPokemon = bulbasaur;
    var botPokemon = charmander;
    console.log("The computer chose " + botPokemon.name);
  } else if (myPokemon === "charmander") {    //if user picks charmander, bot picks squirtle
    var myPokemon = charmander;
    var botPokemon = squirtle;
    console.log("The computer chose " + botPokemon.name);
  } else {                                    //if user picks squirtle, bot picks bulbasaur
    var myPokemon = squirtle;
    var botPokemon = bulbasaur;
    console.log("The computer chose " + botPokemon.name);
  }
//calculate who goes first based on speed stats
  var speedy; 
  if (myPokemon.speed > botPokemon.speed) {   //if user Pokemon outspeeds, user goes first
    //userAction(myPokemon, botPokemon);  
    speedy = "user"; 
    battle(speedy, myPokemon, botPokemon);
  } else if (botPokemon.speed > myPokemon.speed) {  //computer goes first
    speedy = "bot";
    battle(speedy, myPokemon, botPokemon);
    //botAction(myPokemon, botPokemon);
  } else { //if it's a tie
    var coinToss = Math.floor(Math.random()*2); //randomly choose 0 or 1
    if (coinToss === 0) {                  //user goes first
      //userAction(myPokemon, botPokemon);
      speedy = "user"; 
      battle(speedy, myPokemon, botPokemon);
    }
    else {                                 //bot goes first
      //botAction(myPokemon, botPokemon);
      speedy = "bot";
      battle(speedy, myPokemon, botPokemon);
    }
  }
} //end selectPokemon function


function userAction(myPokemon, botPokemon) {
  if (myPokemon.HP > 0 && botPokemon.HP > 0) {
  var fight = prompt("Will you ATTACK or HEAL?").toLowerCase();
  if (fight === "attack") {
      //ask what attack they will use, given the options
      var attack1 = myPokemon.moves[0].name;
      var attack2 = myPokemon.moves[1].name;
      var attack3 = myPokemon.moves[2].name;
      var attack4 = myPokemon.moves[3].name;
      var whichAttack = prompt("Which attack will you use? " + attack1 + ", " + attack2 + ", " + attack3 + ", or "  + attack4 + "?").toLowerCase();
      //if the user input doesn't match an attack name, start over
      if (whichAttack !== attack1 && whichAttack !== attack2 && whichAttack !== attack3 && whichAttack !== attack4) {
        console.log("Please choose a valid move.");
        userAction(myPokemon, botPokemon);
      } else {
        //loop through each attack in the moves array
          for (var i = 0; i < myPokemon.moves.length; i++) {
            if (whichAttack === myPokemon.moves[i].name) {      //if there is a match,
              var moveChoice = myPokemon.moves[i];              //set moveChoice equal to the chosen move
            }
          }
        console.log(myPokemon.name + ", use " + moveChoice.name + "!!!");
          if (moveChoice.hasOwnProperty("self")) {                //if the move affects the user, rather than the foe
            myPokemon.attack(moveChoice, myPokemon);
          } else {                                                //otherwise,
          myPokemon.attack(moveChoice, botPokemon);               //start battling!!!
        }
      }
  } else if (fight === "heal") {
    //call the heal function
    myPokemon.heal(potion, myPokemon);
  } else {
    console.log("That is not an option, choose again");
    userAction(myPokemon, botPokemon);
  }
}//end if statement that executes when no pokemon are fainted
}

function botAction(myPokemon, botPokemon) {
  if (myPokemon.HP > 0 && botPokemon.HP > 0) {
//bot will use a potion if HP is 4 or less
/*THIS IS COMMENTED OUT UNTIL I IMPLEMENT A POTION LIMIT
OTHERWISE THE BATTLE WILL GO ON FOREVER
if (botPokemon.HP < 4) {
  botPokemon.heal(potion, botPokemon);
} enclose rest of function in an else statement */
//otherwise bot randomly selects an attack each turn
var randomMove = Math.floor(Math.random() * 4);    //random number between 0 and 3
var botMove = botPokemon.moves[randomMove];
if (botMove.hasOwnProperty("self")) {              //if the move affects the user, rather than the foe
  botPokemon.attack(botMove, botPokemon);          //call the "attack" on the user
} else {
  botPokemon.attack(botMove, myPokemon);           //otherwise, battle as usual
}
} //end if statement that executes when no pokemon are fainted
}

function battle(who, myPokemon, botPokemon){     //this function plays the game
  if (who === "user"){
    //lets the user move first each turn
  userAction(myPokemon, botPokemon);
  botAction(myPokemon, botPokemon);
    if (myPokemon.HP <= 0 || botPokemon.HP <= 0) {   //if one pokemon has fainted, stop recursion
        if (myPokemon.HP <= 0) {
          console.log("The winner is " + botPokemon.name);     //declare the winner of the battle
        } else {
          console.log("The winner is " + myPokemon.name);
        }
      } else {
      battle(who, myPokemon, botPokemon);
      }                                    //keep battling
  } else if (who === "bot") {
    //lets the computer move first each turn
  botAction(myPokemon, botPokemon);
  userAction(myPokemon, botPokemon);
    if (myPokemon.HP <= 0 || botPokemon.HP <= 0) {   //if one pokemon has fainted, stop recursion
        if (myPokemon.HP <= 0) {
            console.log("The winner is " + botPokemon.name);
          } else {
            console.log("The winner is " + myPokemon.name);
          }
      } else {
      battle(who, myPokemon, botPokemon);
      }     
  }
} 

selectPokemon();   //initiates Pokemon selection and battle
