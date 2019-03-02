const readline = require('readline')

const validateInstruction = require('./src/language').validateInstruction
const interpret = require('./src/interpreter').interpret

const args = process.argv.slice(2)
const inputFile = args[0]
const fileContent = []

const fileLineReader = readline.createInterface({
    input: require('fs').createReadStream(inputFile)
})

fileLineReader.on('line',  line => {
    const res = validateInstruction(line)
    if(res){
        fileContent.push(line)
    }else{
        console.log('\x1b[31m%s\x1b[0m', `syntax error on line ${fileContent.length+1}: ${line}`)
        process.exit(0)
    }
})

fileLineReader.on('close',  () => {
    const context = {_i: 0, _err: 0}
    while (context._i < fileContent.length && !context._err) {
        const instruction = fileContent[context._i]
        console.log(`> ${instruction}`)
        interpret(instruction, context, fileContent.length)
    }
    console.log(`( context ${JSON.stringify(context)} )`)
})


