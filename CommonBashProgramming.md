# If statement with no case
```
if [[ $answer = [yY] ]]; then
    cp /etc/sudoers.bak /etc/sudoers
elif [[ $answer = [nN] ]]; then
    echo 'Not commiting changes. Now exiting'
    sleep 5
fi
```
## Can also do something like this

```
if [[ $1 = "FLAG" || $1 = "flag" ]] # matches the given 2 combination
```

## Linux Bash Not Equal “-ne” , “!=” Operators Tutorial

```
if [ "$name" != "ismail" ]; then
    echo "Both Strings are NOT Equal."
else
    echo "Both Strings are Equal."
fi
```
## Check If Specified Number Is Not Equal

```
age=18
 
if [[ $age -ne 18 ]]; then
    echo "Both Numbers are NOT Equal."
else
    echo "Both Numbers are Equal."
fi
```
