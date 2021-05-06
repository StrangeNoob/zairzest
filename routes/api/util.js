const crypto = require('crypto');


function calculateSHA256(truncatedLength, ...args) {
    const hash = crypto.createHash('sha256');

    for (const arg in args) {
        hash.update(arg.toString());
    }

    hash.update(Date.now().toString());
    return hash.digest('hex').substring(0, truncatedLength > 64 ? 64 : truncatedLength);
}

module.exports = {
    calculateSHA256
};