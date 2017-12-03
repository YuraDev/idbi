import methods from './methods'
let db = null,
  transaction = null,
  indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
  idbTransaction = (db) => function () {
    let transaction = db.transaction.apply(db, arguments),
      promise = new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(transaction)
        transaction.onerror = () => reject(transaction.error)
        transaction.onabort = () => reject(transaction.error)
      })

    transaction.prototype = {
      promise: promise,
      then: () => promise.then.apply(promise, arguments),
      catch: () => promise.catch.apply(promise, arguments)
    }
    return transaction
  },
  promisify = request => new Promise((resolve, reject) => {
    request.onsuccess = (event) => resolve(request.result || true)
    request.onerror = (event) => reject(request.error)
  }),
  connect = ({ name, stores, version }) => new Promise(function (resolve, reject) {
    if (db) return resolve({ db, transaction })
    if (!name) return reject(new Error('Please enter your Database Name'))
    let request = indexedDB.open(name, version || 1.0)

    request.onerror = err => reject(err)
    request.onupgradeneeded = ({ target }) => {
      let db = target.result

      if (!stores) return reject(new Error('Not found params stores!'))
      for (let store in stores) {
        let os = db.objectStoreNames.contains(store) ?
          db.objectStoreNames(store) : db.createObjectStore(store, stores[store].options)

        for (let index in stores[store].indexsList) {
          let {keyPath, options} = stores[store].indexsList[index]

          os.createIndex(index, keyPath, options)
        }
        if (stores[store].dataFactory.length) stores[store].dataFactory.forEach(data => os.add(data))
        if (typeof stores[store].dataFactory === 'function') {
          stores[store].dataFactory({ db, store: os, transaction: idbTransaction(db) })
        }
      }
      return true
    }
    request.onsuccess = e => {
      db = e.target.result
      transaction = idbTransaction(db)
      resolve({ db, transaction })
    }
    return true
  }),
  idbMethods = (proxy, options) => {
    let methods = {}

    if (!options) throw new Error('Not found params options!')
    for (let key in proxy) {
      let {mode, method} = typeof proxy[key] === 'function' ? ({
        mode: 'readwrite',
        method: proxy[key]
      }) : ({
        mode: (proxy[key] && proxy[key].mode) ? proxy[key].mode : proxy[key],
        method: (proxy[key] && proxy[key].method) ? proxy[key].method : key
      })

      methods[key] = async function () {
        if (!this.name) return new Error('Not found store')
        try {
          let { db, transaction } = await connect(options)
          let addreq = mode ? transaction([this.name], mode) : transaction([this.name])
          let store = addreq.objectStore(this.name)

          if (typeof method === 'function') {
            return method.apply(IDBObjectStore, [{db, transaction: addreq, store}, ...arguments])
          }
          return typeof store[method] === 'function' ? promisify(store[method].apply(store, arguments)) : store[method]
        } catch (err) {
          return new Error(err)
        }
      }
    }
    return (params) => Object.assign({}, methods, params)
  }

export default {
  open(options) {
    let stores = {},
      result = {}

    if (!options.stores) options.stores = { store: { autoIncrement: true } }
    for (let storeName in options.stores) {
      let store = options.stores[storeName],
        indexs = (store.indexList && Array.isArray(store.indexList) ?
          store.indexList.reduce((res, value) => ({ [value]: {}, ...res }), {}) : store.indexList) || store

      stores[storeName] = {
        options: {
          keyPath: store.keyPath || 'id',
          autoIncrement: store.autoIncrement || true
        },
        dataFactory: store.dataFactory || [],
        indexList: {}
      }
      for (let index in indexs) {
        if (['autoIncrement', 'keyPath', 'dataFactory', 'indexList'].indexOf(index) !== -1) continue
        stores[storeName].indexList[index] = {
          keyPath: Array.isArray(indexs[index]) || typeof indexs[index] === 'string' ?
            indexs[index] : (indexs[index].keyPath || index),
          options: {
            ...(indexs[index].unique ? { unique: indexs[index].unique } : null),
            ...(indexs[index].locale ? { unique: indexs[index].locale } : null),
            ...(indexs[index].multiEntry ? { unique: indexs[index].multiEntry } : null)
          }
        }
      }
    }

    let Methods = idbMethods(methods, { ...options, stores })

    for (let store in stores) {
      result[store] = new Methods({
        name: store,
        keyPath: stores[store].options.keyPath,
        autoIncrement: stores[store].options.autoIncrement
      })
    }
    result.bok.add({
      test: 'test'
    }).then(data => console.log(data))

    return result
  },
  deleteDatabase: (name, options) => promisify(indexedDB.deleteDatabase(name, options))
}
