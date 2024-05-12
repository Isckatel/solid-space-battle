const assert1 = require("assert")
const rotable = require("./rotable")

describe("Rotable Tests", function(){
    return;
    it('При угле равном 2 частям, меняем угол на -4 части, получаем -2', () => {
        let mockRotable: Rotable = {
            getDirection() : Direction {
                return 2
            },
            getAngularVelocity() : number {
                return -4
            },
            setDirection(newV: Direction) : void {

            },
            getDirectionsNumber(): number {
                return 16
            }
        };
        const expected = -2

        const command = new rotable.CommandRotate(mockRotable);
        command.execute()
        const result = command.getValue();

        assert1.equal(result, expected)
    })

    it('Попытка повернуть объект, у которого невозможно прочитать направление, приводит к ошибке', () => {
        let mockRotable: Rotable = {
            getDirection() : Direction | never {
                throw new Error("No data")
            },
            getAngularVelocity() : number {
                return -4
            },
            setDirection(newV: Direction) : void {

            },
            getDirectionsNumber(): number {
                return 16
            }
        };   

        const command = new rotable.CommandRotate(mockRotable);   

        assert1.throws(() => { command.execute() }, Error);
    })

    it('Попытка повернуть объект, у которого невозможно прочитать скорость, приводит к ошибке', () => {
        let mockRotable: Rotable = {
            getDirection() : Direction {
                return 2
            },
            getAngularVelocity() : number | never {
                throw new Error("No data")
            },
            setDirection(newV: Direction) : void {

            },
            getDirectionsNumber(): number {
                return 16
            }
        };   

        const command = new rotable.CommandRotate(mockRotable);   

        assert1.throws(() => { command.execute() }, Error);
    })

    it('Попытка повернуть объект, у которого невозможно прочитать количество направлений, приводит к ошибке', () => {
        let mockRotable: Rotable = {
            getDirection() : Direction {
                return 2
            },
            getAngularVelocity() : number {
                return -4
            },
            setDirection(newV: Direction) : void {

            },
            getDirectionsNumber(): number | never {
                throw new Error("No data")
            }
        };   

        const command = new rotable.CommandRotate(mockRotable);   

        assert1.throws(() => { command.execute() }, Error);
    })

    it('Попытка повернуть объект, у которого невозможно изменить направление, приводит к ошибке', () => {
        let mockRotable: Rotable = {
            getDirection() : Direction  {
                return 2
            },
            getAngularVelocity() : number {
                return -4
            },
            setDirection(newV: Direction) : void | never {
                throw new Error("No data")
            },
            getDirectionsNumber(): number {
                return 16
            }
        };   

        const command = new rotable.CommandRotate(mockRotable);   

        assert1.throws(() => { command.execute() }, Error);
    })    
})