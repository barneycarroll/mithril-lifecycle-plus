# mithril-lifecycle-plus

Write Mithril components with new convenient lifecycle hooks:

### API

```javascript
var plus = require( 'mithril-lifecycle-plus' )

var Component = plus( {
  // `preview` executes after `oninit` & after `onbeforeupdate`.
  // useful for eg transforming a component's convenient surface API (`attrs`)
  // into a model that works for the view
  preview : ( { state, attrs } ) =>
    Object.assign( state, transform( attrs ) ),

  // `postview` executes after...
} )


```
