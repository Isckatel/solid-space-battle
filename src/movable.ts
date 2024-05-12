interface IVector {
    x: number
    y: number
}

interface Movable {
    getPosition() : IVector
    getVelocity() : IVector
    setPosition( newV: IVector) : void
}

interface ICommand {
    execute(): void
    getType(): string
}

class Vector  implements IVector  {
    public x: number
    public y: number
    constructor( x:number, y:number) {
        this.x = x
        this.y = y
    }
}


class CommandMove implements ICommand  {
    private movable: Movable
    private position: IVector = {x:0, y:0}
    constructor(movable: Movable) {
        this.movable = movable
    }
    public execute() {
        this.position = new Vector(
            this.movable.getPosition().x + this.movable.getVelocity().x,
            this.movable.getPosition().y + this.movable.getVelocity().y
        )
        this.movable.setPosition(this.position)
    }
    public getType(): string {
        return 'Default';
    }
    public getValue(): IVector {
        return this.position
    }
}

module.exports.Vector = Vector
module.exports.CommandMove = CommandMove