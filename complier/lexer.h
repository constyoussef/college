#pragma once
#include <string>
#include <vector>
#include <stdexcept>
#include <cctype>

enum class TokenType {
    // Literals & identifiers
    INT_LIT, FLOAT_LIT, BOOL_LIT, ID,
    // Types
    TYPE_INT, TYPE_FLOAT, TYPE_BOOL,
    // Keywords
    PRINT,
    // Operators
    PLUS, MINUS, STAR, SLASH, PERCENT,
    EQ, NEQ, LT, GT, LEQ, GEQ,
    AND, OR, NOT,
    ASSIGN,
    // Delimiters
    LPAREN, RPAREN, LBRACE, RBRACE, SEMICOLON,
    // End
    END_OF_FILE
};

struct Token {
    TokenType type;
    std::string value;
    int line;

    Token(TokenType t, const std::string& v, int l)
        : type(t), value(v), line(l) {}
};

class Lexer {
public:
    explicit Lexer(const std::string& src)
        : src_(src), pos_(0), line_(1) {}

    std::vector<Token> tokenize() {
        std::vector<Token> tokens;
        while (pos_ < src_.size()) {
            skipWhitespaceAndComments();
            if (pos_ >= src_.size()) break;

            char c = src_[pos_];

            if (std::isdigit(c)) {
                tokens.push_back(readNumber());
            } else if (std::isalpha(c) || c == '_') {
                tokens.push_back(readIdentOrKeyword());
            } else {
                tokens.push_back(readSymbol());
            }
        }
        tokens.emplace_back(TokenType::END_OF_FILE, "", line_);
        return tokens;
    }

private:
    std::string src_;
    size_t pos_;
    int line_;

    void skipWhitespaceAndComments() {
        while (pos_ < src_.size()) {
            if (src_[pos_] == '\n') { line_++; pos_++; }
            else if (std::isspace(src_[pos_])) { pos_++; }
            else if (pos_ + 1 < src_.size() && src_[pos_] == '/' && src_[pos_+1] == '/') {
                while (pos_ < src_.size() && src_[pos_] != '\n') pos_++;
            } else break;
        }
    }

    Token readNumber() {
        size_t start = pos_;
        bool isFloat = false;
        while (pos_ < src_.size() && std::isdigit(src_[pos_])) pos_++;
        if (pos_ < src_.size() && src_[pos_] == '.' &&
            pos_+1 < src_.size() && std::isdigit(src_[pos_+1])) {
            isFloat = true;
            pos_++; // consume '.'
            while (pos_ < src_.size() && std::isdigit(src_[pos_])) pos_++;
        }
        std::string val = src_.substr(start, pos_ - start);
        return Token(isFloat ? TokenType::FLOAT_LIT : TokenType::INT_LIT, val, line_);
    }

    Token readIdentOrKeyword() {
        size_t start = pos_;
        while (pos_ < src_.size() && (std::isalnum(src_[pos_]) || src_[pos_] == '_')) pos_++;
        std::string word = src_.substr(start, pos_ - start);

        if (word == "int")   return Token(TokenType::TYPE_INT,   word, line_);
        if (word == "float") return Token(TokenType::TYPE_FLOAT, word, line_);
        if (word == "bool")  return Token(TokenType::TYPE_BOOL,  word, line_);
        if (word == "print") return Token(TokenType::PRINT,      word, line_);
        if (word == "true" || word == "false")
                             return Token(TokenType::BOOL_LIT,   word, line_);
        return Token(TokenType::ID, word, line_);
    }

    Token readSymbol() {
        char c = src_[pos_++];
        switch (c) {
            case '+': return Token(TokenType::PLUS,      "+", line_);
            case '-': return Token(TokenType::MINUS,     "-", line_);
            case '*': return Token(TokenType::STAR,      "*", line_);
            case '/': return Token(TokenType::SLASH,     "/", line_);
            case '%': return Token(TokenType::PERCENT,   "%", line_);
            case '(': return Token(TokenType::LPAREN,    "(", line_);
            case ')': return Token(TokenType::RPAREN,    ")", line_);
            case '{': return Token(TokenType::LBRACE,    "{", line_);
            case '}': return Token(TokenType::RBRACE,    "}", line_);
            case ';': return Token(TokenType::SEMICOLON, ";", line_);
            case '!':
                if (pos_ < src_.size() && src_[pos_] == '=') { pos_++; return Token(TokenType::NEQ, "!=", line_); }
                return Token(TokenType::NOT, "!", line_);
            case '=':
                if (pos_ < src_.size() && src_[pos_] == '=') { pos_++; return Token(TokenType::EQ,  "==", line_); }
                return Token(TokenType::ASSIGN, "=", line_);
            case '<':
                if (pos_ < src_.size() && src_[pos_] == '=') { pos_++; return Token(TokenType::LEQ, "<=", line_); }
                return Token(TokenType::LT, "<", line_);
            case '>':
                if (pos_ < src_.size() && src_[pos_] == '=') { pos_++; return Token(TokenType::GEQ, ">=", line_); }
                return Token(TokenType::GT, ">", line_);
            case '&':
                if (pos_ < src_.size() && src_[pos_] == '&') { pos_++; return Token(TokenType::AND, "&&", line_); }
                break;
            case '|':
                if (pos_ < src_.size() && src_[pos_] == '|') { pos_++; return Token(TokenType::OR, "||", line_); }
                break;
        }
        throw std::runtime_error("Unknown character '" + std::string(1,c) +
                                 "' at line " + std::to_string(line_));
    }
};
