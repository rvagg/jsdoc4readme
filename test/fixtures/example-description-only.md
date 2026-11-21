### Contents

 * [`class Store`](#Store)
 * [`async Store#get(key[, options])`](#Store_get)
 * [`* Store#keys()`](#Store_keys)
 * [`Store.from(read, tags[, limit])`](#Store__from)
 * [`Store#count()`](#Store_count)

<a name="Store"></a>
### `class Store`

Properties:

* `size` `(number)`: Number of widgets held.

A thing that stores widgets.

See [`Store#get`](#Store_get) for retrieval.

<a name="Store_get"></a>
### `async Store#get(key[, options])`

* `key` `(string)`: The key.
* `options` `({ timeout?: number }, optional)`: Fetch options.

* Returns: `Promise<Widget | null>`: The widget, if found.

Fetch a widget by key.

<a name="Store_keys"></a>
### `* Store#keys()`

* Returns: `Iterable<string>`

Iterate over all keys.

<a name="Store__from"></a>
### `Store.from(read, tags[, limit])`

* `read` `(() => Promise<Uint8Array>)`: Supplies bytes.
* `tags` `(string[])`: Tags to apply.
* `limit` `(number, optional, default=10)`: Maximum widgets.

* Returns: `Store & Iterable<string>`

Create a store from a reader function, see also
[`count()`](#Store_count).

<a name="Store_count"></a>
### `Store#count()`

* Returns: The number of widgets.

Count the widgets.

