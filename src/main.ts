const rotableCom = require("./rotable")
const movableCom = require("./movable")

const CommandRotateCl = rotableCom.CommandRotate
const CommandMoveCl = movableCom.CommandMove

interface ICommand {
    Execute(): void
}

commandMova: ICommand = {
   
}


let mockMovable = {
    getPosition() {
        return { x: 12, y: 5 };
    },
    getVelocity() {
        return { x: -7, y: 3 };
    },
    setPosition(newV) {
    }
};
const expected = new movable.Vector(5, 8);

const command = new movable.CommandMove(mockMovable);

commandsCollection: Array<ICommand> =[command]