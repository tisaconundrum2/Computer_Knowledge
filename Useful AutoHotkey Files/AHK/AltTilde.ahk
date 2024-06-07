!`::  ; Next App Window
    SwitchAppWindow("next")
return

!+`::  ; Previous App Window
    SwitchAppWindow("prev")
return

SwitchAppWindow(direction) {
    WinGet, currentwindow, ID, A
    WinGet, activeprocess, ProcessName, ahk_id %currentwindow%
    WinGet, winids, List, ahk_exe %activeprocess%
    
    arr := []
    Loop, %winids% {
        id := winids%A_Index%
        arr.Push(id)
    }
    SortArray(arr)
    
    activeIndex := 0
    Loop, % arr.MaxIndex() {
        if (arr[A_Index] = currentwindow) {
            activeIndex := A_Index
            break
        }
    }
    
    if (direction = "next") {
        nextIndex := Mod(activeIndex, arr.MaxIndex()) + 1
    } else {  ; direction = "prev"
        nextIndex := (activeIndex - 2 + arr.MaxIndex()) Mod arr.MaxIndex() + 1
    }
    
    elem := arr[nextIndex]
    WinSet, AlwaysOnTop, On, ahk_id %elem%
    WinSet, AlwaysOnTop, Off, ahk_id %elem%
    WinActivate, ahk_id %elem%
}

SortArray(ByRef Array, Order="A") {
    ; Order A: Ascending, D: Descending, R: Reverse
    MaxIndex := Array.MaxIndex()
    if (Order = "R") {
        Array := Array.Reverse()
        return
    }
    
    Loop, % MaxIndex - 1 {
        Loop, % MaxIndex - A_Index {
            if ((Order = "A" && Array[A_Index] > Array[A_Index+1]) || (Order = "D" && Array[A_Index] < Array[A_Index+1])) {
                temp := Array[A_Index]
                Array[A_Index] := Array[A_Index+1]
                Array[A_Index+1] := temp
            }
        }
    }
}
