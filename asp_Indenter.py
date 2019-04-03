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

import re, sys


class Indenter:
    def __init__(self):
        self.before_indent = False
        self.space = 0
        self.str_count = 0
        self.total_string = ''
        self.small_string = ''

    def print_ln(self, string):
        self.small_string = self.total_string[self.str_count]
        if self.before_indent:
            self.str_count -= 1
            sys.stdout.write(" " * self.space + str(self.small_string))
            self.str_count += 2
        else:
            self.str_count += 1
            sys.stdout.write(" " * self.space + str(self.small_string))
        sys.stdout.flush()

    def main(self, string):
        self.total_string = string
        while self.str_count < len(self.total_string):
            self.print_ln(self.small_string)
            if re.search("^\s*if.*then", str(self.small_string), re.IGNORECASE):
                self.space += 4
            if re.search("^\s*for", str(self.small_string), re.IGNORECASE):
                self.space += 4
            if re.search("^\s*elseif.*then", str(self.small_string), re.IGNORECASE):
                self.before_indent
                self.space -= 4
            if re.search("^\s*end if", str(self.small_string), re.IGNORECASE):
                self.before_indent
                self.space -= 4
            if re.search("^\s*next", str(self.small_string), re.IGNORECASE):
                self.before_indent
                self.space -= 4


with open("scratch.html") as s:
    ind = Indenter()
    ind.main(s.readlines())
