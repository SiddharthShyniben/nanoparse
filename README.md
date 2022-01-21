# nanoparse

A tiny **(`1kb`!)** argument parser. No fluff!
```js
import nanoparse from 'nanoparse'

const argv = nanoparse(process.argv.slice(2));
console.log(argv)
```

```sh
$ node test.js -a beep -b boop
{ flags: { a: 'beep', b: 'boop' }, _: [], extras: [] }
```
```sh
$ node test.js -h 3 -w 4 -abc --beep=boop foo bar baz -xyz=2 --no-that --why because -- --no more -parse
{
  flags: {
    h: 3,
    w: 4,
    a: true,
    b: true,
    c: true,
    beep: 'boop',
    z: 2,
    x: true,
    y: true,
    that: false,
    why: 'because'
  },
  _: [ 'foo', 'bar', 'baz' ],
  extras: [ '--no', 'more', '-parse' ]
}
```

Too low-level? There's a framework coming up!

## Install

```sh
$ npm install nanoparse
```

**Note:** This package is pure ESM

## License

MIT
