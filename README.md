# modal-dialog.js

JavaScript library like window.showModalDialog()

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
