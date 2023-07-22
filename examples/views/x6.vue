<template>
  <div class="container">
    <!-- <div class="title-container">
      <el-link
        type="primary"
        href="https://github.com/g0ngjie/antv-x6-vue2"
        :underline="false"
        target="_blank"
        >antv-x6-vue2</el-link
      >
    </div> -->
    <div class="graph-container">
      <antv-x6-vue2 ref="graphContainer" @node-click="handleNodeClick">
        <div slot="panel_area_slot" slot-scope="{ row }">
          <el-form-item label="Label:">
            <el-input
              clearable
              placeholder="请输入"
              v-model="row.label"
            ></el-input>
          </el-form-item>
        </div>
      </antv-x6-vue2>
    </div>

    <div class="right-buttons">
      <button class="auto-layout-button" @click="handleAutoLayout">
        <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/autoLayout.png"/>
      </button>
      <button class="redo-button">
        <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/redo.png"/>
      </button>
      <button class="ok-button" @click="handleConfirmChanges">
        <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/ok.png"/>
      </button>

      <button id="emitTitleToParent" @click="emitTitleToParent"></button>
    </div>

    <div v-if="isSelected"  class="options-container">
      <!-- <el-button size="mini" :disabled="disabled" @click="handleClean"
        >Clear</el-button
      > -->
      <!-- <el-button size="mini" :disabled="disabled" @click="handleExportAtoms"
        >GetData</el-button
      > -->
      <!-- <el-button size="mini" :disabled="disabled" @click="handleExport"
        >Export</el-button
      > -->
      <!-- <el-button
        size="mini"
        :type="disabled ? 'danger' : ''"
        @click="handleOnlyLook"
        >Readonly</el-button
      > -->
      <!-- <el-button size="mini" :disabled="disabled" @click="handleSwitchDefault"
        >SwitchData</el-button
      > -->
      <!-- <el-button
        size="mini"
        :disabled="disabled"
        type="danger"
        @click="handleTestError"
        >Exception</el-button
      > -->
      <!-- <el-button
        size="mini"
        :disabled="disabled"
        type="danger"
        @click="handleAutoLayout"
        >autoLayout</el-button
      > -->

      <!-- <span class="node-name">{{ form.name }}</span> -->
      <span class="node-name">{{ form.name }}</span>

      <el-input
        clearable
        :disabled="!isUpdate"
        v-model="form.label"
        @keyup.enter.native="handleUpdateLabel"
        class="update-input"
      ></el-input>

      <!-- <textarea ref="textarea" v-model="userInput" placeholder="请输入内容" class="update-input" @keyup.enter.native="handleUpdateLabel"></textarea> -->

      <!-- <el-button 
        size="mini" 
        :disabled="!isUpdate" 
        @click="handleUpdateLabel" 
        class="bottom-button"
        >
        <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </el-button>

      <el-button
        size="big"
        :disabled="!isUpdate"
        @click="handleConfirmChanges"
        class="bottom-button"
        >
        <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </el-button> -->

      <button 
        @click="emitTitleToParent"
        class="bottom-button"
        >
        <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://127.0.0.1:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>


      <!-- <el-input
        size="mini"
        clearable
        :disabled="!isUpdate"
        v-model="form.label"
        style="width: 300px; margin: 10px 10px 0 0"
        @keyup.enter.native="handleUpdateLabel"
      ></el-input>
      <el-button size="mini" :disabled="!isUpdate" @click="handleUpdateLabel"
        >ChangeTheData</el-button
      > -->

      
      <!-- <div>
        <el-input
          size="mini"
          clearable
          :disabled="!isUpdate"
          v-model="form.label"
          style="width: 300px; margin: 10px 10px 0 0"
          @keyup.enter.native="handleUpdateLabel"
        ></el-input>
        <el-button size="mini" :disabled="!isUpdate" @click="handleUpdateLabel"
          >ChangeTheData</el-button
        >
      </div> -->
    </div>
  </div>
</template>

<script>
import { EventBus} from "./eventBus.js";
import * as mockData from "./data";
import { graphFunc } from "../../packages";
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from "@vue/composition-api";
import { Message } from "element-ui";
// import G6 from '@antv/g6';

let list = [
  // {
  //   nodes: mockData.nodes2,
  //   edges: mockData.edges2,
  // },
  {
    nodes: mockData.nodes1,
    edges: mockData.edges1,
  },
];

const mermaidCode = `graph TB
                                        r_01(["userRequest:羽毛球赛"])
                                        h_01["info:定义成员列表"]
                                        h_02["info:定义用于保存成员报名信息的reply对象，初始化为空"]
                                        r_01 --> h_01
                                        h_01 --> h_02
                                        f_01{{"forLoop:从members列表中取出当前的成员对象"}}
                                        h_02 --> f_01
                                        g_01["goto:前往当前成员座位"]
                                        f_01 --"处理当前member信息"--> g_01
                                        d_01["detectHuman"]
                                        g_01 --> d_01
                                        c_01{"condition: 是否在座位上"}
                                        d_01 --> c_01
                                        a_01["ask:询问当前成员本周六下午是否有空参加羽毛球赛"]
                                        c_01 --true--> a_01
                                        h_03["info:记录当前成员的参加情况"]
                                        a_01 --> h_03
                                        h_03 --> f_01
                                        h_04["info:记录当前成员的参加情况"]
                                        c_01 --false--> h_04
                                        h_04 --> f_01
                                        f_01 --"完成遍历循环"--> j_01
                                        j_01{{"loopEnd:退出循环"}}
                                        g_02["goto:前往客厅"]
                                        j_01 --> g_02
                                        s_01["speak:告知羽毛球赛的参与情况"]
                                        g_02 --> s_01
                                        f_02{{"forLoop:分别读出每个成员的报名情况"}}
                                        s_01 --> f_02
                                        s_02["speak:报告当前成员的报名情况"]
                                        f_02 --"处理当前成员的报名情况"--> s_02
                                        s_02 --> f_02
                                        f_02 --"完成遍历循环"--> j_02
                                        j_02{{"loopEnd:退出循环"}}
                                        k_01(["end:任务结束"])
                                        j_02 --> k_01
                                        `

export default defineComponent({
  setup() {
    const data = reactive({
      disabled: false,
      currentIndex: 0,
      isUpdate: false,
      isSelected: false,
      title: "",
      form: { label: "", name: "" , tooltip: ""},
      titleData: {
        title: 'X6 示例标题', // 假设这里有一个标题
      },
    });
    const computed = {
      showOptions() {
        // return data.isSelected;
        console.log("show: ", graphFunc.selectedNodes() > 0)
        data.isSelected = graphFunc.selectedNodes() > 0
        // return graphFunc.selectedNodes() > 0;4tt
      },
    };
    // const isSelected = computed(() => {
    //   return graphFunc.selectedNodes() > 0;
    // });
    const methods = {
      handleNodeClick(e) {
        console.log("[debug]节点单击Emit事件:", e);
      },
      handleExportAtoms() {  //[GetData]
        const data = graphFunc.getAtoms();  //获取graph上的数据
        console.log("[debug]data:", data);
        Message.success("Please view it on the console");
      },
      handleExport() {  //[Export]
        const { ok, errs } = graphFunc.graphValidate();
        if (ok) {
          const { nodesJSON, edgesJSON } = graphFunc.exportData();
          console.log("[debug]nodesJSON:", nodesJSON);
          console.log("[debug]edgesJSON:", edgesJSON);
          Message.success("Export succeeded. Please view it on the console");
        } else {
          console.log("[debug]errs:", errs);
          Message.error(errs[0]);
        }
      },
      handleOnlyLook() {  //[readOnly]
        data.disabled = !data.disabled;
        graphFunc.onlyLook(data.disabled);
      },
      switchData() {  //[SwitchData]
        const current = list[data.currentIndex++];
        if (data.currentIndex > list.length - 1) data.currentIndex = 0;
        return current;
      },
      handleSwitchDefault() {  //[SwitchData]
        const { nodes, edges } = methods.switchData();
        console.log("defaultData: node: ", nodes);
        // graphFunc.initDefaultData(nodes, edges);
        graphFunc.autoLayout(nodes, edges);
      },
      handleClean() {  //[Clear]
        graphFunc.clean();
      },
      handleTestError() {
        Message.error("Please view it on the console");
        graphFunc.initDefaultData();
      },
      handleUpdateLabel() {  //[ChangeTheData]
        console.log("handleUpdateLabel: ", data.form.label)
        graphFunc.updateNode(data.form);
        data.form.label = "";
        // data.isUpdate = false;
        data.isUpdate = true;
        const { nodes, edges } = graphFunc.getAtoms();
        // console.log("auto-nodes: ", nodes);
        graphFunc.autoLayout(nodes, edges);
        // data.isUpdate = false;
      },
      handleAutoLayout() {  //[AutoLayout]
        console.log("auto Layout！");
        //当用户点击“autoLayout”button之后，将整个流程图进行自动布局。
        // const { nodes, edges } = list[data.currentIndex];
        const { nodes, edges } = graphFunc.getAtoms();
        // console.log("auto-nodes: ", nodes);
        graphFunc.autoLayout(nodes, edges);
      },

      handleConfirmChanges() {  //[confirm the changes]
        const { ok, errs } = graphFunc.graphValidate();
        if (ok && data.isUpdate==true) {
          const { nodesJSON, edgesJSON } = graphFunc.exportData();
          const newMermaidCode = graphFunc.confirmChanges(nodesJSON, edgesJSON);
          EventBus.$emit("send-new-mermaid-data", newMermaidCode);
          // console.log(mermaidCode);

          Message.success("Export succeeded. Please view it on the console");
        } else {
          console.log("[debug]errs:", errs);
          // Message.error(errs[0]);
        }
      },

      getData(data=mermaidCode){
        // console.log("流程图的mermaid code: ", data);
        const {nodes,edges} = graphFunc.getListData(data);
        list = [{nodes,edges}];
        console.log("list:",list);
        // methods.emitTitleToParent();
      },

      getTitle(){
        data.title = list[0].nodes[0].attrs.label.text
        console.log("gettitle: ", data.title)
        const newTitle = data.title
        console.log("newTitle: ", newTitle)
        EventBus.$emit("send-new-title", newTitle);
      },

      emitTitleToParent() {
        data.titleData.title = list[0].nodes[0].attrs.label.text
        console.log("title: ", data.titleData.title)
        this.$emit('title-to-parent', this.titleData.title);
      },

      listener() {
        graphFunc.GraphListener.doubleNodeClick((detail) => {

          data.form.tooltip = detail.node.data.tooltip;
          data.form.label = detail.label;
          const parts = detail.node.data.tooltip.split(':');

          // const parts = detail.label.split(':');
          data.form.name = parts[0];   // 'name'
          data.form.label = parts[1]; // 'John'

          console.log("data.form: ", data.form)
          data.isUpdate = true;
          data.isSelected = true;
          console.log("[debug]detail:", detail);
        });
        graphFunc.GraphListener.runtimeError((err) => {
          console.log(
            "[debug]errorCode, errorMsg:",
            err.errorCode,
            err.errorMsg
          );
        });
      },
    };

    
    onMounted(() => {
      methods.getData();
      methods.getTitle();
      methods.handleSwitchDefault();
      methods.listener();
      computed.showOptions();
      // methods.handleAutoLayout();
      // 获取button元素
      var button = document.getElementById("emitTitleToParent");

      // 触发button的click函数
      button.click();

      EventBus.$on('callGetData', (payload) => {
        methods.getData(payload);
        methods.handleSwitchDefault();
      });
    });
    return {
      ...toRefs(data),
      ...methods,
      ...computed,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .title-container {
    text-align: center;
    padding: 5px 20px;
    background-color: #5AB2B8;    
    z-index: 5;
  }
  .el-link{
    color: #ffffff;
  }
}
.graph-container {
  height: 100%;
}
.options-container {
  padding: 0 10px;
  // background-color: antiquewhite;
}
.options-container {
  width: 501px;
  height: 90px;
  border-radius: 19px;
  border: 1px solid #B4B4B4;
  background: #FFF;
  z-index: 2;

  display: flex;
  // flex-direction: column;
  justify-content: center; /* 垂直方向居中对齐 */
  align-items: center; /* 水平方向居中对齐 */
  gap: 15px; /* 设置按钮之间的间距 */

  /* shadow */
  box-shadow: 0px 0px 6px 5px rgba(209, 209, 209, 0.25);
  flex-shrink: 0;
  position: absolute; /* 绝对定位 */
  bottom: 1%;
  left: 40%;
  transform: translate(-50%, -50%);
  .bottom-button {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background-color: #5AB2B8;
    border-radius: 100px;
    border: 2px solid #5AB2B8;
    filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.25));
  }
  .bottom-button img {
    width: 20px;
    height: 20px;
    padding: 5px;
  }
  
  .bottom-button:hover {
    background-color: #EEE;
    border-color: #999;
    border: 0px solid #fff;
    // color: #333;
  }

  .bottom-button:active {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  }
}

.right-buttons {
    position: absolute;
    top: 60px;
    right: 490px;
    z-index: 2;

    display: flex;
    flex-direction: column;
    justify-content: center; /* 垂直方向居中对齐 */
    align-items: center; /* 水平方向居中对齐 */
    gap: 20px; /* 设置按钮之间的间距 */
    
    .auto-layout-button {
      background-color: #FFF;
      width: 55px;
      height: 55px;
      border-radius: 109px; 
      border: 2px solid #fff;
      // flex-shrink: 0;
      // fill: #FFF;
      // stroke-width: 1px;
      // stroke: #FFF;
      filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));
    }

    .redo-button {
      background-color: #FFC0C0;
      width: 55px;
      height: 55px;
      border-radius: 109px; 
      border: 2px solid #FFC0C0;
      margin-top: 40px;
      // flex-shrink: 0;
      // fill: #FFF;
      // stroke-width: 1px;
      // stroke: #FFF;
      filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));
    }

    .ok-button {
      background-color: #5AB2B8;
      width: 55px;
      height: 55px;
      border-radius: 109px; 
      border: 2px solid #5AB2B8;
      // flex-shrink: 0;
      // fill: #FFF;
      // stroke-width: 1px;
      // stroke: #FFF;
      filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));
    }    
  }
.right-buttons button:hover {
  background-color: #EEE;
  border-color: #999;
  border: 0px solid #fff;
  // color: #333;
}

.right-buttons button:active {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
}

.update-input{
  width: 290px;
  height: 41px;
  flex-shrink: 0;
  // margin: 10px 10px 0 10px;
  padding: 10px;
  border-radius: 5px;
  // border: 1px solid #CFCFCF;
  background: #FFF;
}



.node-name{
  display: flex;
  width: 61px;
  height: 41px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #4F6C8F;
  text-align: center;
  font-family: Avenir;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
}
</style>