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

let exceptionMovalbeCommand: ICommand = new ExceptionMovalbeCommand();

let exceptionMovalbeMap = new Map([
    ['Error', exceptionMovalbeCommand],
])

const exceptionStore = new Map<string,  Map<string, ICommand>>([
    ['Movable', exceptionMovalbeMap],
])

module.exports.exceptionStore = exceptionStore