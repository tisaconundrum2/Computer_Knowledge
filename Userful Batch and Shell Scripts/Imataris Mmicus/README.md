# The Terrible Clever Chaos of Imataris Mmicus

**The original approach:**
1. Parse all directories from source
2. Generate a unique random batch file for *each* directory
3. Fire them all off simultaneously with `start /MIN /B`
4. Each batch file does its own `xcopy` in parallel

**Why it "worked":**
- **I/O parallelization** - Multiple `xcopy` processes hitting the disk simultaneously spreads the load across different I/O queues
- **Perceived speed** - Smaller directories finish quickly and clear out, making progress *visible* (psychological win)
- **Large files don't block small ones** - A 5GB file copying doesn't freeze out 100 small files

**The problems:**
- **Disk thrashing** - Random seeks between 20+ simultaneous operations = worse actual throughput
- **System strain** - Each `xcopy` spawns a process; 20+ processes = resource overhead
- **Unreliable** - Race conditions, file locking issues, harder to debug failures
- **Modern drives hate it** - SSDs especially suffer from random parallel I/O patterns
