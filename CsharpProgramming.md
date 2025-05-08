# C# Programming Knowledge


## Building a single file executable


```
  <PropertyGroup>
    ...
    <OutputType>exe</OutputType>
    <PublishSingleFile Condition="'$(Configuration)' == 'Release'">true</PublishSingleFile>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <PlatformTarget>x64</PlatformTarget>
    ...
  </PropertyGroup>
```