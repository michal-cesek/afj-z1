const syntax = [
    /^(READ|WRITE),([a-zA-Z]+)$/g,
    /^(JUMP),(\d+)$/g,
    /^(JUMPT|JUMPF),([a-zA-Z]+|-?\d+),(\d+)$/g,
    /^(=),([a-zA-Z]+),([a-zA-Z]+|-?\d+)$/g,
    /^(\+|-|\*|<|>|>=|<=|==),([a-zA-Z]+|-?\d+),([a-zA-Z]+|-?\d+),([a-zA-Z]+)$/g,
    /^(NOP)$/g
]

const parseInstruction = instruction =>
    syntax.reduce((acc, curr) => {
        curr.lastIndex = 0
        const match = curr.exec(instruction)
        return match ? match.slice(1) : acc
    }, null)

const validateInstruction = line =>
    syntax.find(rule => line.match(rule))



module.exports = {
    validateInstruction,
    parseInstruction
}