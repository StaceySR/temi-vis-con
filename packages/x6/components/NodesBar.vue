<template>
  <div class="node-bar-container">
    <!-- <ul class="nodes-bar">
      <li v-for="(node, index) in nodes" :key="index">
        <div
          :class="[freeze ? `freeze-${node.shape}` : `default-${node.shape}`]"
          :style="node.styles"
          @mousedown="startDrag(node, $event)"
        >
          <span>{{ node.label }}</span>
        </div>
      </li>
    </ul> -->
    <!-- <div>
      <label for="my-select">选择一个选项：</label>
      <select id="my-select" v-model="selectedOption">
        <option disabled value="">请选择</option>
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <p>你选择的选项是：{{ selectedOption }}</p>
    </div> -->
    <div class="custom-select">
    <div class="custom-select__selected" @click="toggleDropdown">
      <div class="custom-select__selected-text">{{ selectedOption.label }}</div>
      <div class="custom-select__arrow" :class="{ 'custom-select__arrow--up': dropdownVisible }"></div>
    </div>
    <ul class="custom-select__options" v-show="dropdownVisible">
      <li v-for="option in options" :key="option.value" class="custom-select__option" @click="selectOption(option)">
        {{ option.label }}
      </li>
    </ul>
  </div>
    <!-- <hr style="border-color: #f2f6fc" /> -->
    <ul class="nodes-bar">
      <!-- Vue组件 -->
      <li
        @mousedown="
          startDrag(
            // {
            //   label: 'Vue-node',
            //   shape: 'rect',
            //   actionType: 'Vue-node',
            // },
            {
              actionType: 'TRIGGER',
              label: 'Start',
              shape: 'ellipse',
            },
            $event
          )
        "
      >
        <VueNode :class="[freeze ? `freeze-rect` : `static-vue-node`]" />
      </li>
    </ul>
  </div>
</template>

<script>
import { Addon } from "@antv/x6";
import { Channel } from "../common/transmit";
import { ActionType, CustomEventTypeEnum } from "../common/enums";
import {
  getDiamondNode,
  getEllipseNode,
  getRectNode,
  getVueNode,
} from "../common/transform";
import { defineComponent, reactive, toRefs, watch } from "@vue/composition-api";
import { useGraph } from "../store";
import VueNode from "./vue-static-shape/VueNode.vue";




export default defineComponent({
  data() {
    return {
      selectedOption: { label: '请选择', value: '' },
      options: [
        { label: '选项一', value: 'option1' },
        { label: '选项二', value: 'option2' },
        { label: '选项三', value: 'option3' }
      ],
      dropdownVisible: false
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.dropdownVisible = false;
    }
  },
  props: ["nodes"],
  components: {
    VueNode,
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
        const { TRIGGER, CONDITION, ACTION } = ActionType;
        let json;
        switch (actionType) {
          // 触发器
          case TRIGGER:
            // json = getEllipseNode({
            //   shape,
            //   tooltip: label,
            //   size: { width: 100, height: 50 },
            //   actionType,
            //   initialization: true,
            // });
            json = getEllipseNode({
              shape,
              tooltip: label,
              // size: { width: 100, height: 50 },
              attrs: {label: {text: label}},
              data: {actionType: actionType},
              // actionType,
              initialization: true,
            });
            break;
          // 条件
          case CONDITION:
            // json = getDiamondNode({
            //   // x6 不存在 diamond 形状, 转义 rect
            //   shape: "rect",
            //   tooltip: label,
            //   actionType,
            //   initialization: true,
            // });
            json = getDiamondNode({
              // x6 不存在 diamond 形状, 转义 rect
              shape: "rect",
              tooltip: label,
              // actionType,
              attrs: {label: {text: label}},
              data: {actionType: actionType},
              initialization: true,
            });
            break;
          // 动作
          case ACTION:
            // json = getRectNode({
            //   shape,
            //   tooltip: label,
            //   size: { width: 100, height: 50 },
            //   actionType,
            //   initialization: true,
            // });
            json = getRectNode({
              shape,
              tooltip: label,
              // size: { width: 100, height: 50 },
              // actionType,
              attrs: {label: {text: label}},
              data: {actionType: actionType},
              initialization: true,
            });
            break;
          case "Vue-node":
            // json = getVueNode({
            //   shape: "rect",
            //   tooltip: label,
            //   size: { width: 110, height: 50 },
            //   actionType,
            //   initialization: true,
            // });
            json = getVueNode({
              shape: "rect",
              tooltip: label,
              // size: { width: 110, height: 50 },
              // actionType,
              attrs: {label: {text: label}},
              data: {actionType: actionType},
              initialization: true,
            });
            break;
          default:
            break;
        }
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

      // 静态vue节点
      .static-vue-node {
        transition: all 0.03s;
        &:hover {
          transform: scale(1.1) !important;
          color: #333;
        }
      }

      // 默认菱形
      .default-diamond {
        &:hover {
          transform: rotateZ(45deg) scale(1.1) !important;
        }
        span {
          transform: rotate(-45deg);
        }
      }

      [class^="freeze-"] {
        opacity: 0.7;
        cursor: no-drop;
      }
      .freeze-diamond {
        &:hover {
          transform: rotateZ(45deg) scale(1) !important;
        }
        span {
          transform: rotate(-45deg);
        }
      }
    }
  }
}

// 下拉框的样式
.custom-select {
  position: relative;
  top: 10px;
  left: 4px;
  width: 140px;
}

.custom-select__selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
}

.custom-select__selected-text {
  flex: 1;
}

.custom-select__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 4px 0 4px;
  border-color: #999 transparent transparent transparent;
  margin-left: 5px;
}

.custom-select__arrow--up {
  border-width: 0 4px 5px 4px;
  border-color: transparent transparent #999 transparent;
  margin-top: 5px;
  margin-bottom: -5px;
}

.custom-select__options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1;
}

.custom-select__option {
  padding: 5px;
  cursor: pointer;
}

.custom-select__option:hover {
  background-color: #f0f0f0;
}
</style>
