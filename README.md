#idbi - IndexedDB ideal
> IndexedDB Promised

## Installation

```bash
npm install wcer --save-dev
// or
yarn add wcer --dev
```
## Open
```js
let {Books, User} = idb.open({
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
})
Books.add({ title: 'The second book' })
  .then(id => console.log(id))
```