const {Block, Blockchain} = require(".")

var identifier = "Test"
var difficulty = 5;
var length     = 5;


var blockchain = new Blockchain(identifier, difficulty);
console.log("Chain:   " + blockchain.identifier);
console.log("Genesis: " + blockchain.getGenesisBlock().hash);

for(let i=0; i<length; i++) {
    var t0    = Date.now();
    var block = blockchain.appendData("Test " + i);
    var t1    = Date.now();
    console.log("Block " + (i+1) + ": " + block.hash + " (" + (t1 - t0) + "ms)");
}

console.log("Length:  " + blockchain.getLength());
console.log("Valid:   " + blockchain.isValid());
console.log("Content: " + JSON.stringify(blockchain));
