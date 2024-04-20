const assert = require("assert")
const movable = require("./movable")

interface IPostion {
    getValue() : IVector
}

//тест, который проверяет, что для уравнения x^2+1 = 0 корней нет (возвращается пустой массив)
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