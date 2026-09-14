import fs from "fs";
import CPU from "./CPU.ts";

export default class Compiler {

    static compile(programFile: string): string {

        if (!fs.existsSync(programFile)) throw new Error(`Program file "${programFile}" does not exist.`);
        const program = fs.readFileSync(programFile, 'utf8');
        const lines = program.split('\n');

        const compiledProgram: number[] = [];
        const jumpLocations: { [key: string]: number; } = {};

        for (let i = 0; i < lines.length; i++) {
            let lineNumber = i + 1;
            let line = lines[i];
            line = line.trim();
            if (!line || line.startsWith("//")) continue;

            const matchStore = line.match(/^STORE\(\s*(0x[a-fA-F0-9]+|\d+)\s*,\s*(0x[a-fA-F0-9]+|\d+)\s*\)$/);
            const matchAdd = line.match(/^ADD\(\s*(0x[a-fA-F0-9]+)\s*,\s*(0x[a-fA-F0-9]+)\s*\)$/);
            const matchSub = line.match(/^SUB\(\s*(0x[a-fA-F0-9]+)\s*,\s*(0x[a-fA-F0-9]+)\s*\)$/);
            const matchRMove = line.match(/^R_MOVE\(\s*(0x[a-fA-F0-9]+|\d+)\s*\)$/);
            const matchIf = line.match(/IF\((0x[0-9A-Fa-f]+)\s*(<=|>=|==|!=|<|>)\s*(0x[0-9A-Fa-f]+)\)/);
            const matchJump = line.match(/^JUMP\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)$/);
            const matchPrint = line.match(/^PRINT\(\s*(0x[a-fA-F0-9]+|\d+)\s*\)$/);

            // STORE(address, value)
            if (matchStore) {
                let [_, address, value] = matchStore;
                compiledProgram.push(CPU.Opcodes.STOR);
                compiledProgram.push(Number(address));
                compiledProgram.push(parseInt(value) & 0xFF);
                continue;
            }

            // ADD(address1, address2)
            if (matchAdd) {
                let [_, address1, address2] = matchAdd;
                compiledProgram.push(CPU.Opcodes.ADD);
                compiledProgram.push(Number(address1));
                compiledProgram.push(Number(address2));
                continue;
            }

            // SUB(address1, address2)
            if (matchSub) {
                let [_, address1, address2] = matchSub;
                compiledProgram.push(CPU.Opcodes.SUB);
                compiledProgram.push(Number(address1));
                compiledProgram.push(Number(address2));
                continue;
            }

            // R_MOVE(address)
            if (matchRMove) {
                let [_, address] = matchRMove;
                compiledProgram.push(CPU.Opcodes.RMV);
                compiledProgram.push(Number(address));
                continue;
            }

            // JUMP(location)
            if (matchJump) {
                let [_, location] = matchJump;
                if (!jumpLocations[location]) throw new Error(`Compile Error: Unknown jump location "${location}" on line ${lineNumber}`);
                compiledProgram.push(CPU.Opcodes.JUMP);
                compiledProgram.push(Number(jumpLocations[location]));
                continue;
            }

            // IF(address1 comparator address2)
            if (matchIf) {
                let [_, address1, comparator, address2] = matchIf;

                if (comparator === '>') {
                    compiledProgram.push(CPU.Opcodes.GT);
                } else if (comparator === '>=') {
                    compiledProgram.push(CPU.Opcodes.GTE);
                } else if (comparator === '<') {
                    compiledProgram.push(CPU.Opcodes.LT);
                } else if (comparator === '<=') {
                    compiledProgram.push(CPU.Opcodes.LTE);
                } else if (comparator === '==') {
                    compiledProgram.push(CPU.Opcodes.EQ);
                } else if (comparator === '!=') {
                    compiledProgram.push(CPU.Opcodes.NEQ);
                } else {
                    throw new Error(`Compile Error: Unknown comparator ${comparator} on line ${lineNumber}`);
                }

                compiledProgram.push(Number(address1));
                compiledProgram.push(Number(address2));
                continue;
            }

            // PRINT(address)
            if (matchPrint) {
                let [_, address] = matchPrint;
                compiledProgram.push(CPU.Opcodes.PRNT);
                compiledProgram.push(Number(address));
                continue;
            }

            // HALT
            if (line === 'HALT') {
                compiledProgram.push(CPU.Opcodes.HALT);
                continue;
            }

            // Marker:
            if (/^[\w\d_]+:$/.test(line)) {
                const marker = line.slice(0, -1);
                if (jumpLocations[marker]) throw new Error(`Compile Error: Jump marker "${marker}" already used`);
                jumpLocations[marker] = compiledProgram.length;
                continue;
            }

            throw new Error(`Compile Error: Unknown instruction on line ${lineNumber}`);
        }

        return compiledProgram.join("\n");
    }
}