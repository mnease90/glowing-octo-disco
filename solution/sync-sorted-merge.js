"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  let initialEntries = logSources.map((ls, index) => {
    let entry = ls.pop();
    return {
      index: index,
      entry: entry
    };
  });

  let sortedEntries = initialEntries.sort((a, b) => a.entry.date - b.entry.date);
  let earliestEntry;

  // Still sources to extract from
  while(sortedEntries.length > 0) {
    earliestEntry = sortedEntries.shift()
    printer.print(earliestEntry.entry)

    let earliestEntryIx = earliestEntry.index;
    let nextEntry = logSources[earliestEntryIx].pop();

    if (nextEntry === false) {
      continue;
    }

    
    let entryToInsert = { index: earliestEntryIx, entry: nextEntry };
    insertIntoSortedEntries(entryToInsert, sortedEntries)
  }

  printer.done();
  return console.log("Sync sort complete.");
};

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
