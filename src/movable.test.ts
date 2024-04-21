const assert = require("assert")
const movable = require("./movable")

interface IPostion {
    getValue() : IVector
}

it('находящегося в точке (12, 5) и скорость (-7, 3) движение меняет положение на (5, 8)', () => {
    let mockMovable: Movable = {
        getPosition() : IVector {
            return {x:12, y: 5}
        },
        getVelocity() : IVector {
            return {x:-7, y: 3}
        },
        setPosition( newV: IVector) : void {

        }
    };
    const expected = new movable.Vector(5,8)

    const command = new movable.CommandMove(mockMovable);
    command.execute()
    const result = command.getValue();

    assert.deepEqual(result, expected)
})

it('Попытка сдвинуть объект, у которого невозможно прочитать положение в пространстве, приводит к ошибк', () => {
    let mockMovable: Movable = {
        getPosition() : IVector | never {
            throw new Error("No data");
        },
        getVelocity() : IVector {
            return {x:-7, y: 3}
        },
        setPosition( newV: IVector) : void {

        }
    };

    const command = new movable.CommandMove(mockMovable);
    
    assert.throws(() => { command.execute() }, Error);
    
})

it('Попытка сдвинуть объект, у которого невозможно прочитать значение мгновенной скорости, приводит к ошибке', () => {
    let mockMovable: Movable = {
        getPosition() : IVector  {
            return {x:12, y: 5}
        },
        getVelocity() : IVector | never {
            throw new Error("No data")
        },
        setPosition( newV: IVector) : void {

        }
    };

    const command = new movable.CommandMove(mockMovable);
   
    assert.throws(() => { command.execute() }, Error);
    
})

it('Попытка сдвинуть объект, у которого невозможно изменить положение в пространстве, приводит к ошибке', () => {
    let mockMovable: Movable = {
        getPosition() : IVector {
            return {x:12, y: 5}
        },
        getVelocity() : IVector {
            return {x:-7, y: 3}
        },
        setPosition( newV: IVector) : void | never {
            throw new Error("No data")
        }
    };

    const command = new movable.CommandMove(mockMovable);
    
    assert.throws(() => { command.execute() }, Error);
    
})