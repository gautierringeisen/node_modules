const crypto = require('crypto');

class Block {
    constructor(timestamp, data, previousHash = '', nonce = 0, hash = null) {
        this.timestamp    = timestamp;
        this.data         = data;
        this.previousHash = previousHash;
        this.nonce        = nonce;
        this.hash         = hash || this.computeHash();
    }

    computeHash() {
        return crypto.createHash('sha256').update(this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).digest('hex');
    }

    mine(difficulty) {
        let prefix = this.previousHash.substring(0, difficulty);
        while (this.hash.substring(0, difficulty) !== prefix) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }

    isValid() {
        return this.hash === this.computeHash();
    }
}

class Blockchain {
    
    constructor(identifier, difficulty = 2, timestamp = null, chain = null) {
        this.difficulty = difficulty;
        this.chain      = chain || [new Block(timestamp || Date.now(), identifier)];
    }
    
    getLength() {
        return this.chain.length - 1;
    }
    
    getGenesisHash() {
        return this.chain[0].hash;
    }

    getLastHash() {
        return this.chain[this.chain.length - 1].hash;
    }

    getGenesisBlock() {
        return this.chain[0];
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    isValid() {
        if(this.chain.length == 0 || !this.chain[0].isValid())
            return false;

        var previousHash = this.chain[0].hash;
        for(let i=1; i<this.chain.length; i++) {
            const block = this.chain[i];
            if(block.previousHash !== previousHash || !block.isValid())
                return false;
            previousHash = block.hash;
        }
        
        return true;
    }

    createBlock(data) {
        return new Block(Date.now(), data, this.chain[this.chain.length - 1].hash);
    }

    appendBlock(block) {
        if(block.previousHash === this.chain[this.chain.length - 1].hash
        && block.hash.substring(0, difficulty) === block.previousHash.substring(0, difficulty)
        && block.isValid()) {
            this.chain.push(block);
            return true;
        } else {
            return false;
        }
    }

    appendData(data) {
        var block = new Block(Date.now(), data, this.chain[this.chain.length - 1].hash);
        block.mine(this.difficulty);
        this.chain.push(block);
        return block;
    }
}


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
