<template>
  <div class="node-bar-container">
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




export default defineComponent({
  props: ["nodes"],
  components: {
    VueNode,
  },
  methods: {
    imagePath(label) {
      // 构建图片路径
      return "http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/" + label + ".png"
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
        const { actionType, shape, label } = currentTarget;
        console.log("currentTarget: ", { actionType, shape, label })
        let json = getDetailNode({
              shape,
              tooltip: label,
              // size: { width: 100, height: 50 },
              attrs: {label: {text: label}},
              data: {actionType: actionType},
              initialization: true,
            });
        const node = graph.value.createNode(json);
        if (!data.freeze) data.dnd.start(node, e);
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
.node-bar-container {
  // 禁止被双击选中
  user-select: none;
  width: 150px;
  height: 20%;
  overflow: scroll;
  background: #f6f6f6;
  .nodes-bar {
    width: 100%;
    padding: 20px 0;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
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
  width: 200px; /* 设置容器的宽度 */
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
  padding: 5px;
  background-color: #fff; /* 内容的背景颜色 */
}
</style>
