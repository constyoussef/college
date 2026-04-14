# MiniC Compiler

A compiler that translates **MiniC** (a mini C-like language) to **JavaScript**.

## Files
| File | Role |
|------|------|
| `lexer.h` | Phase 1 – Tokenizer |
| `parser.h` | Phase 2 – Parser (builds AST from CFG) |
| `ast.h` | AST node definitions |
| `codegen.h` | Phase 3 – JavaScript code generator |
| `main.cpp` | Entry point |

## Build
```bash
g++ -std=c++17 -o minic main.cpp
```

## Usage
```bash
./minic input.mc output.js   # compile
node output.js               # run
```

## MiniC Language
```c
int x = 10;
float y = 3.14;
bool flag = true;

int result = x + 5;
print(result);

{
    int inner = x * 2;
    print(inner);
}
```

## Supported Features
- Types: `int`, `float`, `bool`
- Variable declaration: `int x = expr;`
- Assignment: `x = expr;`
- Print: `print(expr);`
- Blocks: `{ ... }`
- Arithmetic: `+ - * / %`
- Comparison: `== != < > <= >=`
- Logical: `&& || !`
- Unary: `-x`, `!flag`
