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
        throw new Error("No data");//return { x: 12, y: 5 }
    },
    getVelocity() {
        return { x: -7, y: 3 }
    },
    setPosition(newV) {
    }
};

const movableCommand = new movableCom.CommandMove(mockMovable)

let commandsCollection: Array<ICommand> = [movableCommand]

let stopLoop = false; 

class ExceptionHandler {
    private store: Map<string, Map<string, ICommand>>
    constructor(store) {
        this.store = store
    }
    public handle(c, e) {
        let ct = c ? c.getType() : 'Movable' //TODO Default
        let et = e.name
        return this.store.get(ct)?.get(et);
    }
}

const exceptionHandler = new ExceptionHandler(exStore)

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

