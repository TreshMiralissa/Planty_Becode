const Player = require('../models/playerModel');
const Tree = require('../models/treeModel');

// -------- Add player trees x Leafs every 15 mins
const addLeafs = async (username) => {
    const player = await Player.findOne({username: username});
    const playerTrees = await Tree.find({owner: username});
    let leafAmount = player.leafs;
    let leafGained = 0;

    for(i= 0; i<playerTrees.length; i++){
        leafGained += playerTrees[i].price;
    }
    const options = {
        allowDiskUse: false
    };

    const newLeafAmount = Math.floor(leafAmount + leafGained);

    // Inject new amount in player
    const updateLeafPlayer = await Player.updateOne(        
        {_id: player._id},
        {$set :
            {leafs: newLeafAmount}
        });

    return updateLeafPlayer;
};

// -------- Take back half of leafs every hour
const takeLeafs = async (username) => {
    const player = await Player.findOne({username: username});
    const leafAmount = player.leafs;
    const newLeafAmount = Math.floor(leafAmount/2);

    const updateLeafPlayer = await Player.updateOne(        
        {_id: player._id},
        {$set :
            {leafs: newLeafAmount}
        });

    return updateLeafPlayer;
}

// Combine the leafs function :
const cron = require('node-cron');
const leafWallet = async()=>{
    let allPlayer = await Player.find();
    // console.log(`Ce console log fonctionne ${allPlayer}`);
    for(i=0; i< allPlayer.length; i++){
        console.log(allPlayer);
        let username = allPlayer[i].username;
        console.log (username);
        // let checkPlayer = await Player.find({username});
        // Start the timer to receives and remove leaves
        let scheduledScore = cron.schedule('* */15 * * * *', () => {
            addLeafs(username);
            cron.schedule('* */60 * * * *', () => {
                takeLeafs(username);
            });
        });

    scheduledScore.start();
    }
    
}

// Export the function
module.exports = {leafWallet};