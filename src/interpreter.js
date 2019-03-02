// readlineSync not working if script is ruuning via nodemon
const readlineSync = require('readline-sync');
const parseInstruction = require('./language').parseInstruction

const logErr = msg =>
    console.log('\x1b[31m%s\x1b[0m', msg);

const interpret = (instructionStr, context, nLines) => {
    const inst = parseInstruction(instructionStr)

    // console.log(context)
    switch (inst[0]) {
        case 'READ': {
            const varName = inst[1]
            const input = readlineSync.question(`${varName}: `)
            context[varName] = input
            context._i++
        }
            break

        case 'WRITE': {
            const varName = inst[1]
            if(varName in context) {
                console.log(context[varName])
                context._i++
            } else {
                logErr(`err on line ${context._i + 1}: variable '${varName}' is not defined`)
                context._err = 1
                return
            }

        }
            break

        case 'JUMP': {
            const lineNum = inst[1]
            if(lineNum > nLines) {
                logErr(`err on line ${context._i + 1}: line ${lineNum} does not exist`)
                context._err = 1
                return
            }
            context._i = parseInt(lineNum) - 1
        }
            break
        case 'JUMPT':
        case 'JUMPF': {
            const lineNum = inst[2]
            const opnd = inst[1]
            let opndVal

            if(lineNum > nLines) {
                logErr(`err on line ${context._i + 1}: line ${lineNum} does not exist`)
                context._err = 1
                return
            }

            if(!isNaN(opnd)) {
                opndVal = opnd
            } else if(opnd in context) {
                opndVal = context[opnd]
            } else {
                logErr(`err on line ${context._i + 1}: variable '${opnd}' is not defined`)
                context._err = 1
                return
            }

            // if true checking if val is truthy(JUMPT) else falsy(JUMPF)
            const checkT = inst[0].slice(-1) === 'T'
            if((opndVal && checkT) || (!opndVal && !checkT)) {
                context._i = parseInt(lineNum) - 1
            } else {
                context._i++
            }
        }
            break

        case '=': {
            const varName = inst[1]
            const opnd = inst[2]
            let opndVal

            if(!isNaN(opnd)) {
                opndVal = opnd
            } else if(opnd in context) {
                opndVal = context[opnd]
            } else {
                logErr(`err on line ${context._i + 1}: variable '${opnd}' is not defined`)
                context._err = 1
                return
            }

            context[varName] = opndVal
            context._i++
        }
            break

        case '+':
        case '-':
        case '*':
        case '<':
        case '>':
        case '>=':
        case '<=':
        case '==': {
            const operator = inst[0]
            //opnd1/2 - name of var or number
            const opnd1 = inst[1]
            const opnd2 = inst[2]
            const varName = inst[3]
            let opnd1Val
            let opnd2Val

            if(!isNaN(opnd1)) {
                opnd1Val = opnd1
            } else if(opnd1 in context) {
                opnd1Val = context[opnd1]
            } else {
                logErr(`err on line ${context._i + 1}: variable '${opnd1}' is not defined`)
                context._err = 1
                return
            }

            if(!isNaN(opnd2)) {
                opnd2Val = opnd2
            } else if(opnd2 in context) {
                opnd2Val = context[opnd2]
            } else {
                logErr(`err on line ${context._i + 1}: variable '${opnd2}' is not defined`)
                context._err = 1
                return
            }

            const res = eval(`${opnd1Val} ${operator} ${opnd2Val}`)
            context[varName] = typeof res === 'boolean' ? (res ? 1 : 0) : res
            context._i++
        }
            break
        case 'NOP': {
            context._i++
        }
    }
}

module.exports = {
    interpret
}
