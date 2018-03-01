 /* ************************************************************************
  * DO NOT MODIFY CODE CONTAINED WITHIN THIS SECTION                       *
  * ************************************************************************ */

 /* ************************************************************************
  * Takes as input a callback which is invoked once the results are        *
  * available. Responses can take anywhere up to 1.5s to return. Returns   *
  * an array of region objects that contain a parent region ("" when at    *
  * the top level), creating a hierarchical tree of data. This example     *
  * uses a tree 4 levels deep, but your result will be tested against a    *
  * datafile that contains an unknown number of layers.                    *
  * ************************************************************************ */
function getAllRegions(callback) {
  let regions = {
    regions: [
      {name: "blackrod", parent: "bolton"},
      {name: "bolton", parent: "manchester"},
      {name: "bury", parent: "manchester"},
      {name: "camden", parent: "central london"},
      {name: "camden town", parent: "camden"},
      {name: "central london", parent: "london"},
      {name: "covent garden", parent: "westminster"},
      {name: "croydon", parent: "south-west london"},
      {name: "east london", parent: "london"},
      {name: "farnworth", parent: "bolton"},
      {name: "hatton garden", parent: "camden"},
      {name: "heywood", parent: "rochdale"},
      {name: "holborn", parent: "camden"},
      {name: "kensington and chelsea", parent: "london"},
      {name: "kew", parent: "richmond upon thames"},
      {name: "kingston upon thames", parent: "south-west london"},
      {name: "london", parent: ""},
      {name: "manchester", parent: ""},
      {name: "middleton", parent: "rochdale"},
      {name: "north london", parent: "london"},
      {name: "oldham", parent: "manchester"},
      {name: "richmond upon thames", parent: "south-west london"},
      {name: "rochdale", parent: "manchester"},
      {name: "south london", parent: "london"},
      {name: "south-west london", parent: "london"},
      {name: "twickenham", parent: "richmond upon thames"},
      {name: "west london", parent: "london"},
      {name: "westminster", parent: "central london"},
      {name: "wimbledon", parent: "south-west london"},
    ]
  }

  setTimeout(callback, Math.random() * 1500, regions);
}

 /* ************************************************************************
  * Takes as input a comma separated list of permissible regions, and a    *
  * callback to be executed once the results have returned. Will return    *
  * all properties that match any of the regions provided (but will not    *
  * make any assumptions about sub-regions: e.g. "london" will not return  *
  * a match for "twickenham" even though Twickenham is within the London   *
  * region. Timing varies with the number of provided regions.             *
  * ************************************************************************ */
function getPropertiesByRegion(regions, callback) {
  let properties = {
    properties: [
      {address: "Whitton Rd, Twickenham TW2 7BA", region: "twickenham"},
      {address: "Royal Botanic Gardens, Kew, Richmond, Surrey, TW9 3AE", region: "kew"},
      {address: "Plough Ln, London SW17 0BL", region: "wimbledon"},
      {address: "Stables Market, Chalk Farm Road, London NW1", region: "camden town"},
      {address: "Westminster, London SW1A 0AA", region: "westminster"},
      {address: "The Esplanade, Rochdale OL16 1AQ", region: "rochdale"},
      {address: "The Old Town Hall, Parliament Square, Greaves Street, Oldham, OL1 1QN", region: "oldham"},
      {address: "Castle House, Castle Rd, Bury BL9 8QT", region: "bury"}
    ]

  }


  let properties_to_return = {
    properties: []
  };


  let array_of_regions = regions.split(",");
  let number_of_regions_requested = (array_of_regions.length || 1);

  for( element in array_of_regions ) {
    let desired_region = array_of_regions[element].trim();
    let matching_properties = properties.properties.filter(record => record.region === desired_region);
    for( property in matching_properties ) {
      properties_to_return.properties.push( matching_properties[property] );
    }
  }

  setTimeout(callback, Math.random() * 1000 * number_of_regions_requested, properties_to_return)
}

 /* ************************************************************************
  * Takes as input a callback to be executed once the results have         *
  * returned. Will return all subregions in which investable properties    *
  * are contained.  You should not assume that these are all leaf-elements *
  * within the hierarchy of the region tree.                               *
  * ************************************************************************ */
function getInvestableRegions(callback) {
  let investable_regions = {
    regions: [ "camden", "kew", "rochdale" ],
  }

  setTimeout(callback, Math.random() * 3000, investable_regions)
}

function displayResultsCallback(data) {
  console.log(data);
};




 /* ************************************************************************
  * PLEASE IMPLEMENT YOUR RESPONSE BELOW:                                  *
  * ********************************************************************** */


 /* ************************************************************************
  * Please write the most performant code you can, without modifying any   *
  * of the methods above, that will display an array of properties         *
  * contained in the specified region or any sub-region (or sub-sub-region *
  * down to an unknown nth level) that is within the "investable" regions  *
  * (e.g. calling your method with "manchester" should not return results  *
  * for "burly"). Your method should take as input a region (e.g. "london" *
  * or "wimbledon") and a callback that expects an array of data to be     *
  * passed in. You can use the display_results_callback(data) helper as a  *
  * sample callback.                                                       * 
  * ********************************************************************** */

function getInvestableProperties(top_level_region, callback) {
  return getInvestablePropertiesAsync(top_level_region)
    .then(result => displayResultsCallback(result.properties))
    .catch(error => console.log(error));
}

async function getInvestablePropertiesAsync(topLevelRegion) {
  // Get all regions then immediately index them by their names,
  // for easy lookup in the future. Chaining the indexing saves time
  // because we don't have to wait for the investable regions promise
  // to resolve before creating the index
  let allRegionsPromise = new Promise(resolve => getAllRegions(resolve))
                              .then(allRegions => getIndexedRegions(allRegions.regions));

  // get investable regions
  let investableRegionsPromise = new Promise(resolve => getInvestableRegions(resolve));

  // wait for both promises to resolve
  let indexedRegions = await allRegionsPromise;
  let investableRegions = await investableRegionsPromise;

  // flag the regions in the region index as investable according to the list 
  let flaggedRegions = flagInvestableRegions(investableRegions.regions, indexedRegions);

  // now that we have the index of regions we care about, get the relevant regions
  // and subregions from the flaggedRegions list
  let relevantRegions = getRelevantRegions(topLevelRegion, flaggedRegions);

  // with the list of regions we care about, we can make a request to getPropertiesByRegion
  // with the minimal sets of region, which takes longer if there are more regions
  let propertiesPromise = new Promise(resolve => getPropertiesByRegion(relevantRegions.join(), resolve));

  // return the resolved list of properties
  return await propertiesPromise;
}

/**
 * Create an index of the regions from a list of regions with their respective parents
 * 
 * @param {Array.<Object>} regions - a list of regions, e.g. 
 *                                   regions = [{name: "camden town", parent: "camden"}, ...]
 * @return {Object} - a hashmap where the key is the name of a region and the value are
 *                            their respective children and wether or not that region is investible, e.g.
 *                            {"camden": {subregions:["camden town"], isInvestable: false}, ...}
 */
function getIndexedRegions(regions) {
  let indexedRegions = {};

  for (let region of regions) {
    // Add the region itself to the index if it's not there already.
    // This has to be done, otherwise the leaf elements wouldn't be in the index
    if (!(region.name in indexedRegions)) {
      indexedRegions[region.name] = {subregions: [], isInvestable: false};
    }

    // Don't index the "" (empty string) root element 
    if (region.parent) {
      // If the region parent hasn't been indexed yet, initalize its index
      if(!(region.parent in indexedRegions)) {
        indexedRegions[region.parent] = {subregions: [], isInvestable: false};
      }

      // Add the region to the list of its parents subregions
      indexedRegions[region.parent].subregions.push(region.name);
    }
  }

  return indexedRegions;
}

/**
 * Flag the investable regions and its subregions as such in the index of regions.
 * 
 * @param {Array.<string>} topLevelRegion - list of top-level investable regions
 * @param {Object} - name-indexed list of regions and its subregions
 * @return {Object} - name-indexed list of regions and its subregions flagged as
 *                            investable or not
 */
function flagInvestableRegions(investableRegions, indexedRegions) {
  // Go through the list of investable regions
  for (let investableRegion of investableRegions) {
    let subregion = [];
    let searchspace = [investableRegion];

    // while there are regions, continue iterating
    while (searchspace.length > 0) {
      let currentRegion = searchspace.shift();

      // safety condition so we don't access non-existant items
      // also, we only continue walking the tree if the region hasn't already been
      // flagged as investable. If it has, its subregions either have already been
      // flagged as investable as well, or will be in the near future.
      if (currentRegion in indexedRegions && !indexedRegions[currentRegion].isInvestable) {
          indexedRegions[currentRegion].isInvestable = true;
          searchspace = searchspace.concat(indexedRegions[currentRegion].subregions);
      }
    }
  }

  return indexedRegions;
}

/**
 * Get the list of relevant investable subregions of topLevelRegion by doing a breadth-first
 * search through the tree of regions and returning only the investable regions.
 * 
 * @param {string} topLevelRegion - the top-level region which will be used as starting
 *                                  point when looking for investable regions
 * @param {Object} - name-indexed list of regions and its subregions
 * @return {Array.<string>} - the list of investable regions, which includes the top level
 *                            if it's an investable region
 */
function getRelevantRegions(topLevelRegion, indexedRegions) {
  let subregions = [];
  let searchspace = [topLevelRegion];
  let visited = new Set();

  // while there are regions, continue iterating
  while (searchspace.length > 0) {
    let currentRegion = searchspace.shift();
    // safety condition so we don't access non-existant items
    if (currentRegion in indexedRegions && !visited.has(currentRegion)) {
      // only add the region to list of relevant regions if it's investable
      if (indexedRegions[currentRegion].isInvestable) {
        subregions.push(currentRegion);
      }

      // add the subregions of the current region to the search space
      searchspace = searchspace.concat(indexedRegions[currentRegion].subregions);

      // add region to list of visited nodes so we don't get stuck in
      // cyclical dependencies
      visited.add(currentRegion);
    }
  }

  return subregions;
}


/* helpers to get you started */
//getAllRegions(displayResultsCallback);
//getInvestableRegions(displayResultsCallback);
//getPropertiesByRegion('twickenham', displayResultsCallback);
getInvestableProperties('london', displayResultsCallback);

if (module !== 'undefined' && module.exports !== 'undefined') {
  module.exports = {
    getInvestablePropertiesAsync, 
    getIndexedRegions, 
    flagInvestableRegions, 
    getRelevantRegions
  };
}