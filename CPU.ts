export default class CPU {

    public debugMode = false;

    // Program Counter
    counter: number = 0x00;

    // Register
    register: number = 0x00;

    // Memory
    memory = new Uint8Array(256);

    static Opcodes = {
        NOP: 0x00,  // NO OPERATION
        STOR: 0x01, // STORE
        RMV: 0x02,  // R_MOVE

        ADD: 0x03,  // ADD
        SUB: 0x04,  // SUBTRACT

        GT: 0x05,   // GREATER THAN
        GTE: 0x06,  // GREATER THAN OR EQUAL TO
        LT: 0x07,   // LESS THAN
        LTE: 0x08,  // LESS THAN N OR EQUAL TO
        EQ: 0x09,   // EQUAL
        NEQ: 0x0A,  // NOT EQUAL

        JUMP: 0xFD, // JUMP
        PRNT: 0xFE, // PRINT
        HALT: 0xFF, // HALT
    };

    reset(): void {
        this.counter = 0x00;
        this.register = 0x00;
        this.memory.fill(0, 129, 256);
    }

    loadProgram(program: string): void {
        this.reset();
        this.memory.fill(0);
        const lines = program.split('\n');
        let addr = 0;
        for (const line of lines) {
            if (addr > 128)
                throw new Error('Program is larger than 128 bytes');
            const value = Number(line.trim());
            if (!Number.isInteger(value) || value < 0 || value > 0xFF)
                throw new Error(`Invalid byte: ${line}`);
            this.memory[addr++] = value;
        }
    }

    readAddress(address: number): number {
        if (address < 0x81 || address > 0xFF)
            throw new Error(`Invalid address: ${address}`);
        return this.memory[address] ?? 0;
    }

    writeAddress(address: number, value: number): void {
        if (address < 0x81 || address > 0xFF)
            throw new Error(`Invalid address: ${address}`);
        this.memory[address] = value & 0xFF;
    }

    fetchNextByte(): number {
        if (this.counter > 128) return -1;
        const value = this.memory[this.counter];
        this.counter++;
        return value;
    }

    step(): boolean {
        const opcode = this.fetchNextByte();
        if (opcode === -1) return false;
        if (!opcode && opcode !== CPU.Opcodes.NOP) return false;
        return this.execute(opcode);
    }

    run(): void {
        while (true) {
            const running = this.step();
            if (!running) break;
        }
    }

    debug(): void {
        console.log({
            counter: this.counter,
            register: this.register,
            memory: this.memory,
        });
    }

    execute(opcode: number): boolean {
        switch (opcode) {
            case CPU.Opcodes.NOP:
                return true;

            case CPU.Opcodes.STOR: {
                const address = this.fetchNextByte();
                const value = this.fetchNextByte();
                if (this.debugMode) console.log(`STOR(address:${address}, ${value})`);
                this.writeAddress(address, value);
                return true;
            }

            case CPU.Opcodes.ADD: {
                const address1 = this.fetchNextByte();
                const address2 = this.fetchNextByte();
                const value1 = this.readAddress(address1);
                const value2 = this.readAddress(address2);
                if (this.debugMode) console.log(`ADD(address:${address1}, address:${address2})`);
                this.register = (value1 + value2) & 0xFF;
                return true;
            }

            case CPU.Opcodes.SUB: {
                const address1 = this.fetchNextByte();
                const address2 = this.fetchNextByte();
                const value1 = this.readAddress(address1);
                const value2 = this.readAddress(address2);
                if (this.debugMode) console.log(`SUB(address:${address1}, address:${address2})`);
                this.register = (value1 - value2) & 0xFF;
                return true;
            }

            case CPU.Opcodes.RMV: {
                const address = this.fetchNextByte();
                if (this.debugMode) console.log(`R_MOVE(address:${address})`);
                this.writeAddress(address, this.register);
                return true;
            }

            case CPU.Opcodes.JUMP: {
                const jumpTo = this.fetchNextByte();
                if (this.debugMode) console.log(`JUMP ${jumpTo}`);
                this.counter = jumpTo;
                return true;
            }

            case CPU.Opcodes.GT:
            case CPU.Opcodes.GTE:
            case CPU.Opcodes.LT:
            case CPU.Opcodes.LTE:
            case CPU.Opcodes.EQ:
            case CPU.Opcodes.NEQ: {
                const address1 = this.fetchNextByte();
                const address2 = this.fetchNextByte();
                const value1 = this.readAddress(address1);
                const value2 = this.readAddress(address2);
                if (this.debugMode) console.log(`IF(${value1} ${['>', '>=', '<', '<=', '==', '!='][opcode - 5]} ${value2})`);

                if (CPU.Opcodes.GT === opcode) {
                    if (!(value1 > value2)) this.skipInstruction();
                } else if (CPU.Opcodes.GTE === opcode) {
                    if (!(value1 >= value2)) this.skipInstruction();
                } else if (CPU.Opcodes.LT === opcode) {
                    if (!(value1 < value2)) this.skipInstruction();
                } else if (CPU.Opcodes.LTE === opcode) {
                    if (!(value1 <= value2)) this.skipInstruction();
                } else if (CPU.Opcodes.EQ === opcode) {
                    if (!(value1 === value2)) this.skipInstruction();
                } else if (CPU.Opcodes.NEQ === opcode) {
                    if (!(value1 !== value2)) this.skipInstruction();
                }

                return true;
            }

            case CPU.Opcodes.PRNT: {
                const address = this.fetchNextByte();
                const value = this.readAddress(address);
                if (this.debugMode) console.log(`PRINT(address:${address})`);
                console.log(`Memory: ${address} = ${value}`);
                return true;
            }

            case CPU.Opcodes.HALT:
                return false;

            default:
                throw new Error(`Unknown opcode: 0x${opcode} `);
        }
    }

    skipInstruction(): void {
        const opcode = this.memory[this.counter];

        switch (opcode) {
            case CPU.Opcodes.STOR:
            case CPU.Opcodes.ADD:
            case CPU.Opcodes.SUB:
            case CPU.Opcodes.GT:
            case CPU.Opcodes.GTE:
            case CPU.Opcodes.LT:
            case CPU.Opcodes.LTE:
            case CPU.Opcodes.EQ:
            case CPU.Opcodes.NEQ:
                this.counter += 3;
                break;

            case CPU.Opcodes.RMV:
            case CPU.Opcodes.JUMP:
            case CPU.Opcodes.PRNT:
                this.counter += 2;
                break;

            case CPU.Opcodes.NOP:
            case CPU.Opcodes.HALT:
                this.counter += 1;
                break;

            default:
                throw new Error(`Unknown opcode: ${opcode}`);
        }
    }
}