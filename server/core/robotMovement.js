var robotMovement = {
    listeners: {},
    
    startListeningForClient: function(client) {
        var t = this;
        t.listeners[client.key] = {};
        client.onReceive(function(message) {
            var data = t.codec.decode(message);
            if(typeof t.listeners[client.key][data.operation] == "function") {
                var f = t.listeners[client.key][data.operation];
                delete t.listeners[client.key][data.operation];
                f(data);
            }
        });
    },
    stopListeningForClient: function(client) {
        delete t.listeners[client.key];
        client.onReceive(null);
    }
    
    codec: require("./protocols/RCP.js") // Use RCP for robot movements
};
robotMovement.do = {
    codec: robotMovement.codec,
    send: function(client, line, listenFor, callback) {
        if(!this.listeners[client.key]) {
            client.send(line);
            this.listeners[client.key][listenFor] = callback;
            return true;
        }
        return false;
    },
    move: function(client, direction, callback) {
        return this.send(client, this.codec.encode(direction), this.codec.operations.position, callback);
    },
    getContainer: function(client, container, success, fail) {
        if(!this.send(client, this.codec.encode(this.codec.operations.getContainer, container), this.codec.operations.status, function(status) {
            (status?success:fail)(container);
        }) && typeof fail == "function")
            fail();
    },
    putContainer: function(client, success, fail) {
        if(!this.send(client, this.codec.encode(this.codec.operations.putContainer), this.codec.operations.status, function(status) {
            (status?success:fail)(container);
        }) && typeof fail == "function")
            fail();
    }
};

module.exports = robotMovement;