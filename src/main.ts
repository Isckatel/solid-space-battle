const rotableCom = require("./rotable")
const movableCom = require("./movable")

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

class ExceptionMovalbeCommand implements ICommand {
    execute(): void {
        console.log('exceptionMovalbeCommand')
    }

    getType(): string {
        return 'exceptionMovalbeCommand'
    }
}

let exceptionMovalbeCommand = new ExceptionMovalbeCommand();

let exceptionMovalbeMap = new Map([
    ['Error', exceptionMovalbeCommand],
])

const exceptionHandler = {
    
    stort: new Map([
        ['Movable', exceptionMovalbeMap],
    ]),
    handle: function(c: ICommand , e) {
        let ct = c ? c.getType() : 'Movable' //TODO Default
        let et = e.getType()
        return this.stort.get(ct)?.get(et);
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
        if (c) {
        exceptionHandler.handle(c,e).execute()
        }
    }
}
