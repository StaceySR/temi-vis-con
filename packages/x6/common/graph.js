import { Graph } from "@antv/x6";
import registerNode from "../shape/registerNode";
import registerGraphListener from "../eventSystems";
import trigger from "../common/trigger";
import { useProvideGraph } from "../store";

/**
 * x6实例化
 */
export function initGraph() {
    const graph = new Graph({
        container: document.getElementById("container"),
        // width: 600,
        // height: 600,
        // 监听容器大小改变，并自动更新画布大小
        // https://x6.antv.vision/zh/docs/api/graph/graph#autoresize
        autoResize: true,
        // 键盘快捷键 Keyboard
        // https://x6.antv.vision/zh/docs/tutorial/basic/keyboard/#gatsby-focus-wrapper
        keyboard: {
            enabled: true,
            global: true,
        },
        // 点选/框选，默认禁用。
        selecting: {
            enabled: true,
            showNodeSelectionBox: true,
            // https://x6.antv.vision/zh/docs/tutorial/basic/selection
            rubberband: true, // 启用框选
            modifiers: "ctrl", // 组合键
        },
        // 对齐线
        snapline: true,
        // 画布平移
        // https://x6.antv.vision/zh/docs/tutorial/basic/graph/#%E7%94%BB%E5%B8%83%E5%B9%B3%E7%A7%BB
        panning: {
            enabled: true,
            eventTypes: ["leftMouseDown", "rightMouseDown", "mouseWheel"],
            // modifiers: 'shift', //要按下这个修饰键才能进行画布平移
        },
        // 网格
        grid: {
            size: 10, // 网格大小 10px
            visible: true, // 渲染网格背景
        },
        // 剪切板 Clipboard
        // https://x6.antv.vision/zh/docs/tutorial/basic/clipboard
        clipboard: true,
        // 撤销/重做 Redo/Undo
        // https://x6.antv.vision/zh/docs/tutorial/basic/history/#gatsby-focus-wrapper
        history: {
            enabled: true,
            beforeAddCommand(event, args) {
                if (args.key) {
                    // 禁止删除按钮添加到 Undo 队列中
                    return args.key !== "tools";
                }
            },
        },
        // 可以通过 highlighting 选项来指定触发某种交互时的高亮样式
        // https://x6.antv.vision/zh/docs/api/graph/interaction/#highlighting
        highlighting: {
            // 当链接桩可以被链接时，在链接桩外围渲染一个 2px 宽的红色矩形框
            magnetAvailable: {
                name: "stroke",
                args: {
                    padding: 1,
                    attrs: {
                        "stroke-width": 2,
                        // stroke: "skyblue",
                        stroke: "green"
                    },
                },
            },
            // 连线过程中，自动吸附到链接桩时被使用
            magnetAdsorbed: {
                name: "stroke",
                args: {
                    padding: 4,
                    attrs: {
                        "stroke-width": 8,
                        // stroke: "skyblue",
                        stroke: "green",

                    },
                },
            },
        },
        // 滚轮缩放
        mousewheel: {
            enabled: true,
            modifiers: ["ctrl", "meta"],
        },
        // 迷你地图
        // minimap: {
        //     enabled: true,
        //     // width: 250,
        //     height: 150,
        //     container: document.getElementById("minimap"),
        //     padding: 10,
        // },
        // 定制节点和边的交互行为
        // https://x6.antv.vision/zh/docs/tutorial/basic/interacting/#%E5%AE%9A%E5%88%B6%E4%BA%A4%E4%BA%92%E8%A1%8C%E4%B8%BA

        //这里控制node是否能移动
        interacting: function (cellView) {
            // console.log("cellView: ", cellView);
            if (cellView.cell.getData()?.disableMove) {
                return { nodeMovable: false }
            }
            return true
            // return {nodeMovable: false}
        },
        // 配置全局的连线规则
        // https://x6.antv.vision/zh/docs/api/graph/interaction
        connecting: {
            // 自动吸附
            // snap: true,
            snap: {
                radius: 50,
              },
            // 不允许连接到画布空白位置的点
            allowBlank: false,
            // 不允许创建循环连线
            allowLoop: false,
            // 不允许在相同的起始节点和终止之间创建多条边
            allowMulti: false,
            // 高亮显示所有可用的连接桩或节点
            // https://x6.antv.vision/zh/docs/tutorial/basic/interacting/#highlight
            highlight: true,
            // 当连接到节点时，通过 sourceAnchor 来指定源节点的锚点。
            // anchor: 'bottom',
            anchor: {
                name: "bottom",
                // args: {
                //     // 连接桩的大小
                //     size: 8,
                //     dx: 5,
                //     dy: 10
                // },

            },
            sourceAnchor: {
                name: "center",
            },
            // 当连接到节点时，通过 targetAnchor 来指定目标节点的锚点。
            targetAnchor: "top",
            // 指定连接点，默认值为 boundary。
            connectionPoint: "anchor",
            // 连接器将起点、路由返回的点、终点加工为 元素的 d 属性，决定了边渲染到画布后的样式，默认值为 normal。
            connector: {
                // export * from './normal';
                // export * from './loop';
                // export * from './rounded';
                // export * from './smooth';
                // export * from './jumpover';

                name: "rounded",
                args: {
                    radius: 1,
                },
                // name: "jumpover", // 重叠的线会有跳跃注明
                // args: {
                //     type: 'arc',
                //     size: 10
                // }
            },
            // 路由将边的路径点 vertices 做进一步转换处理，并在必要时添加额外的点，然后返回处理后的点，默认值为 normal。
            // export * from './normal';
            // export * from './oneside';
            // export * from './orth';
            // export * from './metro';
            // export * from './manhattan/index';
            // export * from './er';
            // export * from './loop';

            router: {
                name: "manhattan",
                args: {
                  step: 15,
                  startDirections: ['bottom'],
                  endDirections: ['top'],
                    // excludeShapes: ["rect"],
                  padding: 10,
                }
            },            
            // https://x6.antv.vision/zh/docs/tutorial/basic/interacting/#validatemagnet
            // 判断是否新增边
            validateMagnet({ magnet }) {
                const portGroup = magnet.getAttribute("port-group");
                return portGroup !== "in";
            },
            // 连接的过程中创建新的边
            createEdge() {
                return this.createEdge({
                    zIndex: -1,
                    attrs: {
                        line: {
                            strokeDasharray: "5 5",
                            stroke: "#7c68fc",
                            strokeWidth: 1,
                            targetMarker: {
                                name: "block",
                                args: {
                                    size: "6",
                                },
                            },
                        },
                    },
                });
            },
            // https://x6.antv.vision/zh/docs/tutorial/basic/interacting/#validateconnection
            // 在移动边的时候判断连接是否有效，如果返回 false，当鼠标放开的时候，不会连接到当前元素，否则会连接到当前元素。
            validateConnection({ targetView, sourceMagnet, targetMagnet, sourceCell }) {
                if (!sourceMagnet || !targetMagnet) {
                    return false;
                }
                if (sourceCell.getData()?.disableMove) return false
                // 判断目标链接桩是否可连接
                const portId = targetMagnet.getAttribute("port");
                const node = targetView.cell;
                const port = node.getPort(portId);
                if (!port) {
                    return false;
                }
                return true;
            },
        },
    });
  

    // 注册Vue节点
    registerNode()
    // 注册画布监听器
    registerGraphListener(graph)
    // 注入触发器
    trigger(graph);
    // 缓存实例化graph引用
    useProvideGraph(graph)


    // graph.on('cell:selected', ({ cell }) => {
    //     console.log("cell: ", cell)
    
    //     // 多单选选中时，移除删除
    //     console.log("选中的cells: ", graph.getSelectedCells());
    //   });

    // graph.on('edge:mouseenter', ({ cell }) => {
    //     cell.addTools([
    //       'source-arrowhead',
    //       {
    //         name: 'target-arrowhead',
    //         args: {
    //           attrs: {
    //             fill: 'red',
    //           },
    //         },
    //       },
    //     ])
    // })
    
    // graph.on('edge:mouseleave', ({ cell }) => {
    //     cell.removeTools()
    // })

      // 双击进入edge label编辑模式
    graph.on('edge:dblclick', ({ cell, e }) => {
        cell.addTools({
        name: 'edge-editor',
        args: {
            event: e,
        },
        })
    });
    //单击画布，取消所有选中
    // graph.on('canvas:click', () => {
    //     console.log("canvas click clean")
    //     graph.cleanSelection()
    // });
    // graph.on('edge:contextmenu', (e) => {
    //     console.log('Canvas clicked!', e);
    //     // 处理画布点击事件的代码
    // });
    return graph
}