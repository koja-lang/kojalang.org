require "rouge"

# A Rouge lexer for Koja so fenced ```koja blocks get highlighted.
# Token choices mirror the hand-tagged showcase on the homepage.
class KojaLexer < Rouge::RegexLexer
  title "Koja"
  desc "The Koja programming language (kojalang.org)"
  tag "koja"
  filenames "*.koja", "*.kojs"

  KEYWORDS = %w[
    alias break cond const else end enum fn for if impl in loop match
    priv protocol receive return spawn struct type unless when
  ].freeze

  OPERATOR_WORDS = %w[and or not].freeze

  state :root do
    rule %r/#.*$/, Comment::Single
    rule %r/"""/, Str::Double, :heredoc
    rule %r/"/, Str::Double, :string
    rule %r/@[a-z_]+/, Name::Decorator
    rule %r/\b(?:#{KEYWORDS.join("|")})\b/, Keyword
    rule %r/\b(?:#{OPERATOR_WORDS.join("|")})\b/, Operator::Word
    rule %r/\b(?:true|false)\b/, Keyword::Constant
    rule %r/\bself\b/, Name::Builtin::Pseudo
    rule %r/\b0x[0-9a-fA-F_]+\b/, Num::Hex
    rule %r/\b0b[01_]+\b/, Num::Bin
    rule %r/\b\d[\d_]*\.\d[\d_]*\b/, Num::Float
    rule %r/\b\d[\d_]*\b/, Num::Integer
    rule %r/\b[A-Z][A-Za-z0-9_]*\b/, Name::Class
    rule %r/[a-z_][A-Za-z0-9_]*\??(?=\s*\()/, Name::Function
    rule %r/[a-z_][A-Za-z0-9_]*\??/, Name
    rule %r/->|<>|<=|>=|==|!=|[+\-*\/%]=?|[<>=?]|\|/, Operator
    rule %r/[(){}\[\],.:]/, Punctuation
    rule %r/\s+/, Text::Whitespace
  end

  # Interpolation recurses into :root so expressions inside #{} highlight.
  state :string do
    rule %r/"/, Str::Double, :pop!
    rule %r/\\./, Str::Escape
    rule %r/#\{/, Str::Interpol, :interpolation
    rule %r/[^"\\#]+/, Str::Double
    rule %r/#/, Str::Double
  end

  state :heredoc do
    rule %r/"""/, Str::Double, :pop!
    rule %r/#\{/, Str::Interpol, :interpolation
    rule %r/[^"#]+/, Str::Double
    rule %r/["#]/, Str::Double
  end

  state :interpolation do
    rule %r/\}/, Str::Interpol, :pop!
    mixin :root
  end
end
