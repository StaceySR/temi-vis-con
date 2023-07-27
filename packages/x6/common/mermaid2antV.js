function parseMermaidCode(mermaidCode) {
    const lines = mermaidCode.split('\n');
    const nodes = [];
    const edges = [];
    const variables = {"all": []};

    lines.forEach((line) => {
        // console.log("line: ", line);

        //---匹配node
        //1. 匹配r_01["userRequest:预约开会"]
        // const regex = /(\w+)\(\["([^"]+)"\]\)|(\w+)\["([^"]+)"\]|(\w+)\{"([^"]+)"\}|(\w+)\{\{"([^"]+)"\}\}/;
        // const nodeLine = line.match(/(\w+)\["([^"]+)"\]/);

        const regex_1 = /(\w+)\(\["(\w+):([^"]+)"\]\)/;  //r_01(["userRequest:羽毛球赛"])
        const regex_2 = /(\w+)\["(\w+):?([^"]*)"\]/;  //h_01["info:定义成员列表"]
        const regex_3 = /(\w+)\{\{"(\w+):([^"]+)"\}\}/;  //f_01{{"forLoop:从members列表中取出当前的成员对象"}}
        const regex_4 = /(\w+)\{"(\w+):([^"]+)"\}/;  //c_01{"condition: 是否在座位上"}
        // const regex = /(\w+)\(\["(\w+):([^"]+)"\]\)|(\w+)\["(\w+):([^"]+)"\]|(\w+)\{\{"(\w+):([^"]+)"\}\}|(\w+)\{"(\w+):([^"]+)"\}/;
        const nodeLine_1 = line.match(regex_1);
        const nodeLine_2 = line.match(regex_2);
        const nodeLine_3 = line.match(regex_3);
        const nodeLine_4 = line.match(regex_4);

        // console.log("nodeLine_1: ", nodeLine_1);
        // console.log("nodeLine_2: ", nodeLine_2);
        // console.log("nodeLine_3: ", nodeLine_3);
        // console.log("nodeLine_4: ", nodeLine_4);
        let nodeLine = null;
        if (nodeLine_1) {
            nodeLine = nodeLine_1;
        } else if (nodeLine_2) {
            nodeLine = nodeLine_2;
        } else if (nodeLine_3) {
            nodeLine = nodeLine_3;
        } else if (nodeLine_4) {
            nodeLine = nodeLine_4;
        } else {
        // 四个变量都为空的情况
        }
        if (nodeLine) {
            // console.log("nodeLine: ", nodeLine);
            //2. 匹配 "r_01", 座位node.id
            let nodeId = nodeLine[1];                    
            //3. 匹配 "userRequest:预约开会"中的"userRequest", 作为node.Action
            let nodeAction = nodeLine[2];
            // console.log("nodeAction: ", nodeAction);
            //4. 匹配 "userRequest:预约开会"中的"预约开会", 作为node.label
            let nodeLabel = nodeLine[3].trim();
            // console.log("nodeLabel: ", nodeLabel);

            const parts = nodeLabel.split(";");
            for (let index = 1; index < parts.length; index++) {
                let variable = parts[index];
                variables['all'].push(variable)
            }

            const set = new Set(variables['all']);  // 使用 Set 去除重复元素
            const tuple = Array.from(set);  // 将 Set 转换为数组
            variables['all'] = tuple;
            
            //5. 判断node.actionType
            // console.log("nodeAction: ", nodeAction)
            let actionType = nodeAction.toUpperCase();
            if (nodeAction == "condition") {
                actionType = "IF"                
            }
            if (nodeAction == "forLoop") {
                actionType = "FOR"
            }
            if (nodeAction == "loopEnd") {
                actionType = "LOOPEND"
            }
            if (nodeAction == "end") {
                actionType = "END"
            }
            if (nodeLabel.length == 0) {
                nodeLabel = nodeAction
                if (nodeLabel == "detectHuman") {
                    nodeLabel = "人物检测"
                }                
            }
            //5. 将node格式化保存至nodes列表
            // const node = {
            //                 "attrs": {"label": { "text": nodeAction+": "+nodeLabel }},
            //                 // "attrs": {"label": { "text": nodeLabel }},
            //                 "id": nodeId,
            //                 "data": { "actionType": actionType , "tooltip": nodeAction+": "+nodeLabel}//代表这个node的形状，TRIGGER是圆形；CONDITION是菱形；ACTION是矩形
            //             };
            const node = {
                "attrs": {"label": { "text": nodeLabel }},
                // "attrs": {"label": { "text": nodeLabel }},
                "id": nodeId,
                "data": { "actionType": actionType , "tooltip": nodeLabel}//代表这个node的形状，TRIGGER是圆形；CONDITION是菱形；ACTION是矩形
            };
            // console.log("mermaid: each node: ", node);
            nodes.push(node);
        }

        //---匹配edge
        //1. 匹配 A --> B
        // const edgeMatch = line.match(/(\w+)\s*-->\s*(\w+)/);
        const edgeMatch = line.match(/(\w+)\s-.*->\s(\w+)/);
        // const edgeMatchWithLabel = line.match(/(\w+)\s*--(?:[^-]+)?-->\s*(\w+)/g);
        
        if (edgeMatch) {
            // console.log("edgeMatch: ", edgeMatch);
            //2. 匹配c_02 --false--> h_06 中的边的label：false
            let label = "";

            const edgeLabel = edgeMatch[0].match(/(\w+)\s--(\w+)-->\s(\w+)/);
            if (edgeLabel){
                // console.log("label: ", edgeLabel);
                label = edgeLabel[2];
            }
            //3. 匹配A --> B中的A，作为edge的起点source
            const source = edgeMatch[1];
            //4. 匹配A --> B中的B，作为edge的终点target
            const target = edgeMatch[2];
            //5. 将edge格式化保存至edges列表
            const edge = {
                "source": {
                    "cell": source,  //node的id
                    "port": "p_bottom",
                    anchor: { 
                        name: 'center', 
                    },
                },
                "target": {
                    "cell": target,
                    "port": "p_top",
                    anchor: { 
                        name: 'center', 
                    },
                },
                "labels": [
                    {
                        "attrs": { "label": { "text": label } }
                    }
                ],
                "attrs": {
                    "line": {
                        "stroke": '#C0C0C0',
                        "strokeWidth": 1,
                    }
                },
                            
            }
            // const edge = {
            //     "source": source, 
            //     "target": target,
            //     "labels": [{ "attrs": { "label": { "text": label } } }]
            // }
            edges.push(edge);
        }
        // console.log("edges: ", edges);
    });

    // 判断这个node是不是最后一个，如果是的话，也应该是TRIGGER 
    // nodes[nodes.length - 1]["data"]["actionType"] = "TRIGGER";
    console.log("mermaid2antV: nodes+edges: ", {nodes, edges});
    console.log("mermaid2antV: variables: ", variables);
    return { nodes, edges, variables };
}


export function getMermaidData(mermaidCode){
    //todo 预留接受后端mermaid数据接口
    // const data = await axios.get('api')    
    // const sourcedata = `graph TB
    //                                     r_01(["userRequest:羽毛球赛"])
    //                                     h_01["info:定义成员列表"]
    //                                     h_02["info:定义用于保存成员报名信息的reply对象，初始化为空"]
    //                                     r_01 --> h_01
    //                                     h_01 --> h_02
    //                                     f_01{{"forLoop:从members列表中取出当前的成员对象"}}
    //                                     h_02 --> f_01
    //                                     g_01["goto:前往当前成员座位"]
    //                                     f_01 --"处理当前member信息"--> g_01
    //                                     d_01["detectHuman"]
    //                                     g_01 --> d_01
    //                                     c_01{"condition: 是否在座位上"}
    //                                     d_01 --> c_01
    //                                     a_01["ask:询问当前成员本周六下午是否有空参加羽毛球赛"]
    //                                     c_01 --true--> a_01
    //                                     h_03["info:记录当前成员的参加情况"]
    //                                     a_01 --> h_03
    //                                     h_03 --> f_01
    //                                     h_04["info:记录当前成员的参加情况"]
    //                                     c_01 --false--> h_04
    //                                     h_04 --> f_01
    //                                     f_01 --"完成遍历循环"--> j_01
    //                                     j_01{{"loopEnd:退出循环"}}
    //                                     g_02["goto:前往客厅"]
    //                                     j_01 --> g_02
    //                                     s_01["speak:告知羽毛球赛的参与情况"]
    //                                     g_02 --> s_01
    //                                     f_02{{"forLoop:分别读出每个成员的报名情况"}}
    //                                     s_01 --> f_02
    //                                     s_02["speak:报告当前成员的报名情况"]
    //                                     f_02 --"处理当前成员的报名情况"--> s_02
    //                                     s_02 --> f_02
    //                                     f_02 --"完成遍历循环"--> j_02
    //                                     j_02{{"loopEnd:退出循环"}}
    //                                     k_01(["end:任务结束"])
    //                                     j_02 --> k_01
    //                                     `
    const antVdata = parseMermaidCode(mermaidCode);
    return antVdata;
}