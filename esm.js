const draws = new WeakMap()

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

export default ( { preview, postview, frames, loop, ...node } ) => {
  const { oninit, oncreate, beforeupdate, onupdate, view } = node

  return Object.assign( node, {
    oninit         : multi( oninit,         preview,
      frames && () => draws.set( this, -1 )
    ),
    onbeforeupdate : multi( onbeforeupdate, preview  ),
    oncreate       : multi( oncreate,       postview ),
    onupdate       : multi( onupdate,       postview ),
    view           :
        frames
      ? function(){
        let count = draws.get( this ) + 1

        while( count === frames.length )
          count = loop ? 0 : count - 1

        draws.set( this, count )

        return frames[ count ]( ...arguments )
      }
      : view
  } )
}
