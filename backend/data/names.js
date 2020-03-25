class Names {
    constructor() {
        this.names = []
    }

    addName(name) {
        this.names.push(name)
    }
}

const names = new Names();
module.exports = names;