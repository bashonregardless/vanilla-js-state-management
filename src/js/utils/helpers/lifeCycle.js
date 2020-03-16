'use strict';

var LifeCycle = function(RootEl) {
  const lifecycle = {
	componentDidMount: 'componentDidMount',
	componentWillUnmount: 'componentWillUnmount',
  }

  var order = ['init', 'render', 'componentDidMount', 'componentWillUnmount'];

  // Instantiate components
  //const cell = RootEl();

  // initialize the component
  //cell.init();
  
  cell.render();

  //var renderReturnHTML = cell.render();

  parse(renderReturnHTML);
}

export default LifeCycle;
