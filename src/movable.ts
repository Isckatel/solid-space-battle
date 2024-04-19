
type Vector = Array<number>

interface Movable {
    getPosition() : Vector
    getVelocity() : Vector
    setPosition( newV: Vector) : void
}