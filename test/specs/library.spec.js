import idb from '@lib/idb'
// import chai from 'chai'
// import sinon  from 'sinon'
// sdf
describe('idbi', function () {
  it('open', function () {
    // expect(idb.open()).toBe(1) test
    expect(idb.open({
      name: 'muse',
      stores: {
        bok: {
          rest: {},
          dataFactory: [
            { rest: 1, test: 'ok' }
          ]
        }
      }
    }), 1)
  })
})
