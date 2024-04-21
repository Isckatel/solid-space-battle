type Direction  = number

interface Rotable {
    getDirection() : Direction
    getAngularVelocity() : number
    setDirection(newV: Direction) : void
    getDirectionsNumber(): number 
}


class CommandRotate {
    private rotable: Rotable
    private a: number = 0
    constructor(rotable: Rotable) {
        this.rotable = rotable
    }
    public execute() {
        this.a = this.rotable.getDirection()
            + this.rotable.getAngularVelocity()%this.rotable.getDirectionsNumber()
        this.rotable.setDirection(this.a)
    }

    public getValue(): number {
        return this.a
    }
}

module.exports.CommandRotate = CommandRotate