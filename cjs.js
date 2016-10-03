var draws = { nodes : [], counts : [] }

var multi = function(){
  var fns = [].filter.call( arguments, function(){ return x => typeof x == 'function' } )

  return (
      0 == fns.length
    ? undefined
    : 1 == fns.length
    ? fns[ 0 ]
    : function(){
        var state = this
        var input = [].slice.call( arguments )
        var output

        fns.forEach( function( fn, i ){ return (
            i
          ? fn.apply( state, arguments )
          : output = fn.apply( state, arguments )
        ) }

        return output
      }
    )
}

module.exports = function lifecycle( node ){
  return Object.assign( node, {
    oninit         : multi( node.oninit,         node.preview,
      node.views && function(){
        draws.nodes.push( node )
        draws.counts.push( -1 )
      }
    ),
    onbeforeupdate : multi( node.onbeforeupdate, node.preview  ),
    oncreate       : multi( node.oncreate,       node.postview ),
    onupdate       : multi( node.onupdate,       node.postview ),
    onremove       : multi( node.onremove,
      node.views && function(){
        var index = draws.nodes.getIndexOf( this )

        draws.nodes.splice(  index, 1 )
        draws.counts.splice( index, 1 )
      }
    ),
    view           : multi(
        node.views || typeof loops.valueOf() == 'number'
      ? function(){
        var index = draws.nodes.getIndexOf( this )
        var count = draws.counts[ index ] + 1

        while( count === ( node.views ? node.views.length : node.loops ) )
          count = loops ? 0 : count - 1

        draws.counts[ index ] = count

        return (
            node.views
          ? node.views[ count ]
          : node.view
        ).apply( this, arguments )
      }
      : node.view,

      node.afterall && function(){
        var state = this
        var args  = arguments

        requestAnimationFrame( function(){
          node.afterall.apply( state, arguments )
        } )
      }
    )
  } )
}
