//Pokemon Battle Simulator! (work in progress)

//Pokemon constructor function
function Pokemon(name, maxHP, maxAtk, maxDef, maxSpAtk, maxSpDef, maxSpeed, HP, atk, def, spAtk, spDef, speed, statCondition, moves, type, inventory) {
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
	this.moves = moves;                   //takes an array of moves. Each Pokemon gets 2 attacking moves and 2 status moves
	this.type = type;                     //elemental typing of the pokemon
  this.inventory = inventory;           //number of items that an be used during battle
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
    //convert string to property to access the correct values
    if (stat === "atk") {var stat2 = this.atk; var stat3 = this.maxAtk;}
    else if (stat === "def") {var stat2 = this.def; var stat3 = this.maxDef;}
    else if (stat === "spAtk") {var stat2 = this.spAtk; var stat3 = this.maxSpAtk;}
    else if (stat === "spDef") {var stat2 = this.spDef; var stat3 = this.maxSpDef;}
    else if (stat === "speed") {var stat2 = this.speed; var stat3 = this.maxSpeed;} 
    if (stat2 >= Math.floor(stat3 * 1.25)) {  //if the stat is greater/equal to 125% of max stat
      console.log(this.name + "'s " + stat + " won't go any higher!");    //don't allow the stat to be raised again
    } else {
    if (stat === "HP") {                                 //if HP is being raised (healed)...
      if (this.HP + amt >= this.maxHP) {                 //if heal amount is greater than the maxHP
        console.log(this.name + " gained " + (this.maxHP - this.HP) + " HP");
        var healHP = this.maxHP;                         //cap the HP at its max value
        this.HP = healHP;                                //to prevent over-healing
        console.log(this.name + "'s total HP: " + this.HP);
      } else {
        this.HP += amt;                                  //otherwise, heal the given amount
        console.log(this.name + " gained " + amt + " HP. Total HP: " + this.HP);
      }
    }  else { //for all other stats, raise the stat by the given amount
    //I am assuming level 25 for the time being
    //(((2 * level + 10)/250) * (stat to be lowered) * (amount to lower stat by) + 2);
    var raised = Math.floor((((2 * 25 + 10)/250) * (stat2) * (amt) + 2));
    if (stat === "atk") {this.atk += raised;}
    else if (stat === "def") {this.def += raised;}
    else if (stat === "spAtk") {this.spAtk += raised;}
    else if (stat === "spDef") {this.spDef += raised;}
    else if (stat === "speed") {this.speed += raised;} 
    console.log("Raised " + this.name + "'s " + stat + " by " + raised + ".");
    }
    }
    };  

  //lowers a single stat of a pokemon:
  this.lowerStat = function(stat, amt){
    if (stat === "atk") {var stat2 = this.atk; var stat3 = this.maxAtk;}
    else if (stat === "def") {var stat2 = this.def; var stat3 = this.maxDef;}
    else if (stat === "spAtk") {var stat2 = this.spAtk; var stat3 = this.maxSpAtk;}
    else if (stat === "spDef") {var stat2 = this.spDef; var stat3 = this.maxSpDef;}
    else if (stat === "speed") {var stat2 = this.speed; var stat3 = this.maxSpeed;} 
    //lowering HP is covered specifically by the Pokemon.takeDamage() method
  if (stat2 <= Math.floor(stat3 * 0.75)) {  //if stat is less than/equal to 75% of max stat
    console.log(this.name + "'s " + stat + " won't go any lower!");    //don't allow the stat to be raised again
  } else {
    var lowered = Math.floor((((2 * 25 + 10)/250) * (stat2) * (amt) + 2));
    if (stat === "atk") {this.atk -= lowered;}
    else if (stat === "def") {this.def -= lowered;}
    else if (stat === "spAtk") {this.spAtk -= lowered;}
    else if (stat === "spDef") {this.spDef -= lowered;}
    else if (stat === "speed") {this.speed -= lowered;} 
    console.log("Lowered " + this.name + "'s " + stat + " by " + lowered + ".");
    }
  };  

  //call on a Pokemon to initiate an attack:
	this.attack = function(move, target, user){
		console.log(this.name + " used " + move.name + " on " + target.name + "!");
    if (move.hasOwnProperty("kind")) {      //if it is a physical or special attack...
      var attacker = this.atk;              //attack stat of the pokemon who is currently attacking
      var spAttacker = this.spAtk;          //special attack stat of the pokemon who is currently attacking
      move.dealDamage(target, attacker, spAttacker, user);              //call Move.dealdamage method
    } else {                                //if it is a status move...
      move.changeStat(target);              //call the StatusMove.changeStat method
    }
  };
  //call on a Pokemon to restore its HP with an item:
  this.heal = function(item, target) {
      this.inventory -= 1;     //subtract from inventory
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
	this.dealDamage = function(target, attack, specialAttack, user){    //called by Pokemon.attack() method
    var typeVar;       //holds the value for the type part of the calculation
    //type effectiveness calculation
    //value can be 2 (super effective), 1 (normal effectiveness), or 0.5 (resisted)
    //set up super effective moves
    if (this.type === "grass") {             //using a grass attack
        if (target.type === "water") {console.log("It's super effective!"); typeVar = 2;}
        else if (target.type === "fire" || target.type === "grass") {console.log("It's not very effective."); typeVar = 0.5;}
        else {typeVar = 1;}
    } else if (this.type === "fire") {       //using a fire attack
        if (target.type === "grass") {console.log("It's super effective!"); typeVar = 2;}
        else if (target.type === "water" || target.type === "fire") {console.log("It's not very effective."); typeVar = 0.5;}
        else {typeVar = 1;}
    } else if (this.type === "water") {      //using a water attack
        if (target.type === "fire") {console.log("It's super effective!"); typeVar = 2;}
        else if (target.type === "grass" || target.type === "water") {console.log("It's not very effective."); typeVar = 0.5;}
        else {typeVar = 1;}
    } else {typeVar = 1;}                    //using any other attack type is neutral for the purposes of this script
    
    //oficial Pokemon damage calc
    //(((2 * level + 10)/250) * (user attack/target defense) * (moves's base pwr) + 2) * modifiers
    //until I program levels into this script, I will use 25 as the default level for all pokemon
    //modifiers is calculated as STAB * type * crit * other * random #
    //modifiers include critical hits, same-type attack bonus, type effectiveness, and random numbers
    //this program includes only grass, fire, and water types
    //the random number should be between .85 and 1
    console.log("the move type is " + this.type);
    console.log("the target type is " + target.type);
    console.log("typeVar is " + typeVar);
    var roll = (Math.floor(Math.random() * (100 - 85 + 1)) + 85)/100;    //random number
    if (this.kind === "physical") {
      var damage = Math.floor((((2 * 25 + 10)/250) * (attack / target.def) * (this.power) + 2) * roll * typeVar);
    } else if (this.kind === "special"){
      var damage = Math.floor((((2 * 25 + 10)/250) * (specialAttack / target.spDef) * (this.power) + 2) * roll * typeVar);
    }
    //in official pokemon games it is unlikely (but theoretically possible) to do 0 damage. 
    //In this script, attacks have 1 damage minimum
    if (damage <= 0) {damage = 1;}
    target.takeDamage(damage);
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
  this.stage = stage;                    //how much to raise/lower the stat by (ie: 0.05 = 5% stat change)
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
var oranBerry = new Item("oran berry", 10, "HP");
var potion = new Item("potion", 20, "HP");
var superPotion = new Item("super potion", 50, "HP");
var mooMooMilk = new Item("moo moo milk", 100, "HP");
var hyperPotion = new Item("hyper potion", 200, "HP");
//note: I have changed the heal values of these items for this program

//define move objects
//kind, name, power, accuracy, type, PP
var tackle = new Move("physical", "tackle", 50, 100, "normal", 35); 
var scratch = new Move("physical", "scratch", 40, 100, "normal", 35);
var vineWhip = new Move("physical", "vine whip", 45, 100, "grass", 25);
var waterGun = new Move("special", "water gun", 40, 100, "water", 25);
var ember = new Move("special", "ember", 40, 100, "fire", 25);

//define status move objects
//name, power, accuracy, type, PP, plusStat, minusStat, stage
var growl = new StatusMove("growl", 0, 100, "normal", 40, false, "atk", 0.03);           //lowers enemy's attack
var tailWhip = new StatusMove("tail whip", 0, 100, "normal", 30, false, "def", 0.03);     //lowers enemy's defense
var howl = new StatusMove("howl", 0, 100, "normal", 30, "atk", false, 0.03);             //raises user's attack
howl.self = true;     //howl affects the pokemon that uses the move, not the target

//define Pokemon objects
//based on level 1 stats with perfect IVs
//name, maxHP, maxAtk, maxDef, maxSpAtk, maxSpDef, maxSpeed, HP, atk, def, spAtk, spDef, speed, statCondition, [moves], type, items
var bulbasaur = new Pokemon("Bulbasaur", /*max stats*/45, 49, 49, 65, 65, 45, /*reg stats*/45, 49, 49, 65, 65, 45, "none", [tackle, vineWhip, growl, howl], "grass", 1);
var charmander = new Pokemon("Charmander", /*max stats*/39, 52, 43, 60, 50, 65, /*reg stats*/39, 52, 43, 60, 50, 65, "none", [scratch, ember, growl, howl], "fire", 1);
var squirtle = new Pokemon("Squirtle", /*max stats*/44, 48, 65, 50, 64, 43, /*reg stats*/44, 48, 65, 50, 64, 43, "none", [tackle, waterGun, tailWhip, howl], "water", 1);



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
    var coinToss = Math.floor(Math.random() * (1 - 0 + 1)) + 0; //randomly choose 0 or 1
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
          myPokemon.attack(moveChoice, botPokemon, myPokemon);    //start battling!!! (include third optional 3rd parameter to pass on user stats)
        }
      }
  } else if (fight === "heal") {
    //call the heal function with a different item depending on HP
    if (myPokemon.inventory >=1 ) {
      if (myPokemon.maxHP <= 20) {                   //1-20HP heals with oranBerry(10HP)
        myPokemon.heal(oranBerry, myPokemon);
      } else if (myPokemon.maxHP <= 50) {            //21-50HP heals with potion(20HP)
        myPokemon.heal(potion, myPokemon);
      } else if (myPokemon.maxHP <= 75){             //51-75HP heals with super potion(50HP)
        myPokemon.heal(superPotion, myPokemon);  
      } else if (myPokemon.maxHP <= 150) {           //100-150HP heals with Moo Moo Milk(100HP)
        myPokemon.heal(mooMooMilk, myPokemon);
      } else {                                       //151+HP heals with hyper potion(200HP)
        myPokemon.heal(hyperPotion, myPokemon);
      }
    } else {         //if the inventory is empty
      console.log("You're out of items! Please choose an attack instead.");
      userAction(myPokemon, botPokemon);
    }
  } else {
    console.log("That is not an option, choose again");
    userAction(myPokemon, botPokemon);
  }
}//end if statement that executes when no pokemon are fainted
}

function botAction(myPokemon, botPokemon) {
  if (myPokemon.HP > 0 && botPokemon.HP > 0) {    //if no pokemon are fainted
//bot will use a potion if max HP is 20% or less
if (botPokemon.HP < botPokemon.maxHP * 0.20 && botPokemon.inventory >= 1) {
     if (botPokemon.maxHP <= 20) {                  //1-20HP heals with oranBerry(10HP)
      botPokemon.heal(oranBerry, botPokemon);
    } else if (botPokemon.maxHP <= 50) {            //21-50HP heals with potion(20HP)
      botPokemon.heal(potion, botPokemon);
    } else if (botPokemon.maxHP <= 75){             //51-75HP heals with super potion(50HP)
      botPokemon.heal(superPotion, botPokemon);  
    } else if (botPokemon.maxHP <= 150) {           //100-150HP heals with Moo Moo Milk(100HP)
      botPokemon.heal(mooMooMilk, botPokemon);
    } else {                                        //151+HP heals with hyper potion(200HP)
      botPokemon.heal(hyperPotion, botPokemon);
    }
}  else {
//otherwise bot randomly selects an attack each turn
//bot has 70% chance to use an attacking move (stored in moves[0] or moves[1])
//30% chance of using a stat raising/lowering move (stored in moves[2]) or moves[3])

var moveKind = Math.floor(Math.random() * (100 - 0 + 1)) + 0;  //random num between 0 and 100.
//determine what kind of move to use:
if (moveKind <= 70) {
  //use damage dealing move
  //random number between 0 and 1 decides the move
  var randomMove = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
  var botMove = botPokemon.moves[randomMove];
} else {
  //use a status move
  //random number between 2 and 3 decides the move
  var randomMove = Math.floor(Math.random() * (3 - 2 + 1)) + 2;
  var botMove = botPokemon.moves[randomMove];
}
if (botMove.hasOwnProperty("self")) {              //if the move affects the user, rather than the foe
  botPokemon.attack(botMove, botPokemon);          //call the "attack" on the user
} else {
  botPokemon.attack(botMove, myPokemon, botPokemon);           //otherwise, attack (include third optional 3rd parameter to pass on user stats)
}
} //end else statement that executes when pokemon doesn't heal
} //end if statement that executes when no pokemon are fainted
}

function battle(who, myPokemon, botPokemon){     //this function plays the game
  console.log("-------------ROUND!-------------");
  if (who === "user"){
    //lets the user move first each turn
  console.log("YOU:");
  userAction(myPokemon, botPokemon);
  console.log("ENEMY:");
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
  console.log("ENEMY:");
  botAction(myPokemon, botPokemon);
  console.log("YOU:");
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