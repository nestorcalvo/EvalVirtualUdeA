window.nodeRequire = require
delete window.require
delete window.exports
delete window.module
document.addEventListener('DOMNodeInserted', function (event) {
  if (!!window && !(window.$)) {
    window.$ = window.jQuery = require('jquery')
  }
})
