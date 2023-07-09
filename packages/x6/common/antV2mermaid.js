
function convertToMermaidCode(nodes, edges) {
    let mermaidCode = "graph TB\n";
  
    // convert nodes to mermaid code
    nodes.forEach(node => {
    //   console.log("con-node : ", node);
      const id = node.id;
    //   console.log("node.data: ", node.data);
      const actionType = node.data.actionType;

    //   const label = node.attrs.label.text.substring(actionType.length);
      const label = node.attrs.label.text;
      let nodeCode = "";

    //   console.log("id: ", node.id);
    //   console.log("actionType: ", node.data.actionType);
    //   console.log("label: ", node.attrs.label.text);
    //   console.log("label: ", node.attrs.label.text.substring(actionType.length));


      switch (actionType) {
        case "TRIGGER":
          nodeCode = `${id}(["${label}"])`;
          break;
        case "CONDITION":
          nodeCode = `${id}{"${label}"}`;
          break;
        case "FOR":
          nodeCode = `${id}{{"${label}"}}`;
          break;
        default:
          nodeCode = `${id}["${label}"]`;
          break;
      }
    //   console.log("nodeCode: ", nodeCode);
  
      mermaidCode += `${nodeCode}\n`;
    });

    // convert edges to mermaid code
    edges.forEach(edge => {
      const sourceId = edge.source.cell;
      const targetId = edge.target.cell;
      const label = edge.labels.length > 0 ? edge.labels[0].attrs.label.text : "";
      let edgeCode = "";
    //   const edgeCode = `${sourceId} --> ${targetId}${label ? `: ${label}` : ""}`;
      if(label.length > 0){
        edgeCode = `${sourceId} --${label ? `${label}` : ""}--> ${targetId}`;
      }else{
        edgeCode = `${sourceId} --> ${targetId}`;
      }
      mermaidCode += `${edgeCode}\n`;
    });
    console.log(mermaidCode);
    return mermaidCode;
}


  export function letAntVToMermaid(nodes, edges){
    var mermaidCode = convertToMermaidCode(nodes, edges);
    return mermaidCode;
  }


