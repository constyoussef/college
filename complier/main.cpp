#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include "lexer.h"
#include "parser.h"
#include "codegen.h"

std::string readFile(const std::string& path) {
    std::ifstream f(path);
    if (!f.is_open())
        throw std::runtime_error("Cannot open file: " + path);
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

void writeFile(const std::string& path, const std::string& content) {
    std::ofstream f(path);
    if (!f.is_open())
        throw std::runtime_error("Cannot write file: " + path);
    f << content;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: minic <source.mc> [output.js]\n";
        std::cerr << "  source.mc  - input file written in MiniC\n";
        std::cerr << "  output.js  - optional output file (default: out.js)\n";
        return 1;
    }

    std::string inputPath  = argv[1];
    std::string outputPath = (argc >= 3) ? argv[2] : "out.js";

    try {
        // ── Phase 1: Read source ────────────────────────────────────────────
        std::string source = readFile(inputPath);
        std::cout << "[1/3] Lexing  " << inputPath << " ...\n";

        // ── Phase 2: Lex ────────────────────────────────────────────────────
        Lexer lexer(source);
        auto tokens = lexer.tokenize();
        std::cout << "      " << tokens.size() - 1 << " tokens produced.\n";

        // ── Phase 3: Parse ──────────────────────────────────────────────────
        std::cout << "[2/3] Parsing ...\n";
        Parser parser(tokens);
        auto ast = parser.parse();
        std::cout << "      AST built successfully.\n";

        // ── Phase 4: Code generation ────────────────────────────────────────
        std::cout << "[3/3] Generating JavaScript ...\n";
        CodeGen cg;
        std::string jsCode = cg.generate(ast);

        writeFile(outputPath, jsCode);
        std::cout << "      Written to " << outputPath << "\n";
        std::cout << "\nDone! Run with: node " << outputPath << "\n";

    } catch (const std::exception& e) {
        std::cerr << "\nError: " << e.what() << "\n";
        return 1;
    }

    return 0;
}
