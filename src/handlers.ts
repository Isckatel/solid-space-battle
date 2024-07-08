const fs3 = require('fs')

interface ICommand {
    execute(): void
    getType(): string
}

class DefaultCommand implements ICommand {
    execute(): void {
        console.log('DefaultCommand')
    }

    getType(): string {
        return 'DefaultCommand'
    }
}


class DefaultExceptionHandler implements ICommand {
    protected commandsCollection
    constructor(commandsCollection) {
        this.commandsCollection = commandsCollection
    }
    execute(): void {
        console.log('DefaultExceptionHandler')
    }

    getType(): string {
        return 'DefaultExceptionHandler'
    }
}

class  WriteExceptionHandler extends DefaultExceptionHandler {
    private e: any
    constructor(commandsCollection, e) {
        super(commandsCollection)
        this.e = e
    }
    execute(): void {
        console.log('WriteExceptionHandler')
        this.commandsCollection.add(
            new WriteExceptionCommand(this.e.name)
        )
    }

    getType(): string {
        return 'WriteExceptionHandler'
    }
}

class WriteExceptionCommand extends DefaultCommand { 
    private nameException
    constructor(nameException) {
        super()
        this.nameException = nameException
    }
    execute(): void {
        fs3.appendFile('error.log', this.nameException + ' '  + new Date().toLocaleDateString('ru') + ' ' +new Date().toLocaleTimeString('ru') + '\n',  function(error){
            if(error) { return console.log(error) }
        })
        console.log('Execute WriteCommand')
    }
    public getType(): string {
        return 'WriteCommand';
    }
}

class ReplayCommand extends DefaultCommand { 
    private command: ICommand
    constructor(command) {
        super()
        this.command = command
    }
    execute(): void {
        commandsCollection.add(this.command)
        console.log('Execute ReplayCommand')
    }
    public getType(): string {
        return 'ReplayCommand';
    }
}

class ReplayExceptionHandler extends DefaultExceptionHandler {
    private command: ICommand
    constructor(commandsCollection, command) {
        super(commandsCollection)
        this.command = command
    }
    execute(): void {
        console.log('ReplayExceptionHandler')
        this.commandsCollection.add(
            new ReplayCommand(this.command)
        )
    }

    getType(): string {
        return 'ReplayExceptionHandler'
    }
}

module.exports = { DefaultExceptionHandler, WriteExceptionHandler, ReplayExceptionHandler, ReplayCommand, WriteExceptionCommand }