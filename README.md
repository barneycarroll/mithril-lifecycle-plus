# mithril-lifecycle-plus

Write Mithril components with new convenient lifecycle hooks:

### API

The API is a function which consumes a vnode with extra lifecycle hooks and returns a transformed vnode that works with Mithril's API.

There are 2 key

| Hook | Description |
| :--- | :--- |
| `preview` | Executes before every view. The equivalent of executing the same function immediately inside a view before the view body, or executing the code at the end of both `oninit` and `onbeforeupdate` |
| `postview` | Executes after every view. The equivalent of Mithril v0.X's `config`, or executing the code at the end of both `oncreate` and `onupdate` |
| `afterall` | Executes in the next frame, thus allowing `m.redraw` triggers |
| `views` | An array of views, which will be executed in sequence on each draw: by default the last view will persist once the end is reached |
| `loops` | A boolean indicating whether the sequence of frames should loop after completion or stick with the last frame, defaulting to `false`; or, if there is only a `view`, an integer - in wich case each view execution will increment a counter, looping once it exceeds `loops` |

The API export also exposes a `view` method which consumes a `state` object and returns the index of the last of the `views` to have executed, or the current `loops` index: `plus.view( node.state )`.

`preview` & `postview` are simple convenience methods for isolating DRY logic to perform outside of the view on every draw loop. The remaining API surface is more specialised and facilitates building animation logic into a component's intrinsic structure.

```javascript
var plus = require( 'mithril-lifecycle-plus' )

var Component = plus( {
  // `preview` executes before every view:
  // after `oninit` & after `onbeforeupdate`.
  // useful for eg transforming a component's convenient surface API (`attrs`)
  // into a model that works for the view
  preview : ( { state, attrs } ) =>
    Object.assign( state, transform( attrs ) ),

  // `postview` executes after every view:
  // after `oncreate` & after `onupdate`
  // useful for DOM reading & transformations that can't be expressed in virtual DOM
  postview : node =>
    node.state.edge( node.dom.getClientRects()[ 0 ].right ),

  view : node =>
    m( 'text',
      node.state.text
        .split( /\b/ )
        .map( string =>
            /^\s*$/.test( string )
          ? string
          : m( 'tspan',
              plus( {
                postview :
              } ),

              string
            )
        )
    )
} )
```
