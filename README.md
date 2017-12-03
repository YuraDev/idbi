# idbi - IndexedDB ideal
> IndexedDB Promised

## Installation

```bash
npm install idbi --save
// or
yarn add idbi
```
## Open
```js
let {Books, User} = idbi.open({
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