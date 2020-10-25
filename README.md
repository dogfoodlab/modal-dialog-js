# modal-dialog.js

JavaScript library like window.showModalDialog()

samples.

- [sample 1](https://dogfoodlab.github.io/modal-dialog-js/sample1.html)
- [sample 2](https://dogfoodlab.github.io/modal-dialog-js/sample2.html)
- [sample 3](https://dogfoodlab.github.io/modal-dialog-js/sample3.html)

## Setup

```
<script src="modal-dialog.js"></script>
```

## Syntax

```
var returns = await showModalDialog(url[,arguments][,options]);
~~
```

or

```
showModalDialog(url[,arguments][,options])
  .then(function (returns) {
    ~~
  });
```

The parameters are specified in the same as showModalDialog.

- url
- arguments
- options

Adding extensions to window.ModalDialog.

example.

```
ModalDialog.defaults.overlay.backgroundColor = "rgba(0,0,0,0.5)";
```

and, see example files.

## License

MIT
