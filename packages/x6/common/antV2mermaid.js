
function convertToMermaidCode(nodes, edges) {
    let mermaidCode = "graph TB\n";
  
    // convert nodes to mermaid code
    nodes.forEach(node => {
      //console.log("con-node : ", node);
      const id = node.id;
      console.log("node.data: ", node.data);
      const actionType = node.data.actionType;

    //   const label = node.attrs.label.text.substring(actionType.length);
      const label = node.attrs.label.text;
      let nodeCode = "";

    //   console.log("id: ", node.id);
    //   console.log("actionType: ", node.data.actionType);
    //   console.log("label: ", node.attrs.label.text);
    //   console.log("label: ", node.attrs.label.text.substring(actionType.length));

      switch (actionType) {
        case "USERREQUEST":
          nodeCode = `${id}(["userRequest:${label}"])`;
          break;
        case "INFODECLARE":
          nodeCode = `${id}["infoDeclare:${label}"]`;
          break;
        case "INFOASSIGN":
          nodeCode = `${id}["infoAssign:${label}"]`;
          break;
        case "SPEAK":
          nodeCode = `${id}["speak:${label}"]`;
          break;
        case "ASK":
          nodeCode = `${id}["ask:${label}"]`;
          break;
        case "GOTO":
          nodeCode = `${id}["goto:${label}"]`;
          break;
        case "DETECTHUMAN":
          nodeCode = `${id}["detectHuman"]`;
          break;
        case "IF":
          nodeCode = `${id}{"condition:${label}"}`;
          break;
        case "FOR":
          nodeCode = `${id}{{"forLoop:${label}"}}`;
          break;
        case "LOOPEND":
          nodeCode = `${id}{{"loopEnd:${label}"}}`;
          break;
        case "END":
          nodeCode = `${id}(["end:${label}"])`;
          break;
        default:
          
      }
      

      // switch (actionType) {
      //   case "TRIGGER":
      //     nodeCode = `${id}(["${label}"])`;
      //     break;
      //   case "CONDITION":
      //     nodeCode = `${id}{"${label}"}`;
      //     break;
      //   case "FOR":
      //     nodeCode = `${id}{{"${label}"}}`;
      //     break;
      //   default:
      //     nodeCode = `${id}["${label}"]`;
      //     break;
      // }
    //   console.log("nodeCode: ", nodeCode);
  
      mermaidCode += `${nodeCode}\n`;
    });

    // convert edges to mermaid code
  edges.forEach(edge => {
      console.log("con-edge : ", edge);
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


