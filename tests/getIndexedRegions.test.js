var immo = require('../src/immo');

// getIndexedRegions
test('empty list of regions returns empty index', () => {
  expect(immo.getIndexedRegions([])).toEqual({});
});

test('regions get properly indexed', () => {
  expect(immo.getIndexedRegions([
      {name: 'uk', parent: ''},
      {name: 'cardiff', parent: 'uk'},
      {name: 'london', parent: 'uk'},
      {name: 'camden', parent: 'london'},
      {name: 'camden town', parent: 'camden'}
    ])
  )
  .toEqual({
    'uk': {subregions: ['cardiff', 'london'], isInvestable: false},
    'cardiff': {subregions: [], isInvestable: false},
    'london': {subregions: ['camden'], isInvestable: false},
    'camden': {subregions: ['camden town'], isInvestable: false},
    'camden town': {subregions: [], isInvestable: false}
  });
});

test("top level region doesn't get indexed", () => {
  expect(immo.getIndexedRegions([
      {name: 'cardiff', parent: ''},
      {name: 'london', parent: ''},
      {name: 'manchester', parent: ''}
    ])
  )
  .toEqual({
    'cardiff': {subregions: [], isInvestable: false},
    'london': {subregions: [], isInvestable: false},
    'manchester': {subregions: [], isInvestable: false}
  });
});