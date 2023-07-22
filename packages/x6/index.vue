<template>
  <div class="graph-container">
    <!-- 工具栏 -->
    <!-- <div class="toolbar-container">
      <Toolbar />
    </div> -->
    <div class="layout">
      <!-- 组件栏 -->
      <div class="left-node-bar-container">
        <NodesBar :nodes="nodes"></NodesBar>
      </div>
      <!-- <div class="right-buttons">
        <button class="auto-layout-button">
          <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/autoLayout.png"/>
        </button>
        <button class="redo-button">
          <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/redo.png"/>
        </button>
        <button class="ok-button">
          <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/ok.png"/>
        </button>
      </div> -->
      <!-- 图形容器 -->
      <div id="container" class="graph-main-container" />
      <!-- 可操作区 -->
      <!-- <div class="panel-area-container">
        <PanelArea>
          <template slot-scope="{ row }">
            <slot :name="panelAreaName" :row="row" />
          </template>
        </PanelArea>
      </div> -->
    </div>
  </div>
</template>

<script>
import registerTools from "./tools/registerTools.js";
// import registerNode from "./shape/registerNode";
import { initGraph } from "./common/graph";
import NodesBar from "./components/NodesBar.vue";
import PanelArea from "./components/PanelArea.vue";
import Toolbar from "./components/Toolbar/index.vue";
import { nodes } from "./common/nodesBar";
import { Config, CustomEventTypeEnum } from "./common/enums.js";
import { Channel } from "./common/transmit.js";

import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from "@vue/composition-api";

export default defineComponent({
  name: "AntvX6Vue2",
  components: {
    NodesBar,
    PanelArea,
    Toolbar,
  },
  setup(_, { emit }) {
    const data = reactive({
      nodes,
      // 可操作去插槽
      panelAreaName: Config.PANEL_AREA_SLOT,
    });

    // 监听
    // emit 节点单击
    Channel.eventListener(CustomEventTypeEnum.NODE_CLICK, (detail) =>
      emit("node-click", detail)
    );
    // emit 节点双击
    Channel.eventListener(CustomEventTypeEnum.DOUBLE_NODE_CLICK, (detail) =>
      emit("node-dblclick", detail)
    );

    onMounted(() => {
      // 注册节点
      // registerNode();
      // 注册工具
      registerTools();
      // 实例化x6
      initGraph();
    });

    return {
      ...toRefs(data),
    };
  },
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.graph-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  .toolbar-container {
    position: absolute;
    width: 100%;
    z-index: 999;
    height: 30px;
    background-color: #fff;
  }
}
.layout {
  // display: flex;
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  // padding: 0 10px 10px 10px;
  // margin-top: 30px;
  position: relative;

  .graph-main-container {
    width: 100%;
    height: 100%;
    flex: 1;
  }

  .left-node-bar-container {
    position: absolute;
    top: 0px;
    left: 8px;
    width: 180px;
    height: 413px;
    z-index: 2;
    border-radius: 9px; 
    // border: 1px solid #B4B4B4;
  }

  // .right-buttons {
  //   position: absolute;
  //   top: 19px;
  //   right: 20px;
  //   z-index: 2;

  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center; /* 垂直方向居中对齐 */
  //   align-items: center; /* 水平方向居中对齐 */
  //   gap: 20px; /* 设置按钮之间的间距 */
    
  //   .auto-layout-button {
  //     background-color: #FFF;
  //     width: 55px;
  //     height: 55px;
  //     border-radius: 109px; 
  //     border: 2px solid #fff;
  //     // flex-shrink: 0;
  //     // fill: #FFF;
  //     // stroke-width: 1px;
  //     // stroke: #FFF;
  //     filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));
  //   }

  //   .redo-button {
  //     background-color: #FFC0C0;
  //     width: 55px;
  //     height: 55px;
  //     border-radius: 109px; 
  //     border: 2px solid #FFC0C0;
  //     margin-top: 40px;
  //     // flex-shrink: 0;
  //     // fill: #FFF;
  //     // stroke-width: 1px;
  //     // stroke: #FFF;
  //     filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));
  //   }

  //   .ok-button {
  //     background-color: #5AB2B8;
  //     width: 55px;
  //     height: 55px;
  //     border-radius: 109px; 
  //     border: 2px solid #5AB2B8;
  //     // flex-shrink: 0;
  //     // fill: #FFF;
  //     // stroke-width: 1px;
  //     // stroke: #FFF;
  //     filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));
  //   }
  // }

  .panel-area-container {
    position: absolute;
    // width: 80px;
    // height: 80px;
    bottom: 0;
    right: 0;
  }
  
}

.x6-node {
  [magnet="true"] {
    cursor: crosshair;
    transition: none;

    &[port-group="in"] {
      cursor: move;
    }
  }

  .x6-port-body {
    visibility: hidden;
  }
}

// 选中后样式加粗标识
.begin-node-selected {
  ellipse {
    fill: #7aa4f7;
    stroke-width: 2;
  }
}

.condition-node-selected {
  rect {
    fill: #7aa4f7;
    stroke-width: 2;
  }
}

.tail-node-selected {
  rect {
    fill: #7aa4f7;
    stroke-width: 2;
  }
}

// 连接点交互
circle[data-class="choice-point"]:hover {
  transition: all 0.01s;
  r: 10;
}
</style>

