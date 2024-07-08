const assert2 = require("assert")
const main = require("./main")
const movableCom2 = require("./movable")
const fs2 = require('fs')


describe("Execute Tests", function(){
    it('п.4. Команду, которая записывает информацию о выброшенном исключении в лог', () => {
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
        }

        //Act
        try {
            mockMovable.getPosition();
        } catch (error) {
            console.log('catch test п.4')
            const c = new main.WriteExceptionCommand(error);
            c.execute();
        }

        //Assert
        //В лог-файле должна быть запсь об ошибке
        console.log('Assert п.4')
        const data = fs2.readFileSync("error.log")
        const firstLine = (String(data).match(/(^.*)/) || [])[1] || ''
        assert2.match(firstLine, /Error/, 'Строка должна соответствовать выражению ')
        fs2.truncateSync("error.log")        
    })

    it('п.5. Обработчик исключения, который ставит Команду, пишущую в лог в очередь Команд', () => {
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
        const c = new movableCom2.CommandMove(mockMovable)
        let exceptionHandler = main.exceptionHandler
        let commandsCollection = new main.CommandsCollection()
        //Act
        try {            
            c.execute()
        } catch(e:any) {
            const h = new main.WriteExceptionHandler(commandsCollection, e)
            exceptionHandler.registerHandler(c, e, h)
        }

        //Assert
        //В  логах очереди должна быть команда записи
        const data = fs2.readFileSync("registration-queue.log")
        const firstLine = (String(data).match(/(^.*)/) || [])[1] || ''
        assert2.match(firstLine, /WriteCommand/, 'Строка должна соответствовать выражению ')
        fs2.truncateSync("registration-queue.log")
    })

    // it('Повтор команды и запись в лог', () => {
    //     //Arrange
    //     let mockMovable = {
    //         getPosition() {
    //             throw new Error("No data");//return { x: 12, y: 5 }
    //         },
    //         getVelocity() {
    //             return { x: -7, y: 3 }
    //         },
    //         setPosition(newV) {
    //         }
    //     };
    //     const movableCommand = new movableCom2.CommandMove(mockMovable)
    //     let commandsCollection: Array<ICommand> = [movableCommand]
    //     let stopLoop = false; 
        

    //     let replayCommandsCollection: Array<ICommand|undefined> = []

    //     //Act
    //     let idx = 0;
    //     while(!stopLoop) {
    //         let  c = commandsCollection.shift()
    //         idx++;
    //         try {
    //             if (c) {
    //                 c.execute()
    //             } else {
    //                 stopLoop = true
    //             }
    //         } catch (e: any) {
    //             let cmdReplay = replayCommandsCollection.find( itm => itm == c)
    //             if (!cmdReplay) {
    //                 replayCommandsCollection.push(c)
    //                 const h = new main.ReplayExceptionHandler(commandsCollection, c)
    //                 exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
    //             } else {
    //                 const idx = replayCommandsCollection.indexOf(c)
    //                 replayCommandsCollection.splice(idx, 1)
    //                 const h = new main.WriteExceptionCommand(commandsCollection, e)
    //                 exceptionHandler.registerHandler(c, e, h)//TODO похоже будет дублирование
    //             }

    //             exceptionHandler.handle(c,e)?.execute()
    //             //Assert
    //             //В очереди должна быть команда для повтора
    //             if (replayCommandsCollection.length > 0 && idx == 3) { 
    //                 cmdReplay = commandsCollection.find( itm => itm == c)
    //                 console.log(cmdReplay);
    //                 assert2.equal(cmdReplay, replayCommandsCollection[0])
    //             }
    //         }
    //     }

    //     //Assert
    //     //В лог-файле должна быть запсь об ошибке
    //     const data = fs2.readFileSync("error.log")
    //     const firstLine = (String(data).match(/(^.*)/) || [])[1] || ''
    //     assert2.match(firstLine, /Error/, 'Строка должна соответствовать выражению ')
    //     fs2.truncateSync("error.log")
    // })
})