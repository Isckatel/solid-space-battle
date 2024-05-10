const rotableCom = require("./rotable")
const movableCom = require("./movable")
const exStore = require("./exceptionStore")

const CommandRotateCl = rotableCom.CommandRotate
const CommandMoveCl = movableCom.CommandMove

interface ICommand {
    execute(): void
    getType(): string
}


let mockMovable = {
    getPosition() {
        return { x: 12, y: 5 }
    },
    getVelocity() {
        return { x: -7, y: 3 }
    },
    setPosition(newV) {
    }
};

const movableCommand = new movable.CommandMove(mockMovable)

let commandsCollection: Array<ICommand> = [movableCommand]

let stopLoop = false; 

const exceptionHandler = {
    
    store: exStore,
    handle: function(c, e) {
        let ct = c ? c.getType() : 'Movable' //TODO Default
        let et = e.getType()
        return this.store.get(ct)?.get(et);
    }
}

while(!stopLoop) {
    let  c = commandsCollection.shift()
    try {
        if (c) {
            c.execute()
        } else {
            stopLoop = true
        }
    } catch (e) {
        exceptionHandler.handle(c,e)?.execute()
    }
}

