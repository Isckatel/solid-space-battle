interface ICommand {
    execute(): void
    getType(): string
}

class ExceptionMovalbeCommand implements ICommand {
    execute(): void {
        console.log('exceptionMovalbeCommand')
    }

    getType(): string {
        return 'exceptionMovalbeCommand'
    }
}

let exceptionMovalbeCommand = new ExceptionMovalbeCommand();

let exceptionMovalbeMap = new Map([
    ['Error', exceptionMovalbeCommand],
])

const exceptionStore = new Map([
    ['Movable', exceptionMovalbeMap],
])

module.exports.exceptionStore = exceptionStore