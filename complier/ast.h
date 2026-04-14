#pragma once
#include <string>
#include <vector>
#include <memory>

// ─── AST Node Types ───────────────────────────────────────────────────────────

enum class NodeType {
    Program, StmtList, VarDecl, AssignStmt, PrintStmt, Block,
    BinaryExpr, UnaryExpr, Identifier, IntLit, FloatLit, BoolLit
};

struct ASTNode {
    NodeType type;
    std::string value;           // for literals, operators, identifiers, type names
    std::vector<std::shared_ptr<ASTNode>> children;

    ASTNode(NodeType t, const std::string& v = "")
        : type(t), value(v) {}
};

using NodePtr = std::shared_ptr<ASTNode>;

inline NodePtr makeNode(NodeType t, const std::string& v = "") {
    return std::make_shared<ASTNode>(t, v);
}
