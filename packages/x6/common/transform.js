// G6转X6
import { Lang } from "@antv/x6"
// import { Shape } from '@antv/x6';
import '@antv/x6/dist/x6.css';
import { fmtJSON } from ".";
import { ActionType, CustomEventTypeEnum } from "./enums";
import ErrorClass from "./errorClass";
import { Channel } from "./transmit";
import { fmtLabelOverflow } from "./index"



const portPoint_r = 8;
const node_width = 180;
const node_height = 40;



/**获取不同actionType对应主题色 */
export function getActionTypeTheme(type) {
    console.log(type, type.length)
    /**@enum */
    const Theme = {
        /**默认深蓝 */
        DEFAULT: { border: '#939393', background: '#83b7ff', left_background: '#83b7ff' },
        BLUE: { border: '#4F6C8F', background: '#DEEDFF', left_background: '#4F6C8F' },
        GREEN: { border: '#6D9862', background: '#E7FCE2', left_background: '#6D9862' },
        YELLOW: { border: '#CCC74D', background: '#FFFEE0', left_background: '#CCC74D' },
        PURPLE: { border: '#B16C9D', background: '#FFEFFB', left_background: '#B16C9D' },
    }
    // 默认主题色
    const DEFAULE_THEME = Theme.DEFAULT
    if (!type) return DEFAULE_THEME

    const { USERREQUEST, SPEAK, ASK, FOR, IF, INFO, INFODECLARE, INFOASSIGN, END, GOTO, DETECTHUMAN} = ActionType
    console.log()
    return {
        [USERREQUEST]: Theme.YELLOW,
        [SPEAK]: Theme.BLUE,
        [ASK]: Theme.BLUE,
        [FOR]: Theme.PURPLE,
        [IF]: Theme.PURPLE,
        [INFO]: Theme.GREEN,
        [INFODECLARE]: Theme.GREEN,
        [INFOASSIGN]: Theme.GREEN,
        [GOTO]: Theme.BLUE,
        [END]: Theme.YELLOW,
        [DETECTHUMAN]: Theme.BLUE,
    }[type]
}

/**获取不同actionType对应icon图标 */
export function getActionTypeIcon(type) {
    /**@enum */
    const Theme = {
        DEFAULT: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/UserRequest.png",
        USERREQUEST: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/UserRequest.png",
        SPEAK: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/speak.png",
        ASK: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/ask.png",
        GOTO: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/goto.png",
        FOR: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/for.png",
        IF: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/if.png",
        INFO: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons//var.png",
        INFODECLARE: "http://192.168.123.109:5500/Temi-Program-Visualization-main/packages/icons/info.png",
        INFOASSIGN: "http://192.168.123.109:5500/Temi-Program-Visualization-main/packages/icons/info.png",
        DETECTHUMAN: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/detectHuman.png",
        END: "http://localhost:5500/Temi-Program-Visualization-main/packages/icons/end.png",
    }
    // 默认主题色
    const DEFAULE_THEME = Theme.DEFAULT
    if (!type) return DEFAULE_THEME
    const { USERREQUEST, SPEAK, ASK, FOR, IF, INFO, INFODECLARE, INFOASSIGN, END, GOTO, DETECTHUMAN} = ActionType
    return {
        [USERREQUEST]: Theme.USERREQUEST,
        [SPEAK]: Theme.SPEAK,
        [ASK]: Theme.ASK,
        [FOR]: Theme.FOR,
        [IF]: Theme.IF,
        [INFO]: Theme.INFO,
        [INFODECLARE]: Theme.INFODECLARE,
        [INFOASSIGN]: Theme.INFOASSIGN,
        [GOTO]: Theme.GOTO,
        [END]: Theme.END,
        [DETECTHUMAN]: Theme.DETECTHUMAN,
    }[type]
}
/**
 * 获取默认配置选项
 * 兼容x6/g6
 */
// function getBaseConfig(node) {
//     // console.log("getBaseConfig: node: ", node);

//     let { type, shape, tooltip, attrs, x, y, size, id, position, data, actionType, initialization } = node
//     // let { id, data, actionType } = node


//     // console.log("getBaseConfig: node: data: ", data);
//     // console.log("getBaseConfig: node: attrs: ", attrs);
//     let _width,
//         _height,
//         _x = x,
//         _y = y,
//         _shape = shape,
//         _tooltip = tooltip,
//         _actionType = actionType
//     if (data && data.actionType) {
//         _actionType = data.actionType
//     }
//     if (size) {
//         // G6
//         if (Lang.isArray(size)) {
//             _width = size[0]
//             _height = size[1]
//         }
//         // x6
//         else if (Lang.isObject(size)) {
//             _width = size.width
//             _height = size.height
//         }
//     }
//     if (Lang.isObject(position)) {
//         _x = position.x
//         _y = position.y
//     }
//     // 形状转义
//     // G6
//     if (Lang.isString(type)) {
//         _shape = type
//         if (type === 'diamond') _shape = 'rect'
//     }
//     if (Lang.isObject(attrs)) {
//         _tooltip = attrs.label.text
//     }

//     // const cutLabel = fmtLabelOverflow(_tooltip)
//     const cutLabel = _tooltip;


//     return {
//         type: _shape,
//         label: cutLabel,
//         x: _x,
//         y: _y,
//         width: _width,
//         height: _height,
//         id,
//         actionType: _actionType,
//         data: {
//             actionType: _actionType,
//             initialization,
//             tooltip: _tooltip
//         }
//     }
// }

function getBaseConfig(node) {
    let { x, y, id, data, attrs, actionType } = node
    var _tooltip
    if (data){
        actionType = data.actionType
    }

    // console.log("getBaseConfig: node: ", node)

    // 规定node的宽度和高度
    let _width = node_width;
    let _height = node_height;

    // if (data.tooltip) {
    //     console.log("data.tootip: ", data.tooltip)
    //     console.log("attrs.label.text: ", attrs.label.text)
    //     if (data.tooltip.length != attrs.label.text.length) {
    //         attrs.label.text = data.tooltip            
    //     }
    // }

    if (Lang.isObject(attrs)) {
        _tooltip = attrs.label.text
        // console.log("_tooltip: ", attrs.label.text)
        // console.log("true: tooltip: ", data.tooltip)
    }
    if (!data.tooltip) {
        data.tooltip = _tooltip
    }
    // if (Lang.isObject(data)){
    //     _tooltip = data.tooltip
    // }
    const cutLabel = fmtLabelOverflow(_tooltip)

    return {
        // type: _shape,
        x: x,
        y: y,
        label: cutLabel,
        width: _width,
        height: _height,
        id,
        data: {
            actionType: actionType,
            // tooltip: _tooltip
            tooltip: data.tooltip
        }
    }
}

/**
 * 参数：节点类型，需要去找不同的icon 和 颜色
 */
export function getDetailNode(node) {
    let { x, y, label, id, data, width, height } = getBaseConfig(node)
    // console.log("getDetailNode: ", label)
    const actionType = data.actionType;
    console.log("actionType: ", actionType)
    // 主题色
    const targetTheme = getActionTypeTheme(actionType)
    let iconURL = getActionTypeIcon(actionType)

    return {
        id,
        shape: "rect",
        width: width,
        height: height,
        x: x,
        y: y,
        data,
        attrs: {
          body: {
            stroke: targetTheme.border,
            strokeWidth: 2,
            fill: targetTheme.background,
            // opacity: 0.5,
            rx: 5,
            ry: 5,
          },
          
          leftRect: {
            x: 2,
            y: 2,
            width: 38,
            height: 36,
            stroke: targetTheme.border,
            strokeWidth: 2.5,
            fill: targetTheme.left_background,
            // opacity: 0.8
          },
          icon: {
            x: 6,
            y: 6,
            width: 28,
            height: 28,
            xlinkHref: iconURL,
           },
          label: {
            text: label,
            fill: "#000000",
            // strokeWidth: 0.4,
            fontSize: 12,
            fontWeight: "bold", // 将fontWeight属性设置为"bold"
            x: -38,
            'text-anchor': 'start', // 文本左对齐
            // refX: 20,
            // refY: '50%',
            // xAlignment: 'right',
            // yAlignment: 'middle',
           },

        },
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'rect',
            selector: 'leftRect',
          },
          {
            tagName: 'image',
            selector: 'icon',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        ports: {
            items: [
                { group: 'port_top', id: 'p_top' },
                { group: 'port_bottom', id: 'p_bottom' },
            ],
            groups: {
                "port_top": {
                    position: 'top',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                },
                "port_bottom": {
                    position: 'bottom',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        },
                    },
                },
            },
        }
    }
}



/**
 * 获取多边形node节点
 */
export function getEllipseNode(node) {
    // const { type, label, x, y, width, height, id, actionType, data } = getBaseConfig(node)
    // let { label, x, y, id, actionType, data } = getBaseConfig(node)
    let { x, y, label, id, data, width, height } = getBaseConfig(node)

    // console.log("getNode: label: ", label);
    // const width = 10 * label.length;
    // const height = 50;
    const actionType = data.actionType;

    // 主题色
    const targetTheme = getActionTypeTheme(actionType)
    return {
        id,
        // shape: "circle", // 指定使用何种图形，默认值为 'rect'
        shape: "rect",
        width: width,
        height: height,
        x: x,
        y: y,
        // x: x - width/2,
        // y: y - height/2,
        // y,
        // x, y,
        // zIndex: 100,
        data,
        attrs: {
            label: {
                text: label,
                fill: "#7D7671",
                strokeWidth: 0.4,
                fontSize: 12,
            },
            body: {
                stroke: targetTheme.border,
                strokeWidth: 1,
                fill: targetTheme.background,
            }
        },
        ports: {
            items: [
                { group: 'port_top', id: 'p_top' },
                { group: 'port_bottom', id: 'p_bottom' },
                { group: 'port_left', id: 'p_left' },
                { group: 'port_right', id: 'p_right' },

            ],
            groups: {
                "port_top": {
                    position: 'top',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                },
                "port_bottom": {
                    position: 'bottom',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        },
                    },
                },
                "port_left": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'left',
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
                "port_right": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'right',
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
            },
            
        },
    }
}

/**
 * 获取矩形node节点
 */
export function getRectNode(node) {
    // const { type, label, x, y, width, height, id, actionType, data } = getBaseConfig(node)
    // const { type, label, x, y, id, actionType, data } = getBaseConfig(node)
    // let { type, label, id, actionType, data } = getBaseConfig(node)
    let { x, y, label, id, data, width, height } = getBaseConfig(node)

    // 主题色
    const targetTheme = getActionTypeTheme(data.actionType)
    // const width = 11.5 * label.length;
    // const height = 50;
    return {
        id,
        shape: 'rect', // 指定使用何种图形，默认值为 'rect'
        width,
        height,
        // x: x - width / 2,
        // y: y - height / 2,
        x: x,
        y: y,
        // y,
        // zIndex: 100,
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label',
            }
        ],
        data,
        attrs: {
            label: {
                text: label,
                fill: "#7D7671",
                strokeWidth: 0.4,
                fontSize: 12,
            },
            body: {
                stroke: targetTheme.border,
                strokeWidth: 1.5,
                fill: targetTheme.background,
            }
        },
        ports: {
            items: [
                { group: 'port-top', id: 'p_top' },
                { group: 'port-bottom', id: 'p_bottom' },
                { group: 'port_left', id: 'p_left' },
                { group: 'port_right', id: 'p_right' },
            ],
            groups: {
                "port-top": {
                    position: 'top',
                    zIndex: 20,
                    // args: { x: 0, y: 0 },
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                },
                "port-bottom": {
                    position: 'bottom',
                    zIndex: 20,
                    // args: { x: 0, y: 0 },
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                },
                "port_left": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'left',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            visibility: 'visible',
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
                "port_right": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'right',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
            }
        },
    }
}

/**
 * 获取菱形node节点
 */
 export function getDiamondNode(node) {
    // const { type, label, x, y, width, height, id, actionType, data } = getBaseConfig(node)
    // const { type, label, x, y, id, actionType, data } = getBaseConfig(node)
    // let { type, label, id, actionType, data } = getBaseConfig(node)
    let { x, y, label, id, data, width, height } = getBaseConfig(node)


    // 主题色
    const targetTheme = getActionTypeTheme(data.actionType)
    // const width = 11.5 * label.length;
    // const height = 50;
    return {
        id,
        shape: 'rect', // 指定使用何种图形，默认值为 'rect'
        width,
        height,
        // x: x - width / 2,
        // y: y - height / 2,
        // y,
        x, y,
        // zIndex: 100,
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label',
            }
        ],
        data,
        attrs: {
            label: {
                text: label,
                fill: "#7D7671",
                strokeWidth: 0.4,
                fontSize: 12,
            },
            body: {
                stroke: targetTheme.border,
                strokeWidth: 1.5,
                fill: targetTheme.background,
            }
        },
        ports: {
            items: [
                { group: 'port-top', id: 'p_top' },
                { group: 'port-bottom', id: 'p_bottom' },
                { group: 'port_left', id: 'p_left' },
                { group: 'port_right', id: 'p_right' },
            ],
            groups: {
                "port-top": {
                    position: 'top',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                },
                "port-bottom": {
                    position: 'bottom',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                },
                "port_left": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'left',
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
                "port_right": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'right',
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
            }
        },
    }
}

// export function getDiamondNode(node) {
//     const { type, label, x, y, id, actionType, data } = getBaseConfig(node)
//     // console.log("baseConfig: ", { type, label, x, y, id, actionType, data });
//     // 主题色
//     const targetTheme = getActionTypeTheme(actionType)
//     return {
//         id,
//         shape: type, // 指定使用何种图形，默认值为 'rect'
//         width: 50,
//         height: 50,
//         x: x - 25,
//         y: y - 25,
//         zIndex: 100,
//         markup: [
//             {
//                 tagName: 'rect',
//                 selector: 'body'
//             },
//             {
//                 tagName: 'text',
//                 selector: 'label',
//             }
//         ],
//         data,
//         attrs: {
//             label: {
//                 text: label,
//                 fill: "#7D7671",
//                 strokeWidth: 0.4,
//                 fontSize: 12,
//             },
//             body: {
//                 transform: "rotate(-45,25,25)",
//                 stroke: targetTheme.border,
//                 strokeWidth: 1.5,
//                 fill: targetTheme.background,
//                 rx: 5, // 属性用于定义水平轴向的圆角半径尺寸。
//                 ry: 5,
//             }
//         },
//         ports: {
//             items: [
//                 { group: 'in', id: 'p_top' },
//                 { group: 'out', id: 'p_bottom' },
//             ],
//             groups: {
//                 in: {
//                     attrs: {
//                         circle: {
//                             dataClass: 'choice-point',
//                             r: 6,
//                             magnet: true,
//                             stroke: '#5b8ffa',
//                             strokeWidth: 1,
//                             fill: '#fff',
//                             // 上平移
//                             transform: 'translate(0, -7)'
//                         }
//                     },
//                     position: 'top'
//                 },
//                 out: {
//                     attrs: {
//                         circle: {
//                             dataClass: 'choice-point',
//                             r: 6,
//                             magnet: true,
//                             stroke: '#5b8ffa',
//                             strokeWidth: 1,
//                             fill: '#fff',
//                             // 下平移
//                             transform: 'translate(0, 7)'
//                         }
//                     },
//                     position: 'bottom'
//                 }
//             }
//         },
//     }
// }

/**
 * 获取FOR循环节点
 * @param {*} node 
 * @returns 
 */
export function getForNode(node) {
    // console.log("forNode: ", node);
    // let { type, label, x, y, id, actionType, data } = getBaseConfig(node)
    // let { type, label, id, actionType, data } = getBaseConfig(node)
    let { x, y, label, id, data, width, height } = getBaseConfig(node)


    // console.log("baseConfig: ", { type, label, x, y, id, actionType, data });
    // 主题色
    // type = "ellipse";
    // width = 12 * label.length;
    // height = 50;
    const targetTheme = getActionTypeTheme(data.actionType)
    return {
        id,
        shape: 'rect', // 指定使用何种图形，默认值为 'rect'
        width,
        height,
        // x: x - width / 2,
        // y: y - height / 2,

        x, y,
        // zIndex: 100,
        data,
        attrs: {
            //node里的字
            label: {
                text: label,
                fill: "#7D7671",
                strokeWidth: 0.4,
                fontSize: 12,
            },
            //node的形状体
            body: {
                stroke: targetTheme.border,
                strokeWidth: 1.5,
                fill: targetTheme.background,
            }
        },
        ports: {
            items: [
                { group: 'port_top', id: 'p_top' },
                { group: 'port_bottom', id: 'p_bottom' },
                { group: 'port_left', id: 'p_left' },
                { group: 'port_right', id: 'p_right' },

            ],
            groups: {
                "port_top": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'top',
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
                "port_bottom": {
                    position: 'bottom',
                    // position:  {
                    //     x: 0, 
                    //     y: 0, 
                    //    },
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff'
                        },
                    },
                },
                "port_left": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'left',
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
                "port_right": {
                    // position: ['top', 'bottom', 'left', 'right'],
                    position: 'right',
                    // zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: portPoint_r,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            // fill: '#fff',
                            // transform: 'translate(0, 0)'
                        }
                    }
                },
            }
        },
    }
}


// 获取Vue节点
export function getVueNode(node) {
    const { label, width, height, id, data } = getBaseConfig(node)
    return {
        id,
        shape: "vue-shape",
        width,
        height,
        component: "vue-node",
        label,
        zIndex: 100,
        data,
        ports: {
            items: [
                { group: 'port-top', id: 'p_top' },
                { group: 'port-bottom', id: 'p_bottom' },
            ],
            groups: {
                "port-top": {
                    position: 'top',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: 6,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                },
                "port-bottom": {
                    position: 'bottom',
                    zIndex: 20,
                    attrs: {
                        circle: {
                            dataClass: 'choice-point',
                            r: 6,
                            magnet: true,
                            stroke: '#5b8ffa',
                            strokeWidth: 1,
                            fill: '#fff'
                        }
                    }
                }
            }
        },
    }
}

export function getNodeJSON(nodes) {
    const nodeList = []
    for (const node of nodes) {
        const nodeJSON = fmtJSON(node)
        const actionType = nodeJSON.data.actionType
        if (!actionType) {
            Channel.dispatchEvent(CustomEventTypeEnum.RUNTIME_ERR, ErrorClass.InvalidFormatData('缺少ActionType'))
            throw new ErrorClass.InvalidFormatData('缺少ActionType')
        }
        nodeList.push(getDetailNode(nodeJSON))
    }
    return nodeList
}

/**
 * 反序列化
 * 按照指定的 JSON 数据渲染节点和边。
 */
export function fromJSON(graph, nodes, edges) {
    // console.log("fromJSON: ", edges)
    if (!Lang.isArray(nodes) || !Lang.isArray(edges)) {
        Channel.dispatchEvent(CustomEventTypeEnum.RUNTIME_ERR, ErrorClass.InvalidParameters('节点或者边数据格式不正确'))
        throw new ErrorClass.InvalidParameters('节点或者边数据格式不正确')
    }
    graph.fromJSON({
        nodes: getNodeJSON(nodes),
        edges: fmtJSON(edges),
    });
}

/**
 * 序列化
 */
export function toJSON(graph) {
    const edges = [], nodes = [], edgesJSON = [], nodesJSON = []
    const cells = graph.getCells()
    if (cells.length) {
        for (const cell of cells) {
            const json = cell.toJSON()
            if (cell.isEdge()) {
                edgesJSON.push(json)
                edges.push(JSON.stringify(json))
            }
            if (cell.isNode()) {
                // 把省略符号去掉
                json.attrs.label.text = json.data.tooltip
                nodesJSON.push(json)
                nodes.push(JSON.stringify(json))
            }
        }
    }
    return { nodes, edges, nodesJSON, edgesJSON }
}