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
    def __init__(self, string):
        self.space = 0
        self.count = 0
        self.string = string

    def print_ln(self, string):
        sys.stdout.write(" " * self.space + str(string))
        sys.stdout.flush()

    def after_string(self):
        self.print_ln(self.string[self.count])
        self.space += 4

    def before_string(self):
        self.space -= 4
        self.print_ln(self.string[self.count])

    def mid_string(self):
        self.space -= 4
        self.print_ln(self.string[self.count])
        self.count += 1
        self.space += 4
        self.print_ln(self.string[self.count])



    def main(self):
        while self.count < len(self.string):
            if re.search("^\s*if.*then", str(self.string[self.count]), re.IGNORECASE):
                self.after_string()
            elif re.search("^\s*for", str(self.string[self.count]), re.IGNORECASE):
                self.after_string()
            elif re.search("^\s*with", str(self.string[self.count]), re.IGNORECASE):
                self.after_string()
            elif re.search("^\s*do until", str(self.string[self.count]), re.IGNORECASE):
                self.after_string()


            elif re.search("^\s*loop", str(self.string[self.count]), re.IGNORECASE):
                self.before_string()
            elif re.search("^\s*end with", str(self.string[self.count]), re.IGNORECASE):
                self.before_string()
            elif re.search("^\s*end if", str(self.string[self.count]), re.IGNORECASE):
                self.before_string()
            elif re.search("^\s*next", str(self.string[self.count]), re.IGNORECASE):
                self.before_string()

            elif re.search("^\s*elseif.*then", str(self.string[self.count]), re.IGNORECASE):
                self.mid_string()
            elif re.search("^\s*else", str(self.string[self.count]), re.IGNORECASE):
                self.mid_string()

            else:
                self.print_ln(self.string[self.count])
            self.count += 1


with open("scratch.html") as s:
    ind = Indenter(s.readlines())
    ind.main()
