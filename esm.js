const frame = new WeakMap()

const multi = ( ...input ) => {
  fns = input.filter( x => typeof x == 'function' )

  return (
      0 == fns.length
    ? undefined
    : 1 == fns.length
    ? fns[ 0 ]
    : function(){
        let output

        fns.forEach( ( fn, i ) =>
            i
          ? fn( ...arguments )
          : output = fn( ...arguments )
        )

        return output
      }
    )
}

export default Object.assign(
  ( { preview, postview, afterall, previews, postviews, afteralls, views, loops, ...node } ) => {
    const { oninit, oncreate, beforeupdate, onupdate, view } = node

    return Object.assign( node, {
      oninit         : multi( oninit,         preview,
        views && () => frame.set( this, -1 )
      ),
      onbeforeupdate : multi( onbeforeupdate, preview  ),
      oncreate       : multi( oncreate,       postview ),
      onupdate       : multi( onupdate,       postview ),
      view           : multi(
          views || typeof loops.valueOf() == 'number'
        ? function(){
          let count = frame.get( this ) + 1

          while( count === ( views ? views.length : loops ) )
            count = loops ? 0 : count - 1

          frame.set( this, count )

          return ( views ? views[ count ] : view )( ...arguments )
        }
        : view,

        afterall && function(){
          requestAnimationFrame( () =>
            afterall( ...arguments )
          )
        }
      )
    } )
  },

  { view : state => frame.get( state ) }
)
