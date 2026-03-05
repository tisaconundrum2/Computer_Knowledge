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

## EF Core Tip: Start from the "many" side 🔍

Say you're building an app for hobbyists to track their collections. A `Collector` has many `VinylRecords`. You need to fetch all records belonging to a specific collector that are in mint condition.

❌ **Starting from the parent (the "one"):**
```csharp
var records = await _db.Collectors
    .Where(c => c.CollectorId == collectorId)
    .SelectMany(c => c.VinylRecords
        .Where(r => r.Condition == "Mint"))
    .ToListAsync();
```

✅ **Starting from the children (the "many"):**
```csharp
var records = await _db.VinylRecords
    .Include(r => r.Collector)
    .Where(r => r.CollectorId == collectorId && r.Condition == "Mint")
    .ToListAsync();
```

Both generate nearly identical SQL. So why does it matter?

**1. Navigation properties.** The `SelectMany` approach doesn't populate `Collector` on the results. If anything downstream accesses `.Collector.DisplayName` — say, to show "Nick's Collection" in a header — you get a `NullReferenceException`. The `.Include()` approach loads it explicitly.

**2. Readability.** You're querying vinyl records — so start from vinyl records. Going collector → `SelectMany` → back to records is a conceptual round-trip that obscures the intent.

**3. Composability.** Want to add `.OrderBy(r => r.Artist)`, `.Skip()`, `.Take()` for pagination, or `.Include(r => r.Genre)`? That's natural on a direct `IQueryable<VinylRecord>`. Inside a `SelectMany` projection, it gets awkward fast.

**The rule of thumb:** Query from the entity type you want back. Start from the "many" side and `.Include()` the "one" side when you need navigation data.

The exception? When you need parent-level logic — like "find all collectors who own *at least one* first pressing" — then starting from the parent with `.Where(c => c.VinylRecords.Any(r => r.IsFirstPressing))` is the right call.

Small pattern, big difference in maintainability.

#dotnet #efcore #entityframework #csharp #softwareengineering

---
