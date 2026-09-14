import CPU from "./CPU.ts";
import Compiler from "./Compiler.ts";

const cpu = new CPU();
cpu.loadProgram(Compiler.compile("./program.ass"));
cpu.run();

// OR //

// import readline from 'readline';
// cpu.debugMode = true;
// console.log('Press Enter to step through the program. Press d to debug. Ctrl+C to exit.');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// const stepOnKeypress = () => rl.question('> ', (answer: any) => {
//     if (answer.trim().toLowerCase() === 'd') {
//         cpu.debug();
//         return stepOnKeypress();
//     }
//     if (!cpu.step()) {
//         console.log('Program halted.');
//         return rl.close();
//     } else {
//         return stepOnKeypress();
//     }
// });
// stepOnKeypress();