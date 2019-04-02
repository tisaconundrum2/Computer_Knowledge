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

class indenter():
    def __init__(self):
        self.

    def print_ln(space, string):
        sys.stdout.write(" " * space + str(string))
        sys.stdout.flush()


    def main(string):
        space = 0
        for s in string:
            print_ln(space, s)
            if re.search("^\s*if.*then", str(s), re.IGNORECASE):
                space += 4
            if re.search("^\s*for", str(s), re.IGNORECASE):
                space += 4
            if re.search("^\s*elseif.*then", str(s), re.IGNORECASE):
                space -= 4
            if re.search("^\s*end if", str(s), re.IGNORECASE):
                space -= 4
            if re.search("^\s*next", str(s), re.IGNORECASE):
                space -= 4


with open("scratch.html") as s:
    main(s.readlines())
