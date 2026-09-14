# TypeScript CPU

A basic CPU implemented in TypeScript with a custom programming language and compiler.

```ts
STORE(0xFD, 1)
STORE(0xFE, 2)
ADD(0xFD, 0xFE)
R_MOVE(0xFF)
PRINT(0xF)
```

```ts
const compiledProgram = Compiler.compile("./program.ass");

const cpu = new CPU();
cpu.loadProgram(compiledProgram);
cpu.run();
```



<p align="center">
    <a href="https://youtu.be/yQP7KTeFAAs">
        <img width="400" src="https://raw.githubusercontent.com/anthonybudd/anthonybudd/master/img/yt-ts-cpu-cover.png" alt="YouTube Video">
    </a>
    </br>
    <a href="https://youtu.be/yQP7KTeFAAs">
    Watch On YouTube: youtu.be/yQP7KTeFAAs
    </a>
</p>



### Getting Started

To get started with this project clone the repo and run the index.ts file with tsx

```sh
git clone git@github.com:anthonybudd/TS-CPU.git
cd TS-CPU
npm i
npx tsx index.ts
```



### Custom Language: Anthony's Simple Script

The compiler will translate the `.ass` code into opcodes for the CPU to execute. 

Below is an example program that uses most of the commands.

```js
STORE(0xFD, 1)
STORE(0xFE, 2)
STORE(0xFF, 10)

FooBar:
ADD(0xFD, 0xFE)
R_MOVE(0xFD)
PRINT(0xFD)

IF(0xFD <= 0xFF)
    JUMP(FooBar)

PRINT(0xFD)
HALT
```

#### `STORE(address, value)`
Store the given value at the specified address in RAM.

#### `R_MOVE(address)`
Move the value from the register into the specified RAM address.

#### `ADD(address1, address2)`
Add the values at `address1` and `address2`. Store the result in the register.

#### `SUB(address1, address2)`
Subtract the value at `address2` from the value at `address1`. Store the result in the register.

#### `IF(address1 condition address2)`
Conditional statement. If the condition is true, execute the next instruction.

#### `JUMP(label)`
Jump to the line labeled with `label`. The compiler will replace `label` with the corresponding hex address.

#### `PRINT(address)`
Print the value stored at the given memory address.

#### `HALT`
Terminate the program.


### OpCodes


| Opcode | Name   | Description                                                        |
| ------ | ------ | ------------------------------------------------------------------ |
| `0x00` | `NOP`  | No operation                                                       |
| `0x01` | `STOR` | STORE(address, value) — Store value at address                     |
| `0x02` | `RMV`  | R_MOVE(address) — Move register to address                         |
| `0x03` | `ADD`  | ADD(address1, address2) — Add addresses, stores result in register |
| `0x04` | `SUB`  | SUB(address1, address2) — Subtract, stores result in register      |
| `0x05` | `GT`   | IF(address1 > address2) — Conditional, only next instruction runs if true        |
| `0x06` | `GTE`  | IF(address1 >= address2)                                                         |
| `0x07` | `LT`   | IF(address1 < address2)                                                          |
| `0x08` | `LTE`  | IF(address1 <= address2)                                                         |
| `0x09` | `EQ`   | IF(address1 == address2)                                                         |
| `0x0A` | `NEQ`  | IF(address1 != address2)                                                         |
| `0xFD` | `JUMP` | JUMP(address) — Jump to marker                             |
| `0xFE` | `PRNT` | PRINT(address) — Print value at address                            |
| `0xFF` | `HALT` | Terminate program                                                  |


