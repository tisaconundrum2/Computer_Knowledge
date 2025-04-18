# All the coding things I've learned.

## Clear your cache damnit!

If you're getting errors saying a version of your project doesn't exist. Have you considered clearing your cache?

```
$ dotnet nuget locals all --clear
```

## Regex to capture content between two strings with newlines between

```
start(.*?\n)+?end
```

Captures something like this.

```
start

more content
and here as well
end
```
