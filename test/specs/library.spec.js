import idbi from '@lib/idb'
// import chai from 'chai'
// import sinon  from 'sinon'
// sdf
describe('idbi', function () {
  it('open', function () {
    // expect(idb.open()).toBe(1) test
    expect(idbi.open({
      name: 'muse',
      stores: {
        Books: {
          author: {},
          dataFactory: [
            { author: 1, title: 'First book' }
          ]
        },
        User: {
          email: {}
        }
      }
    }), 1)
  })
})
