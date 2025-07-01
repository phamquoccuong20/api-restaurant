const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 604800, checkperiod: 120 }); // TTL = 7 days

module.exports = cache;
