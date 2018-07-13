# If statement with no case
```
if [[ $answer = [yY] ]]; then
    cp /etc/sudoers.bak /etc/sudoers
elif [[ $answer = [nN] ]]
    echo 'Not commiting changes. Now exiting'
    sleep 5
fi
```
Can also do something like this

```
if [[ $1 = "FLAG" || $1 = "flag" ]] # matches the given 2 combination
```
