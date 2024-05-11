const assert2 = require("assert")
const main = require("./main")

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
        const movableCommand = new movableCom.CommandMove(mockMovable)
        let commandsCollection: Array<ICommand> = [movableCommand]
        let stopLoop = false; 
        let exceptionHandler = main.exceptionHandler;

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
    })
})