#pragma once
#include "lexer.h"
#include "ast.h"
#include <stdexcept>

class Parser {
public:
    explicit Parser(const std::vector<Token>& tokens)
        : tokens_(tokens), pos_(0) {}

    NodePtr parse() {
        NodePtr prog = makeNode(NodeType::Program);
        prog->children.push_back(parseStmtList());
        expect(TokenType::END_OF_FILE);
        return prog;
    }

private:
    std::vector<Token> tokens_;
    size_t pos_;

    // ── Helpers ────────────────────────────────────────────────────────────────

    const Token& peek() const { return tokens_[pos_]; }

    const Token& advance() { return tokens_[pos_++]; }

    bool check(TokenType t) const { return peek().type == t; }

    bool match(TokenType t) {
        if (check(t)) { advance(); return true; }
        return false;
    }

    const Token& expect(TokenType t) {
        if (!check(t))
            throw std::runtime_error("Parse error at line " +
                std::to_string(peek().line) + ": unexpected '" + peek().value + "'");
        return advance();
    }

    bool isType() const {
        auto t = peek().type;
        return t == TokenType::TYPE_INT || t == TokenType::TYPE_FLOAT || t == TokenType::TYPE_BOOL;
    }

    // ── Grammar rules ──────────────────────────────────────────────────────────

    // StmtList → Stmt StmtList | ε
    NodePtr parseStmtList() {
        NodePtr list = makeNode(NodeType::StmtList);
        while (!check(TokenType::END_OF_FILE) && !check(TokenType::RBRACE)) {
            list->children.push_back(parseStmt());
        }
        return list;
    }

    // Stmt → VarDecl | AssignStmt | PrintStmt | Block
    NodePtr parseStmt() {
        if (isType())              return parseVarDecl();
        if (check(TokenType::PRINT))  return parsePrintStmt();
        if (check(TokenType::LBRACE)) return parseBlock();
        if (check(TokenType::ID))     return parseAssignStmt();

        throw std::runtime_error("Parse error at line " +
            std::to_string(peek().line) + ": unexpected '" + peek().value + "'");
    }

    // VarDecl → Type id '=' Expr ';'
    NodePtr parseVarDecl() {
        NodePtr node = makeNode(NodeType::VarDecl);
        node->value = advance().value;           // type keyword
        node->children.push_back(makeNode(NodeType::Identifier, expect(TokenType::ID).value));
        expect(TokenType::ASSIGN);
        node->children.push_back(parseExpr());
        expect(TokenType::SEMICOLON);
        return node;
    }

    // AssignStmt → id '=' Expr ';'
    NodePtr parseAssignStmt() {
        std::string name = expect(TokenType::ID).value;
        expect(TokenType::ASSIGN);
        NodePtr node = makeNode(NodeType::AssignStmt);
        node->children.push_back(makeNode(NodeType::Identifier, name));
        node->children.push_back(parseExpr());
        expect(TokenType::SEMICOLON);
        return node;
    }

    // PrintStmt → 'print' '(' Expr ')' ';'
    NodePtr parsePrintStmt() {
        expect(TokenType::PRINT);
        expect(TokenType::LPAREN);
        NodePtr node = makeNode(NodeType::PrintStmt);
        node->children.push_back(parseExpr());
        expect(TokenType::RPAREN);
        expect(TokenType::SEMICOLON);
        return node;
    }

    // Block → '{' StmtList '}'
    NodePtr parseBlock() {
        expect(TokenType::LBRACE);
        NodePtr node = makeNode(NodeType::Block);
        node->children.push_back(parseStmtList());
        expect(TokenType::RBRACE);
        return node;
    }

    // ── Expression hierarchy (precedence low → high) ───────────────────────────

    // Expr → LogicExpr
    NodePtr parseExpr() { return parseLogicExpr(); }

    // LogicExpr → CompExpr ( ('&&'|'||') CompExpr )*
    NodePtr parseLogicExpr() {
        NodePtr left = parseCompExpr();
        while (check(TokenType::AND) || check(TokenType::OR)) {
            std::string op = advance().value;
            NodePtr node = makeNode(NodeType::BinaryExpr, op);
            node->children.push_back(left);
            node->children.push_back(parseCompExpr());
            left = node;
        }
        return left;
    }

    // CompExpr → AddExpr ( ('=='|'!='|'<'|'>'|'<='|'>=') AddExpr )*
    NodePtr parseCompExpr() {
        NodePtr left = parseAddExpr();
        while (check(TokenType::EQ)  || check(TokenType::NEQ) ||
               check(TokenType::LT)  || check(TokenType::GT)  ||
               check(TokenType::LEQ) || check(TokenType::GEQ)) {
            std::string op = advance().value;
            NodePtr node = makeNode(NodeType::BinaryExpr, op);
            node->children.push_back(left);
            node->children.push_back(parseAddExpr());
            left = node;
        }
        return left;
    }

    // AddExpr → MulExpr ( ('+'|'-') MulExpr )*
    NodePtr parseAddExpr() {
        NodePtr left = parseMulExpr();
        while (check(TokenType::PLUS) || check(TokenType::MINUS)) {
            std::string op = advance().value;
            NodePtr node = makeNode(NodeType::BinaryExpr, op);
            node->children.push_back(left);
            node->children.push_back(parseMulExpr());
            left = node;
        }
        return left;
    }

    // MulExpr → UnaryExpr ( ('*'|'/'|'%') UnaryExpr )*
    NodePtr parseMulExpr() {
        NodePtr left = parseUnaryExpr();
        while (check(TokenType::STAR) || check(TokenType::SLASH) || check(TokenType::PERCENT)) {
            std::string op = advance().value;
            NodePtr node = makeNode(NodeType::BinaryExpr, op);
            node->children.push_back(left);
            node->children.push_back(parseUnaryExpr());
            left = node;
        }
        return left;
    }

    // UnaryExpr → ('-' | '!') UnaryExpr | Primary
    NodePtr parseUnaryExpr() {
        if (check(TokenType::MINUS) || check(TokenType::NOT)) {
            std::string op = advance().value;
            NodePtr node = makeNode(NodeType::UnaryExpr, op);
            node->children.push_back(parseUnaryExpr());
            return node;
        }
        return parsePrimary();
    }

    // Primary → int_lit | float_lit | bool_lit | id | '(' Expr ')'
    NodePtr parsePrimary() {
        if (check(TokenType::INT_LIT))   return makeNode(NodeType::IntLit,   advance().value);
        if (check(TokenType::FLOAT_LIT)) return makeNode(NodeType::FloatLit, advance().value);
        if (check(TokenType::BOOL_LIT))  return makeNode(NodeType::BoolLit,  advance().value);
        if (check(TokenType::ID))        return makeNode(NodeType::Identifier, advance().value);
        if (match(TokenType::LPAREN)) {
            NodePtr e = parseExpr();
            expect(TokenType::RPAREN);
            return e;
        }
        throw std::runtime_error("Parse error at line " +
            std::to_string(peek().line) + ": expected expression, got '" + peek().value + "'");
    }
};
