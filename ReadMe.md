# TypeScript CPU

A simple CPU and Compiler implemented in TypeScript.

```ts
const compiledProgram = Compiler.compile("./program.ass");

const cpu = new CPU();
cpu.loadProgram(compiledProgram);
cpu.run();
```

<p align="center">
    <a href="https://youtu.be/yQP7KTeFAAs">
        <img width="300" src="https://raw.githubusercontent.com/anthonybudd/anthonybudd/master/img/yt-ts-cpu-cover.png" alt="YouTube Video">
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
STORE(0x00, 0)
STORE(0x01, 2)
STORE(0x02, 16)

FooBar:
ADD(0x00, 0x01)
R_MOVE(0x00)
PRINT(0x00)

IF(0x00 == 0x01)
    JUMP(FooBar)
```



### OpCodes


| Opcode | Name   | Description                                                        |
| ------ | ------ | ------------------------------------------------------------------ |
| `0x00` | `NOP`  | No operation                                                       |
| `0x01` | `STOR` | STORE(address, value) — Store value at address                     |
| `0x02` | `RMV`  | R_MOVE(address) — Move register to address                         |
| `0x03` | `ADD`  | ADD(address1, address2) — Add addresses, stores result in register |
| `0x04` | `SUB`  | SUB(address1, address2) — Subtract, stores result in register      |
| `0x05` | `GT`   | IF(a > b) — Conditional, only next instruction runs if true        |
| `0x06` | `GTE`  | IF(a >= b)                                                         |
| `0x07` | `LT`   | IF(a < b)                                                          |
| `0x08` | `LTE`  | IF(a <= b)                                                         |
| `0x09` | `EQ`   | IF(a == b)                                                         |
| `0x0A` | `NEQ`  | IF(a != b)                                                         |
| `0xFD` | `JUMP` | JUMP(address) — Set counter to address                             |
| `0xFE` | `PRNT` | PRINT(address) — Print value at address                            |
| `0xFF` | `HALT` | Terminate program                                                  |


