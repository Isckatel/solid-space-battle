const rotableCom = require("./rotable")
const movableCom = require("./movable")
const handlers = require('./handlers')
const fs = require('fs')

class CommandsCollection {
    private commands: Array<ICommand> = []
    constructor() {

    }
    public add(c: ICommand) {
        this.commands.push(c)
        fs.appendFile('registration-queue.log', this.commands.at(-1)?.getType() + ' '  + new Date().toLocaleDateString('ru') + ' ' +new Date().toLocaleTimeString('ru') + '\n',  function(error){
            if(error) { return console.log(error) }
        })
    }
    public getCommand() {
        return this.commands.shift()
    }
}

const CommandRotateCl = rotableCom.CommandRotate
const CommandMoveCl = movableCom.CommandMove
//let commandsCollection: Array<ICommand> = [movableCommand]
let commandsCollection = new CommandsCollection()

let defaultExceptionHandler: ICommand = new handlers.DefaultExceptionHandler(commandsCollection);

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

commandsCollection.add(movableCommand)


class ExceptionHandler {
    private store: Map<string, Map<string, ICommand>>
    constructor(store) {
        this.store = store
    }
    public handle(c, e) {
        let ct = c ? c.getType() : 'Default' 
        let et = e.name
        return this.store.get(ct)?.get(et)
    }

    public registerHandler(c: ICommand|undefined, e: any, h: ICommand) {
        let ct = c ? c.getType() : 'Default'
        let errorMap = this.store.get(ct)
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

let replayCommandsCollection: Array<ICommand|undefined> = []

function eventLoop(commandsCollection: CommandsCollection, replayCommandsCollection, exceptionHandler) {
    let stopLoop = false; 

    while(!stopLoop) {
        let  c = commandsCollection.getCommand()
        try {
            if (c) {
                c.execute()
            } else {
                stopLoop = true
            }
        } catch (e: any) {
            let cmdReplay = replayCommandsCollection.find( itm => itm == c)
            if (!cmdReplay) {
                replayCommandsCollection.push(c)
                const h = new handlers.ReplayExceptionHandler(commandsCollection, c)
                exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
            } else {
                const idx = replayCommandsCollection.indexOf(c)
                replayCommandsCollection.splice(idx, 1)
                const h = new handlers.WriteExceptionHandler(commandsCollection, e)
                exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
            }

            exceptionHandler.handle(c,e)?.execute()
        }
    }
}

//eventLoop(commandsCollection, replayCommandsCollection, exceptionHandler)

module.exports.exceptionHandler = exceptionHandler
module.exports.ReplayExceptionHandler = handlers.ReplayExceptionHandler
module.exports.WriteExceptionCommand = handlers.WriteExceptionCommand
module.exports.WriteExceptionHandler = handlers.WriteExceptionHandler
module.exports.CommandsCollection = CommandsCollection
module.exports.eventLoop = eventLoop