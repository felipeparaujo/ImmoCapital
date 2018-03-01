var immo = require('../src/immo');

test("empty list of investable regions doesn't change index", () => {
  expect(
  	immo.flagInvestableRegions(
	  	[], 
	  	{
	  		'london': {subregions: [], isInvestable: true},
	  		'manchester': {subregions: [], isInvestable: false}
	  	}
  	)
  )
  .toEqual({
		'london': {subregions: [], isInvestable: true},
		'manchester': {subregions: [], isInvestable: false}
	});
});

test("investable region and its subregions are marked as investable", () => {
  expect(
  	immo.flagInvestableRegions(
	  	['london'],
	  	{
	  		'uk': {subregions: ['london', 'cardiff'], isInvestable: false},
	  		'cardiff': {subregions: [], isInvestable: false},
	  		'london': {subregions: ['camden'], isInvestable: false},
	  		'camden': {subregions: ['camden town'], isInvestable: false},
	  		'camden town': {subregions: [], isInvestable: false}
	  	}
  	)
  )
  .toEqual({
		'uk': {subregions: ['london', 'cardiff'], isInvestable: false},
		'cardiff': {subregions: [], isInvestable: false},
		'london': {subregions: ['camden'], isInvestable: true},
		'camden': {subregions: ['camden town'], isInvestable: true},
		'camden town': {subregions: [], isInvestable: true}
	});
});

test("non-existant regions are ignored", () => {
  expect(
  	immo.flagInvestableRegions(
	  	['cardiff', 'bristol'], 
	  	{
	  		'london': {subregions: [], isInvestable: true},
	  		'manchester': {subregions: [], isInvestable: false}
	  	}
  	)
  )
  .toEqual({
 		'london': {subregions: [], isInvestable: true},
 		'manchester': {subregions: [], isInvestable: false}
	});
});

test("cyclical dependency won't get in an infinite loop and the regions will be flagged properly", () => {
  expect(
  	immo.flagInvestableRegions(
	  	['london'],
	  	{
	  		'uk': {subregions: ['london', 'cardiff'], isInvestable: false},
	  		'cardiff': {subregions: [], isInvestable: false},
	  		'london': {subregions: ['camden'], isInvestable: false},
	  		'camden': {subregions: ['camden town'], isInvestable: false},
	  		'camden town': {subregions: ['london'], isInvestable: false}
	  	}
  	)
  )
  .toEqual({
		'uk': {subregions: ['london', 'cardiff'], isInvestable: false},
		'cardiff': {subregions: [], isInvestable: false},
		'london': {subregions: ['camden'], isInvestable: true},
		'camden': {subregions: ['camden town'], isInvestable: true},
		'camden town': {subregions: ['london'], isInvestable: true}
	});
});

test("separate trees will be flagged properly", () => {
  expect(
  	immo.flagInvestableRegions(
	  	['london', 'cardiff'],
	  	{
	  		'cardiff': {subregions: ['lisvane'], isInvestable: false},
	  		'lisvane': {subregions: [], isInvestable: false},
	  		'london': {subregions: ['camden', 'islington'], isInvestable: false},
	  		'islington': {subregions: [], isInvestable: false},
	  		'camden': {subregions: ['camden town'], isInvestable: false},
	  		'camden town': {subregions: ['london'], isInvestable: false}
	  	}
  	)
  )
  .toEqual({
	  		'cardiff': {subregions: ['lisvane'], isInvestable: true},
	  		'lisvane': {subregions: [], isInvestable: true},
	  		'london': {subregions: ['camden', 'islington'], isInvestable: true},
	  		'islington': {subregions: [], isInvestable: true},
	  		'camden': {subregions: ['camden town'], isInvestable: true},
	  		'camden town': {subregions: ['london'], isInvestable: true}
	});
});