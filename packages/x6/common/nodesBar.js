// 初始化 节点栏 元素列表
import { ActionType } from "./enums";
import { getActionTypeTheme } from "./transform";

// 基础样式
const BaseStyle = {
    rect: {
        width: '110px',
        height: '35px',
        lineHeight: '30px',
        textAlign: 'center',
        border: '2px solid',
        // backgroundColor: '#9ec9ff',
        borderRadius: '5px',
        // color: '#7D7671'
    },
    ellipse: {
        width: '100px',
        height: '50px',
        lineHeight: '36px',
        textAlign: 'center',
        border: '2px solid #5b8ffa',
        backgroundColor: '#9ec9ff',
        // borderRadius: '50px / 25px',
        borderRadius: '4px',
        color: '#7D7671'
    },
    // diamond 菱形
    diamond: {
        width: '100px',
        height: '50px',
        lineHeight: '36px',
        textAlign: 'center',
        border: '2px solid #5b8ffa',
        backgroundColor: '#9ec9ff',
        borderRadius: '4px',
        color: '#7D7671',
    }
}

// function getStyles(type) {
//     const { TRIGGER, CONDITION, ACTION } = ActionType
//     let base;
//     const targetTheme = getActionTypeTheme(type)
//     switch (type) {
//         case TRIGGER:
//             base = BaseStyle.ellipse
//             break;
//         case CONDITION:
//             base = BaseStyle.diamond
//             break;
//         case ACTION:
//             base = BaseStyle.rect
//             break;
//         default:
//             break;
//     }
//     return {
//         ...base,
//         backgroundColor: targetTheme.background,
//         borderColor: targetTheme.border
//     }
// }
function getStyles(type) {
    let base = BaseStyle.rect
    const targetTheme = getActionTypeTheme(type)
    return {
        ...base,
        backgroundColor: targetTheme.left_background,
        borderColor: targetTheme.border
    }
}

export const nodes = [
    {
        label: 'UserRequest',
        actionType: ActionType.USERREQUEST,
        styles: getStyles(ActionType.USERREQUEST),
    },
    {
        label: 'speak',
        actionType: ActionType.SPEAK,
        styles: getStyles(ActionType.SPEAK),
    },
    {
        label: 'ask',
        actionType: ActionType.ASK,
        styles: getStyles(ActionType.ASK),
    },
    {
        label: 'goto',
        actionType: ActionType.GOTO,
        styles: getStyles(ActionType.GOTO),
    },
    {
        label: 'detectHuman',
        actionType: ActionType.DETECTHUMAN,
        styles: getStyles(ActionType.DETECTHUMAN),
    },
    {
        label: 'condition',
        actionType: ActionType.IF,
        styles: getStyles(ActionType.IF),
    },
    {
        label: 'forLoop',
        actionType: ActionType.FOR,
        styles: getStyles(ActionType.FOR),
    },
    // {
    //     label: 'info',
    //     actionType: ActionType.INFO,
    //     styles: getStyles(ActionType.INFO),
    // },
    {
        label: 'infoDeclare',
        actionType: ActionType.INFODECLARE,
        styles: getStyles(ActionType.INFODECLARE),
    },
    {
        label: 'infoAssign',
        actionType: ActionType.INFOASSIGN,
        styles: getStyles(ActionType.INFOASSIGN),
    },
    {
        label: 'end',
        actionType: ActionType.END,
        styles: getStyles(ActionType.END),
    },
]