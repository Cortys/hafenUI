var robotMovement = require("../../core/robotMovement.js"),
    dirs = {
        top: "forward",
        left: "left",
        bottom: "turn",
        right: "right"
    };

module.exports = function(client) {
    return function(data, callback) {
        if(dirs[data.direction])
            robotMovement.do.move(client, dirs[data.direction], function(positions) {
                callback(true);
            });
    };
};