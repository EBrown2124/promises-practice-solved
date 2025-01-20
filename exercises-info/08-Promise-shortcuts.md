# PROMISE SHORTCUTS

Promise shortcuts are used more often rather than the full-syntax expressions. The shortcuts are:

- Promise.resolve()
- Promise.reject()

In the previous md files you have learned how to call the resolve/reject method in the executor function:

```JS
let resolvedPromise = new Promise((res, rej) => {
  res('resolved')
})

let rejectedPromise = new Promise((res, rej) => {
  rej('rejected')
})
```

Using the shortcut syntax you can write the same promises with much less code:

```JS
let resolvedPromise = Promise.resolve('resolved');

let rejectedPromise = Promise.reject('rejected');
```
