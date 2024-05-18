const assert2 = require("assert")
const main = require("./main")
const movableCom2 = require("./movable")

describe("Execute Tests", function(){
    it('Работа исключений', () => {
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
        const movableCommand = new movableCom2.CommandMove(mockMovable)
        let commandsCollection: Array<ICommand> = [movableCommand]
        let stopLoop = false; 
        let exceptionHandler = main.exceptionHandler;

        let replayCommandsCollection: Array<ICommand|undefined> = []

        while(!stopLoop) {
            let  c = commandsCollection.shift()
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
                    const h = new main.ReplayExceptionHandler(c)
                    e.name = 'Replay'
                    exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
                } else {
                    const idx = replayCommandsCollection.indexOf(c)
                    replayCommandsCollection.splice(idx, 1)
                    const h = new main.WriteExceptionHandler(c)
                    e.name = 'Write'
                    exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
                }
        
                exceptionHandler.handle(c,e)?.execute()
            }
        }
    })
})