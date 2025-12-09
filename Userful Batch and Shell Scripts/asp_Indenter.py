"""
IF BOOL THEN
    CODE
    CODE
END IF

IF BOOL THEN
    CODE
    CODE
ELSEIF BOOL THEN
    CODE
    CODE
END IF

IF BOOL THEN
    CODE
    IF BOOL THEN
        CODE
    END IF
    CODE

    IF BOOL THEN
        CODE
    ELSEIF BOOL THEN
        CODE
    END IF
    CODE
END IF


"""

import re
import sys


class Indenter:
    def __init__(self, lines):
        self.indent_level = 0
        self.line_index = 0
        self.lines = lines

    def write_line(self, line):
        indentation = "    " * self.indent_level
        sys.stdout.write(indentation + line)
        sys.stdout.flush()

    def increase_indent(self):
        self.write_line(self.lines[self.line_index])
        self.indent_level += 1

    def decrease_indent(self):
        self.indent_level -= 1
        self.write_line(self.lines[self.line_index])

    def decrease_then_increase_indent(self):
        self.indent_level -= 1
        self.write_line(self.lines[self.line_index])
        self.indent_level += 1

    def process(self):
        indent_keywords = [
            r"^\s*if\s+.*\s+then",
            r"^\s*for\b",
            r"^\s*with\b",
            r"^\s*do\s+until",
            r"^\s*select\s+case",
        ]

        dedent_keywords = [
            r"^\s*end\s+select",
            r"^\s*loop\b",
            r"^\s*end\s+with",
            r"^\s*end\s+if",
            r"^\s*next\b",
        ]

        dedent_indent_keywords = [
            r"^\s*case\b",
            r"^\s*else\b",
            r"^\s*elseif\s+.*\s+then",
        ]

        while self.line_index < len(self.lines):
            line = self.lines[self.line_index]

            if any(
              re.search(pattern, line, re.IGNORECASE)
              for pattern in indent_keywords
            ):
                self.increase_indent()
            elif any(
              re.search(pattern, line, re.IGNORECASE)
              for pattern in dedent_keywords
            ):
                self.decrease_indent()
            elif any(
              re.search(pattern, line, re.IGNORECASE)
              for pattern in dedent_indent_keywords
            ):
                self.decrease_then_increase_indent()
            else:
                self.write_line(line)

            self.line_index += 1


if __name__ == "__main__":
    with open("scratch.html") as file:
        indenter = Indenter(file.readlines())
        indenter.process()