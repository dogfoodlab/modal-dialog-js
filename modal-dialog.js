(function () {
  "use strict";

  if (!window.showModalDialog) {
    var ModalDialog = function () {};

    ModalDialog.prototype.defaults = Object.seal({
      overlay: {
        backgroundColor: "transparent",
        zIndex: "1000",
        scrollLockClass: "scroll-lock"
      },
      dialog: {
        backgroundColor: "#FFF",
        border: "solid 1px #999",
        boxShadow: "0px 0px 10px #999"
      },
      titleBar: {
        backgroundColor: "#FFF",
        height: "30px"
      },
      titleText: {
        color: "#000",
        margin: "0 8px 0 8px",
        padding: "0",
        fontSize: "12px",
        text: "{title} -- Web Page Dialog"
      },
      closeButton: {
        backgroundColor: "transparent",
        color: "#000",
        hoverBackgroundColor: "#F00",
        hoverColor: "#FFF",
        margin: "0",
        padding: "0",
        fontSize: "12px",
        text: "✕"
      },
      dialogOpts: {
        center: "1",
        dialogHeight: "500px",
        dialogLeft: "",
        dialogWidth: "500px",
        dialogTop: "",
        resizable: "0",
        scroll: "1",
        defaultLeft: "50px",
        defaultTop: "50px"
      }
    });

    ModalDialog.prototype.init = function () {
      ModalDialog.defaults = ModalDialog.prototype.defaults;
      return this;
    };

    ModalDialog.prototype.showModalDialog = function (url, args, opts) {
      var defaults = ModalDialog.prototype.defaults;
      var parsedOpts = parseShowDialogOpts(opts);

      return new Promise(function (resolve) {
        var overlay = createOverlayElement();
        var dialog = createDialogElement(url, args, parsedOpts);
        var titleBar = createTitleBarElement(url, args, parsedOpts);
        var iframe = createIframeElement(url, args, parsedOpts);

        dialog.appendChild(titleBar);
        dialog.appendChild(iframe);
        overlay.appendChild(dialog);

        var style = document.createElement("style");
        window.top.document.head.appendChild(style);
        style.sheet.insertRule(`.${defaults.overlay.scrollLockClass} {overflow:hidden;}`, 0);
        window.top.document.body.classList.add(defaults.overlay.scrollLockClass);

        window.top.document.body.appendChild(overlay);
        iframe.contentWindow.dialogArguments = args;

        iframe.onload = function (evt) {
          iframe.contentWindow.dialogArguments = args;

          titleBar.querySelector("span").innerText = defaults.titleText.text.replace(
            /{title}/g,
            iframe.contentDocument.title
          );

          titleBar.querySelector("button").onclick = function (evt) {
            evt.stopPropagation();
            iframe.contentWindow.close();
          };

          iframe.contentWindow.close = function () {
            resolve(iframe.contentWindow.returnValue);
            window.top.document.body.removeChild(overlay);
            window.top.document.body.classList.remove(defaults.overlay.scrollLockClass);
            window.top.document.head.removeChild(style);
          };
        };
      });
    };

    var createOverlayElement = function () {
      var defaults = ModalDialog.prototype.defaults;

      // overlay
      var overlay = document.createElement("div");
      overlay.style.backgroundColor = defaults.overlay.backgroundColor;
      overlay.style.zIndex = defaults.overlay.zIndex;

      overlay.style.margin = "0";
      overlay.style.padding = "0";

      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.right = "0";
      overlay.style.bottom = "0";
      overlay.style.left = "0";

      overlay.style.display = "flex";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";

      //
      return overlay;
    };

    var createDialogElement = function (url, args, opts) {
      var defaults = ModalDialog.prototype.defaults;

      // dialog
      var dialog = document.createElement("div");
      dialog.style.backgroundColor = defaults.dialog.backgroundColor;
      dialog.style.border = defaults.dialog.border;
      dialog.style.boxShadow = defaults.dialog.boxShadow;

      dialog.style.margin = "0";
      dialog.style.padding = "0";
      dialog.style.width = opts.dialogwidth;

      dialog.style.position = "absolute";

      if (opts.center !== "1") {
        dialog.style.left = defaults.dialogOpts.defaultLeft;
        dialog.style.top = defaults.dialogOpts.defaultTop;
      }
      if (opts.dialogleft !== "") {
        dialog.style.left = opts.dialogleft;
      }
      if (opts.dialogtop !== "") {
        dialog.style.top = opts.dialogtop;
      }

      var drag = null;

      dialog.onmousedown = function (evt) {
        evt.stopPropagation();
        drag = { startX: evt.offsetX, startY: evt.offsetY };
        dialog.parentElement.addEventListener("mousemove", onMouseMove);
      };
      dialog.onmouseup = function (evt) {
        evt.stopPropagation();
        drag = null;
        dialog.parentElement.removeEventListener("mousemove", onMouseMove);
      };

      var onMouseMove = function (evt) {
        evt.stopPropagation();

        if (evt.buttons === 0) {
          drag = null;
          dialog.parentElement.removeEventListener("mousemove", onMouseMove);
        }

        var padding = 4;

        if (drag) {
          var scrollLeft = window.top.document.body.scrollLeft || window.top.document.documentElement.scrollLeft;
          var scrollTop = window.top.document.body.scrollTop || window.top.document.documentElement.scrollTop;

          var x = evt.pageX - drag.startX - scrollLeft;
          var y = evt.pageY - drag.startY - scrollTop;

          if (
            x < padding ||
            y < padding ||
            dialog.parentElement.clientWidth <= x + dialog.clientWidth + padding ||
            dialog.parentElement.clientHeight <= y + dialog.clientHeight + padding
          ) {
            return;
          }

          dialog.style.left = x + "px";
          dialog.style.top = y + "px";
        }
      };

      //
      return dialog;
    };

    var createTitleBarElement = function (url, args, opts) {
      var defaults = ModalDialog.prototype.defaults;

      // title bar
      var titleBar = document.createElement("div");
      titleBar.style.backgroundColor = defaults.titleBar.backgroundColor;
      titleBar.style.height = defaults.titleBar.height;

      titleBar.style.margin = "0";
      titleBar.style.padding = "0";

      titleBar.style.userSelect = "none";
      titleBar.style.msUserSelect = "none";
      titleBar.style.cursor = "default";

      titleBar.style.display = "flex";
      titleBar.style.justifyContent = "start";
      titleBar.style.alignItems = "center";

      // close button
      var closeButton = document.createElement("button");
      closeButton.style.backgroundColor = defaults.closeButton.backgroundColor;
      closeButton.style.color = defaults.closeButton.color;
      closeButton.style.margin = defaults.closeButton.margin;
      closeButton.style.padding = defaults.closeButton.padding;
      closeButton.style.fontSize = defaults.closeButton.fonSize;
      closeButton.innerText = defaults.closeButton.text;

      closeButton.style.width = titleBar.style.height;
      closeButton.style.height = titleBar.style.height;
      closeButton.style.lineHeight = titleBar.style.height;
      closeButton.style.marginLeft = "auto";
      closeButton.style.textAlign = "center";

      closeButton.style.border = "none";
      closeButton.style.outline = "none";

      closeButton.onmouseover = function (evt) {
        evt.stopPropagation();
        closeButton.style.backgroundColor = defaults.closeButton.hoverBackgroundColor;
        closeButton.style.color = defaults.closeButton.hoverColor;
      };
      closeButton.onmouseleave = function (evt) {
        evt.stopPropagation();
        closeButton.style.backgroundColor = defaults.closeButton.backgroundColor;
        closeButton.style.color = defaults.closeButton.color;
      };
      closeButton.onmousedown = function (evt) {
        evt.stopPropagation();
      };

      // title text
      var titleText = document.createElement("span");
      titleText.style.color = defaults.titleText.color;
      titleText.style.margin = defaults.titleText.margin;
      titleText.style.padding = defaults.titleText.padding;
      titleText.style.fontSize = defaults.titleText.fontSize;
      titleText.style.width = `calc(${opts.dialogwidth} - ${closeButton.style.width})`;
      titleText.style.whiteSpace = "nowrap";
      titleText.style.textOverflow = "ellipsis";
      titleText.style.overflow = "hidden";

      //
      titleBar.appendChild(titleText);
      titleBar.appendChild(closeButton);

      //
      return titleBar;
    };

    var createIframeElement = function (url, args, opts) {
      // iframe
      var iframe = document.createElement("iframe");
      iframe.style.border = "none";
      iframe.style.margin = "0";
      iframe.style.padding = "0";
      iframe.style.border = "none";
      iframe.height = opts.dialogheight;
      iframe.width = opts.dialogwidth;
      iframe.scrolling = opts.scroll === "1" ? "auto" : "no";
      iframe.src = url;

      //
      return iframe;
    };

    var parseShowDialogOpts = function (opts) {
      var defaults = ModalDialog.prototype.defaults;

      var parsedOpts = Object.seal({
        center: defaults.dialogOpts.center,
        dialogheight: defaults.dialogOpts.dialogHeight,
        dialogleft: defaults.dialogOpts.dialogLeft,
        dialogwidth: defaults.dialogOpts.dialogWidth,
        dialogtop: defaults.dialogOpts.dialogTop,
        resizable: defaults.dialogOpts.resizable,
        scroll: defaults.dialogOpts.scroll
      });

      if (typeof opts !== "string") {
        return Object.freeze(parsedOpts);
      }

      opts
        .split(";")
        .map(function (part) {
          return part.trim();
        })
        .reduce(function (acc, cur) {
          var pair = cur.split(":").map(function (part) {
            return part.trim();
          });
          if (pair.length !== 2) {
            return acc;
          }
          if (parsedOpts.hasOwnProperty(pair[0].toLowerCase())) {
            acc[pair[0].toLowerCase()] = normalizeOptValue(pair[1]);
          }
          return acc;
        }, parsedOpts);

      //
      return Object.freeze(parsedOpts);
    };

    function normalizeOptValue(value) {
      if (["on", "yes", "1"].includes(value)) {
        return "1";
      } else if (["off", "no", "0"].includes(value)) {
        return "0";
      } else {
        return value;
      }
    }

    window.ModalDialog = ModalDialog;
    window.showModalDialog = new ModalDialog().init().showModalDialog;
  }
})();
