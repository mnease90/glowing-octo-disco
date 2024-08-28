"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    drainAsyncLogs(logSources, printer, resolve)
  });
};

const drainAsyncLogs = async (logSources, printer, resolve) => {
  let initialEntries = await Promise.all(logSources.map(async (ls, index) => {
    let entry = await ls.popAsync();
    return {
      index: index,
      entry: entry
    };
  }));

  let sortedEntries = initialEntries.sort((a, b) => a.entry.date - b.entry.date);

  let earliestEntry;

  // Still sources to extract from
  while(sortedEntries.length > 0) {
    earliestEntry = sortedEntries.shift()
    printer.print(earliestEntry.entry)

    let earliestEntryIx = earliestEntry.index;
    let nextEntry = await logSources[earliestEntryIx].popAsync();

    if (nextEntry === false) {
      continue;
    }

    
    let entryToInsert = { index: earliestEntryIx, entry: nextEntry };
    insertIntoSortedEntries(entryToInsert, sortedEntries)
  }

  printer.done();
  resolve(console.log("Async sort complete."))
}

let insertIntoSortedEntries = (entryToInsert, sortedEntries) => {
  let ix = 0;

  while (ix < sortedEntries.length) {
    if ( entryToInsert.entry.date <= sortedEntries[ix].entry.date) {
      sortedEntries.splice(ix, 0, entryToInsert)
      break;
    } else {
      ix++;
    }
  }
  if (ix === sortedEntries.length) {
    sortedEntries.push(entryToInsert)
  }
}
