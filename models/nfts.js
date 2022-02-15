const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
    img: { type: String, required: true},
    name:  { type: String, required: true },
    number:  { type: String, required: true },
    rarity:  { type: String, required: true },
    opensea:  { type: String, required: true }
});

const NFT = mongoose.model('Nft', nftSchema);

module.exports = NFT;
