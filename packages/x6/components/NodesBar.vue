<template>
  <div class="node-bar-container">
    <span class="nodes-bar-title">组件库</span>
    <ul class="nodes-bar">

      <li v-for="(node, index) in nodes" :key="index">
        <div
          id="container_node"
          :class="[freeze ? `freeze-${node.shape}` : `default-${node.shape}`]"
          :style="node.styles"
          @mousedown="startDrag(node, $event)"
        >          
            <img class="icon" :src="imagePath(node.label)" />
          <div class="content">
            <!-- 这里是你的内容 -->
            <span>{{ node.label }}</span>
          </div>
        </div>
      </li>
    </ul>  
  </div>
</template>

<script>
import { Addon } from "@antv/x6";
import { Channel } from "../common/transmit";
import { CustomEventTypeEnum } from "../common/enums";
import {
  getDetailNode,
} from "../common/transform";
import { defineComponent, reactive, toRefs, watch } from "@vue/composition-api";
import { useGraph } from "../store";
import VueNode from "./vue-static-shape/VueNode.vue";
import { session } from "../../../examples/views/SessionRecording.js";

export default defineComponent({
  props: ["nodes"],
  components: {
    VueNode,
  },
  methods: {
    imagePath(label) {
      // 构建图片路径
      const turn = {
        '服务启动词': 'userRequest',
        '说话': 'speak',
        '询问': 'ask',
        '前往': 'goto',
        '人物检测': 'detectHuman',
        '判断': 'condition',
        '循环': 'forLoop',
        '退出循环': 'loopEnd',
        '创建变量': 'infoDeclare',
        '变量赋值': 'infoAssign',
        '服务结束': 'end'
      }
      label = turn[label]
      return process.env.VUE_APP_ICON_Server + "/packages/icons/" + label + ".png"
    },
  },
  setup() {
    const graph = useGraph();

    const data = reactive({
      dnd: {},
      freeze: false,
    });

    const methods = {
      startDrag(currentTarget, e) {
        let { actionType, shape, label } = currentTarget;
        console.log("currentTarget: ", { actionType, shape, label })
        if (label == 'detectHuman') {
          label = '人物检测'
        }
        let json = getDetailNode({
              shape,
              tooltip: label,
              // size: { width: 100, height: 50 },
              attrs: {label: {text: label}},
              data: {actionType: actionType},
              initialization: true,
            });
        console.log("startDrag: nodeJson: ", json)
        const node = graph.value.createNode(json);
        console.log("startDrag: node: ", node)
        if (!data.freeze) data.dnd.start(node, e);

        session.recording("newNodeAdd", node.data.actionType);
      },
      initDnd() {
        data.dnd = new Addon.Dnd({
          target: graph.value,
          validateNode() {
            return true;
          },
        });
      },
    };

    watch(() => graph.value, methods.initDnd);

    // 冻结工具栏
    Channel.eventListener(CustomEventTypeEnum.FREEZE_GRAPH, (bool) => {
      data.freeze = bool;
    });

    return {
      ...toRefs(data),
      ...methods,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "../styles/index.scss";
@include mixin_scrollbar;
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.nodes-bar-title{
  color: #000;
  text-align: center;
  font-family: Avenir;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  position: absolute; /* 添加绝对定位 */
  top: 18px; /* 顶部对齐 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 水平居中 */
  margin-bottom: 10px;

}
.node-bar-container {
  // 禁止被双击选中
  user-select: none;
  width: 200px;
  height: 15%;
  overflow: scroll;
  background: #f6f6f6;
  padding-top: 30px; 
  
  position: absolute;
  top: 19px;
  left: 8px;
  width: 180px;
  height: 413px;
  z-index: 2;
  border-radius: 9px; 
  border: 1px solid #B4B4B4;
  box-shadow: 0px 0px 6px 5px rgba(209, 209, 209, 0.25);
  .nodes-bar {
    width: 100%;
    padding: 20px 0;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;
      & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #303133;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
      }

      [class^="default-"] {
        transition: all 0.08s;
        &:hover {
          transform: scale(1.1) !important;
          color: #333;
        }
      }

      // // 静态vue节点
      // .static-vue-node {
      //   transition: all 0.03s;
      //   &:hover {
      //     transform: scale(1.1) !important;
      //     color: #333;
      //   }
      // }

      // // 默认菱形
      // .default-diamond {
      //   &:hover {
      //     transform: rotateZ(45deg) scale(1.1) !important;
      //   }
      //   span {
      //     transform: rotate(-45deg);
      //   }
      // }

      [class^="freeze-"] {
        opacity: 0.7;
        cursor: no-drop;
      }
      // .freeze-diamond {
      //   &:hover {
      //     transform: rotateZ(45deg) scale(1) !important;
      //   }
      //   span {
      //     transform: rotate(-45deg);
      //   }
      // }
    }
  }
}

#container_node {
  display: flex;
  align-items: center;
  padding-left: 30px;
  width: 212px; /* 设置容器的宽度 */
  overflow: hidden; /* 隐藏超出容器边界的内容 */
  position: relative; /* 将容器设置为相对定位 */
}

.icon {
  width: 25px;
  height: 25px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain; /* 将背景图像缩放到完全适合容器内 */
  position: absolute; /* 将图标设置为绝对定位 */
  left: 7px; /* 将图标定位在容器的左侧 */
  // background-image: var(--icon-url); /* 使用 CSS 变量设置背景图像 */
  // top: 50%; /* 将图标垂直居中对齐 */
  // transform: translateY(-50%); /* 调整图标的垂直位置 */
}

.content {
  flex: 1;
  margin-left: 12px;
  padding: 7px;
  background-color: #fff; /* 内容的背景颜色 */
}
</style>
