  var immo = require('../src/immo');

// getRelevantRegions
test('non-existant region returns empty list', () => {
  expect(immo.getRelevantRegions(
      'london', 
      {
        'nottingham': {subregions: [], isInvestable: true},
        'manchester': {subregions: [], isInvestable: false}
      }
    )
  )
  .toEqual([]);
});

test('london returns london and its subregions', () => {
  expect(immo.getRelevantRegions(
      'london', 
      {
        'cardiff': {subregions: ['lisvane'], isInvestable: true},
        'lisvane': {subregions: [], isInvestable: true},
        'london': {subregions: ['camden', 'islington'], isInvestable: true},
        'islington': {subregions: [], isInvestable: true},
        'camden': {subregions: ['camden town'], isInvestable: true},
        'camden town': {subregions: [], isInvestable: true}
      }
    )
  )
  .toEqual(['london', 'camden', 'islington', 'camden town']);
});

test("cyclical dependency won't get in an infinite loop", () => {
  expect(
    immo.getRelevantRegions(
      'london',
      {
        'uk': {subregions: ['london', 'cardiff'], isInvestable: false},
        'cardiff': {subregions: [], isInvestable: false},
        'london': {subregions: ['camden'], isInvestable: true},
        'camden': {subregions: ['camden town'], isInvestable: true},
        'camden town': {subregions: ['london'], isInvestable: true}
      }
    )
  )
  .toEqual(['london', 'camden', 'camden town']);
});

test('separate trees get properly indexed', () => {
  expect(immo.getIndexedRegions([
      {name: 'cardiff', parent: ''},
      {name: 'lisvane', parent: 'cardiff'},
      {name: 'london', parent: ''},
      {name: 'camden', parent: 'london'},
      {name: 'islington', parent: 'london'},
      {name: 'camden town', parent: 'camden'}
    ])
  )
  .toEqual({
    'cardiff': {subregions: ['lisvane'], isInvestable: false},
    'lisvane': {subregions: [], isInvestable: false},
    'islington': {subregions: [], isInvestable: false},
    'london': {subregions: ['camden', 'islington'], isInvestable: false},
    'camden': {subregions: ['camden town'], isInvestable: false},
    'camden town': {subregions: [], isInvestable: false}
  });
});