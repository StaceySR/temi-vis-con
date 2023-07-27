//隐藏链接点
const changePortsVisible = (node, visible) => {
  const ports = document.querySelectorAll(`g[data-cell-id="${node.id}"] .x6-port-body`);
  ports.forEach((port) => {
    // console.log("visible: ", visible);
    port.style.color = '#545454'
    port.style.visibility = visible ? 'visible' : 'hidden';
  });
};

// 节点元素 内容详情
function showTips(graph, tooltips, x, y) {
  let width = 15 * tooltips.length
  if (tooltips.length <= 4) {
    width = 25 * tooltips.length    
  }else{
    if (tooltips.length <= 6) {
      width = 16 * tooltips.length
    }else {
      width = 15 * tooltips.length
    }
  }
  console.log("tooltips-width: ", tooltips.length, width)
  graph.addNode({
    x,
    y,
    // width: 350,
    width: width,
    height: 40,
    shape: 'html',
    html() {
      const wrap = document.createElement('div')
      wrap.style.border = '1px solid #e2e2e2'
      wrap.style.borderRadius = '4px'
      wrap.style.fontSize = '12px'
      wrap.style.color = '#545454'
      // wrap.style.width = '250px'
      wrap.style.wordBreak = 'break-all'
      wrap.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
      wrap.style.boxShadow = 'rgb(174, 174, 174) 0px 0px 10px'
      wrap.style.padding = '10px'

      wrap.innerText = tooltips
      return wrap
    }
  })
}

export default (graph) => {
  graph.on('node:mouseenter', ({ node }) => {
    const data = node.getData()
    if (data && data.disableMove) {
      changePortsVisible(node, false);
    } else changePortsVisible(node, true);

    // const { x, y } = graph.localToGraph(node.store.data.position.x, node.store.data.position.y)
    const { x, y } = node.store.data.position
    if (node.data && !node.data.initialization) {
      // 此处做变通, 添加html模板定制化
      showTips(graph, node.data.tooltip, x + 100, y - 50)
    }
  });

  graph.on('node:mouseleave', ({ node }) => {
    changePortsVisible(node, false);
    // 清理tooltips
    graph.getNodes()?.forEach(node => {
      if (node.shape === 'html') graph.removeNode(node)
    })
  });

  
}
