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
var vineWhip = new Move("physical", "vineWhip", 45, 100, "grass", 25);
var waterGun = new Move("special", "waterGun", 40, 100, "water", 25);
var ember = new Move("special", "ember", 40, 100, "fire", 25);

//define status move objects
//name, power, accuracy, type, PP, plusStat, minusStat, stage
var growl = new StatusMove("growl", 0, 100, "normal", 40, false, "atk", 1);           //lowers enemy's attack
var tailWhip = new StatusMove("tailWhip", 0, 100, "normal", 30, false, "def", 1);     //lowers enemy's defense
var howl = new StatusMove("howl", 0, 100, "normal", 30, "atk", false, 1);             //raises user's attack

//define Pokemon objects
//based on level 1 stats with perfect IVs
//name, maxHP, maxAtk, maxDef, maxSpAtk, maxSpDef, maxSpeed, HP, atk, def, spAtk, spDef, speed, statCondition, [moves], type, items
var bulbasaur = new Pokemon("Bulbasaur", 12, 6, 6, 6, 6, 6, 12, 6, 6, 6, 6, 6, "none", [tackle, growl, vineWhip, howl], "grass");
var charmander = new Pokemon("Charmander", 12, 6, 6, 6, 6, 6, 12, 6, 6, 6, 6, 6, "none", [scratch, growl, ember, howl], "fire");
var squirtle = new Pokemon("Squirtle", 12, 6, 6, 6, 6, 6, 12, 6, 6, 6, 6, 6, "none", [tackle, tailWhip, waterGun, howl], "water");

//call functions to battle
//example:
bulbasaur.attack(tackle, charmander);   //bulbasaur uses tackle on charmander
charmander.attack(ember, bulbasaur);    //charmander uses ember on bulbasaur
bulbasaur.heal(potion, bulbasaur);      //uses a potion on bulbasaur
