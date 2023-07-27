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
      <antv-x6-vue2 ref="graphContainer" @node-click="handleNodeClick" >
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
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/autoLayout.png"/>
      </button>
      <button  class="redo-button">
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/redo.png"/>
      </button>
      <button  class="ok-button" @click="handleConfirmChanges">
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/ok.png"/>
      </button>
      <button  class="nodesDebug-button" @click="handleNodesDebugging">
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/ok.png"/>
      </button>
      <button id="emitTitleToParent" @click="emitTitleToParent"></button>
    </div>
    <!-- <div v-if="isSelected"  class="options-container"> -->
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

    <!-- <div v-if="isSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>
      
      <el-input
        clearable
        :disabled="!isUpdate"
        v-model="form.label"
        @keyup.enter.native="handleUpdateLabel"
        class="update-input"
      ></el-input>

      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="variablesMenu" class="close-button">关闭菜单</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="checkbox" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
        <p>已选选项: {{ selectedOptions }}</p>
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>
    </div> -->

    <div v-if="isSpeakSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">引用变量</span>
          <el-input
            clearable
            :disabled="!isUpdate"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>

        <div class="middle-box-content">
          <span class="node-name">行为描述</span>
          <el-input
              clearable
              :disabled="!isUpdate"
              v-model="form.action"
              @keyup.enter.native="handleUpdateLabel"
              class="update-input"
            ></el-input>
        </div>
      </div>
      
      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="checkbox" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
        <!-- <p>已选选项: {{form.variable}},{{ selectedOptions }}</p> -->
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isAskSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">引用变量</span>
          <el-input
            clearable
            :disabled="!isUpdate"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>

        <div class="middle-box-content">
          <span class="node-name">行为描述</span>
          <el-input
              clearable
              :disabled="!isUpdate"
              v-model="form.action"
              @keyup.enter.native="handleUpdateLabel"
              class="update-input"
            ></el-input>
        </div>
      </div>
      
      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="checkbox" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
        <!-- <p>已选选项: {{form.variable}},{{ selectedOptions }}</p> -->
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isIfSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">引用变量</span>
          <el-input
            clearable
            :disabled="!isUpdate"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>

        <div class="middle-box-content">
          <span class="node-name">判断条件</span>
          <el-input
              clearable
              :disabled="!isUpdate"
              v-model="form.action"
              @keyup.enter.native="handleUpdateLabel"
              class="update-input"
            ></el-input>
        </div>
      </div>
      
      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="checkbox" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
        <!-- <p>已选选项: {{form.variable}},{{ selectedOptions }}</p> -->
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isGotoSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <!-- <span class="node-name">引用变量</span> -->
          <el-input
            clearable
            :disabled="!isUpdate"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-goto"
          ></el-input>
        </div>
      </div>
      
      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="checkbox" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
        <!-- <p>已选选项: {{form.variable}},{{ selectedOptions }}</p> -->
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isDetectHumanSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>
    </div>

    <div v-if="isEndSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>
    </div>

    <div v-if="isLoopEndSelected"  class="options-container">
      <span class="node-name">{{ form.name }}</span>
    </div>

    <div v-if="isUserRequestSelected"  class="options-container">
      <span class="node-name-user-request">{{ form.name }}</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <!-- <span class="node-name">引用变量</span> -->
          <el-input
            clearable
            :disabled="!isUpdate"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-goto"
          ></el-input>
        </div>
      </div>
      
      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="checkbox" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
        <!-- <p>已选选项: {{form.variable}},{{ selectedOptions }}</p> -->
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isForSelected"  class="options-container">
      <span class="node-name node-name-for">{{ form.name }}</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">遍历</span>
          <el-input
            clearable
            :disabled="!isUpdate"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-goto"
          ></el-input>
        </div>
      </div>
      
      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="checkbox" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
        <!-- <p>已选选项: {{form.variable}},{{ selectedOptions }}</p> -->
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/yes.png">
      </button>
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
                      r_01(["userRequest:巡逻任务"])
                      h_01["info:定义地点列表，赋值为“小明的座位，小绿的座位，小白的座位，客厅，充电桩”;地点列表"]
                      f_01{{"forLoop:地点列表"}}
                      g_01["goto:地点列表[i]"]
                      d_01["detectHuman"]
                      c_01{"condition: 是否在当前地点检测到人;人员检测结果"}
                      s_01["speak:在当前地点检测到人类;地点列表[i]"]
                      s_02["speak:在当前地点没有检测到人类;地点列表[i]"]
                      j_01{{"loopEnd:循环结束"}}
                      g_02["goto:充电桩"]
                      s_03["speak:告知任务完成，并返回充电"]
                      k_01(["end:任务结束"])

                      r_01 --> h_01
                      h_01 --> f_01
                      f_01 --处理当前位置信息--> g_01
                      g_01 --> d_01
                      d_01 --> c_01
                      c_01 --true--> s_01
                      s_01 --> f_01
                      c_01 --false--> s_02
                      s_02 --> f_01
                      f_01 --完成遍历循环--> j_01
                      j_01 --> g_02
                      g_02 --> s_03
                      s_03 --> k_01`
export default defineComponent({
  setup() {
    const data = reactive({
      isMenuOpen: false,
      selectedOptions: [],
      disabled: false,
      currentIndex: 0,
      isUpdate: false,
      isSelected: false,
      isSpeakSelected: false,
      isAskSelected: false,
      isIfSelected: false,
      isGotoSelected: false,
      isDetectHumanSelected: false,
      isEndSelected: false,
      isLoopEndSelected: false,
      isUserRequestSelected: false,
      isForSelected: false,
      title: "",
      form: { label: "", name: "" , tooltip: "", variable: "", action: ""},
      variables: { all: ["21"]},
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
        data.isSelected = false
        data.isSpeakSelected = false
        data.isAskSelected = false
        data.isIfSelected = false
        data.isGotoSelected = false
        data.isDetectHumanSelected = false
        data.isEndSelected = false
        data.isLoopEndSelected = false
        data.isUserRequestSelected = false
        data.isForSelected = false
        data.isMenuOpen = false
      },
      handleNodeSelect(e) {
        console.log("[debug]节点选中Emit事件:", e);
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

      // 实现自动布局
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
        console.log("handleUpdateLabel: ", data.form.action)
        console.log("handleUpdateLabel: ", data.form.variable)

        data.form.label = data.form.action + ";" + data.form.variable
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

      // 暂时先去掉验证
      handleConfirmChanges() {  //[confirm the changes]
        // const { ok, errs } = graphFunc.graphValidate();
        // if (ok && data.isUpdate==true) {
        //   const { nodesJSON, edgesJSON } = graphFunc.exportData();
        //   const newMermaidCode = graphFunc.confirmChanges(nodesJSON, edgesJSON);
        //   EventBus.$emit("send-new-mermaid-data", newMermaidCode);
        //   // console.log(mermaidCode);

        //   Message.success("Export succeeded. Please view it on the console");
        // } else {
        //   console.log("[debug]errs:", errs);
        //   // Message.error(errs[0]);
        // }

          const { nodesJSON, edgesJSON } = graphFunc.exportData();
          const newMermaidCode = graphFunc.confirmChanges(nodesJSON, edgesJSON);
          EventBus.$emit("send-new-mermaid-data", newMermaidCode);
          // console.log(mermaidCode);
      },

      handleNodesDebugging() {

      },

      // 从mermaid code中获取数据并处理为 x6 graph的数据格式 as list
      getData(mCode=mermaidCode){
                           // console.log("流程图的mermaid code: ", data);
        const {nodes,edges, variables} = graphFunc.getListData(mCode);
        list = [{nodes,edges}];
        console.log("list:",list);
        data.variables.all = variables['all']
        console.log("variables: ", data.variables.all);
        // methods.emitTitleToParent();
      },

      getTitle(){
        data.title = list[0].nodes[0].attrs.label.text
        console.log("gettitle: ", data.title)
        const newTitle = data.title
        console.log("newTitle: ", newTitle)
        EventBus.$emit("send-new-title", newTitle);
      },

      variablesMenu(){
        this.isMenuOpen = !this.isMenuOpen;
      },

      confirmAddVariable(){
        console.log("确认添加这些变量")
        console.log(this.selectedOptions);
        this.selectedOptions = this.selectedOptions.join(";")
        if (data.form.variable.length != 0) {
          data.form.variable = data.form.variable + ";" + this.selectedOptions;
        } else {
          data.form.variable = data.form.variable + this.selectedOptions;
        }
      },

      emitTitleToParent() {
        data.titleData.title = list[0].nodes[0].attrs.label.text
        console.log("title: ", data.titleData.title)
        this.$emit('title-to-parent', this.titleData.title);
      },

      listener() {
        graphFunc.GraphListener.doubleNodeClick((detail) => {
          console.log("detail: ", detail)
          data.form.variable = ""
          data.form.action = ""
          data.form.tooltip = detail.node.data.tooltip;
          data.form.label = detail.label;

          console.log("[debug]detail.node.data.tooltip:", detail.node.data.tooltip);
          const parts = detail.node.data.tooltip.split(':');

          if (parts.length === 2) {
            data.form.name = parts[0].trim();
            data.form.label = parts[1].trim();
          } else {
            data.form.name = detail.node.data.tooltip.trim();
            data.form.label = '未设定';
          }

          const parts2 = data.form.label.split(";");
          data.form.action = parts2[0];
          
          for (let index = 1; index < parts2.length; index++) {
              data.form.variable = data.form.variable + " " + parts2[index];
          }
          
          console.log("data.form: ", data.form)
          data.isUpdate = true;

          if (data.form.name == 'speak') {
            data.isSpeakSelected = true
          }
          if (data.form.name == 'ask') {
            data.isAskSelected = true            
          }
          if (data.form.name == 'goto') {
            data.isGotoSelected = true
          }
          if (data.form.name == 'condition') {
            data.isIfSelected = true
          }
          if (data.form.name == 'detectHuman') {
            data.isDetectHumanSelected = true
          }
          if (data.form.name == 'loopEnd') {
            data.isLoopEndSelected = true            
          }
          if (data.form.name == 'end') {
            data.isEndSelected = true
          }
          if (data.form.name == 'userRequest') {
            data.isUserRequestSelected = true
          }
          if (data.form.name == 'forLoop') {
            data.isForSelected = true
          }
          

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
    top: 8%;
    right: 29%;
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
    
    .nodesDebug-button{
        background-color: #675AB8;
        width: 55px;
        height: 55px;
        border-radius: 109px; 
        border: 2px solid #675AB8;
        margin-top: 140px;
        // flex-shrink: 0;
        // fill: #FFF;
        // stroke-width: 1px;
        // stroke: #FFF;
        filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));     
    }
  }
.right-buttons button:hover {
  // background-color: #EEE;
  // border-color: #999;
  transform: scale(1.1) !important;
  // border: 0px solid #fff;
  // color: #333;
}

.right-buttons button:active {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
}

.input-container {
  /* 设置父元素的高度，可以根据需求自行调整 */
  height: 22px;
}
/* 使用 ::v-deep 来覆盖 el-input 内部的 input 元素样式 */
::v-deep .update-input input {
  /* 设置 input 元素的高度为 20px */
  height: 22px;
  /* 控制文本垂直居中 */
  line-height: 22px;
  /* 可选：调整字体大小 */
  font-size: 12px; /* 可根据需要调整字体大小 */
  padding-right: 15px;
}

.update-input{
  width: 250px;
  height: 22px;
  /* 控制文本垂直居中 */
  line-height: 22px;
  /* 可选：调整字体大小 */
  font-size: 12px; /* 可根据需要调整字体大小 */
  flex-shrink: 0;
  // margin: 10px 10px 0 10px;
  // padding: 10px;
  border-radius: 5px;
  // border: 1px solid #CFCFCF;
  background: #FFF;
}
::v-deep .update-input-yinyong input {
  /* 设置 input 元素的高度为 20px */
  height: 22px;
  /* 控制文本垂直居中 */
  line-height: 22px;
  /* 可选：调整字体大小 */
  font-size: 12px; /* 可根据需要调整字体大小 */
  padding-right: 15px;
  color: #6D9862;
  border: 0px;
  font-weight: bold;
}

.update-input-yinyong{
  width: 250px;
  height: 22px;
  /* 控制文本垂直居中 */
  line-height: 22px;
  /* 可选：调整字体大小 */
  font-size: 12px; /* 可根据需要调整字体大小 */
  flex-shrink: 0;
  // margin: 10px 10px 0 10px;
  // padding: 10px;
  // border-radius: 5px;
  border: 0px;
  background: #FFF;
}
.update-input-goto{
  width: 250px;
  height: 22px;
  /* 控制文本垂直居中 */
  line-height: 22px;
  /* 可选：调整字体大小 */
  font-size: 12px; /* 可根据需要调整字体大小 */
  flex-shrink: 0;
  // margin: 10px 10px 0 10px;
  // padding: 10px;
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  border: 2px solid #3e3b3b;
  border: 0px;
  background: #FFF;
}

::v-deep .update-input-goto input {
  /* 设置 input 元素的高度为 20px */
  height: 22px;
  /* 控制文本垂直居中 */
  line-height: 22px;
  /* 可选：调整字体大小 */
  font-size: 12px; /* 可根据需要调整字体大小 */
  padding-right: 15px;
  color: #6D9862;
  border: 0px;
  font-weight: bold;

  border-radius: 5px;
  border: 1px solid #FBFBFB;
  // background: #FFF;
  /* shadow */
  box-shadow: 0px 0px 6px 5px rgba(209, 209, 209, 0.25);
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
  margin-right: 5px;
}
.node-name-for {
  color: #B16C9D;
}
.node-name-user-request{
  display: flex;
  width: 61px;
  height: 41px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #CCC74D;
  text-align: center;
  font-family: Avenir;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-right: 5px;
}
.menu {
  position: absolute;
  top: calc(100% - 250px);
  right: 25px;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
}

.close-button {
  margin-top: 10px;
}

.menu-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-top: 5px;
}

.middle-box-content{
  display: flex;
  align-items: center; /* 垂直居中 */
}
</style>