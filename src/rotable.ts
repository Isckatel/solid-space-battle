type Direction  = number

interface Rotable {
    getDirection() : Direction
    getAngularVelocity() : number
    setDirection(newV: Direction) 
}