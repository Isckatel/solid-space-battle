const assert2 = require("assert")
const main = require("./main")
const movableCom2 = require("./movable")
const fs2 = require('fs')

describe("Execute Tests", function(){
    it('Повтор команды и запись в лог', () => {
        //Arrange
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

        //Act
        let idx = 0;
        while(!stopLoop) {
            let  c = commandsCollection.shift()
            idx++;
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
                    exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
                } else {
                    const idx = replayCommandsCollection.indexOf(c)
                    replayCommandsCollection.splice(idx, 1)
                    const h = new main.WriteExceptionHandler(e)
                    exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
                }

                exceptionHandler.handle(c,e)?.execute()
                //Assert
                //В очереди должна быть команда для повтора
                if (replayCommandsCollection.length > 0 && idx == 3) { 
                    cmdReplay = commandsCollection.find( itm => itm == c)
                    console.log(cmdReplay);
                    assert2.equal(cmdReplay, replayCommandsCollection[0])
                }
            }
        }

        //Assert
        //В лог-файле должна быть запсь об ошибке
        const data = fs2.readFileSync("error.log")
        const firstLine = (String(data).match(/(^.*)/) || [])[1] || ''
        assert2.match(firstLine, /Error/, 'Строка должна соответствовать выражению ')
    })
})