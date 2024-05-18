const rotableCom = require("./rotable")
const movableCom = require("./movable")
const fs = require('fs')

const CommandRotateCl = rotableCom.CommandRotate
const CommandMoveCl = movableCom.CommandMove

interface ICommand {
    execute(): void
    getType(): string
}

class DefaultCommand implements ICommand {
    execute(): void {
        console.log('DefaultCommand')
    }

    getType(): string {
        return 'DefaultCommand'
    }
}


class DefaultExceptionHandler implements ICommand {
    execute(): void {
        console.log('DefaultExceptionHandler')
    }

    getType(): string {
        return 'DefaultExceptionHandler'
    }
}

class  WriteExceptionHandler extends DefaultExceptionHandler {
    execute(): void {
        console.log('WriteExceptionHandler')
        commandsCollection.push(
            new WriteExceptionCommand('WriteExceptionHandler')
        )
    }

    getType(): string {
        return 'WriteExceptionHandler'
    }
}

class WriteExceptionCommand extends DefaultCommand { 
    private nameException
    constructor(nameException) {
        super()
        this.nameException = nameException
    }
    execute(): void {
        fs.appendFile('error.log', this.nameException + ' '  + new Date().toLocaleDateString('ru') + ' ' +new Date().toLocaleTimeString('ru') + '\n',  function(error){
            if(error) { return console.log(error) }
        })
    }
}

class ReplayCommand extends DefaultCommand { 
    private command: ICommand
    constructor(command) {
        super()
        this.command = command
    }
    execute(): void {
        commandsCollection.push(this.command)
    }
}

class ReplayExceptionHandler extends DefaultExceptionHandler {
    private command: ICommand
    constructor(command) {
        super()
        this.command = command
    }
    execute(): void {
        console.log('ReplayExceptionHandler')
        commandsCollection.push(
            new ReplayCommand(this.command)
        )
    }

    getType(): string {
        return 'ReplayExceptionHandler'
    }
}


let defaultExceptionHandler: ICommand = new DefaultExceptionHandler();

let exceptionDefaultMap = new Map([
    ['Error', defaultExceptionHandler],
])

const exceptionStore = new Map<string,  Map<string, ICommand>>([
    ['Default', exceptionDefaultMap],
])

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
        let ct = c ? c.getType() : 'Default' 
        let et = e.name
        return this.store.get(ct)?.get(et);
    }

    public registerHandler(c: ICommand, e: any, h: ICommand) {
        let ct = c.getType()
        let errorMap = this.store.get(ct);
        if (errorMap) {
            errorMap.set(e.name, h)
        } else {
            let newException = new Map([
                [e.name, h]
            ])
            this.store.set(ct, newException)
        }
    }
}

const exceptionHandler = new ExceptionHandler(exceptionStore)

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

module.exports.exceptionHandler = exceptionHandler