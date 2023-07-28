<template>
  <div class="container">
    <!-- <div class="mode">
      <button class="mode-button">{{ mode }}</button>
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
        <img src="http://localhost:5500/packages/icons/autoLayout.png"/>
      </button>
      <button v-if="isSelected" class="redo-button" @click="handleMagicUpdate">
        <img src="http://localhost:5500/packages/icons/redo.png"/>
      </button>

      <button v-if="!isSelected" class="redo-button redo-button-unselected">
        <img src="http://localhost:5500/packages/icons/redo.png"/>
      </button>

      <button v-if="isUpdate" class="ok-button" @click="handleConfirmChanges">
        <img src="http://localhost:5500/packages/icons/ok.png"/>
      </button>
      <button v-if="!isUpdate" class="ok-button ok-button-unupdated" @click="handleConfirmChanges">
        <img src="http://localhost:5500/packages/icons/ok.png"/>
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
        <img src="http://localhost:5500/packages/icons/{a}.png">
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
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div> -->

    <div v-if="isSpeakSelected"  class="options-container">
      <span class="node-name">说话</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">引用变量</span>
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>

        <div class="middle-box-content">
          <span class="node-name">行为描述</span>
          <el-input
              clearable
              :disabled="!isSelected"
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
        <img src="http://localhost:5500/packages/icons/{a}.png">
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
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isAskSelected"  class="options-container">
      <span class="node-name">询问</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">引用变量</span>
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>

        <div class="middle-box-content">
          <span class="node-name">行为描述</span>
          <el-input
              clearable
              :disabled="!isSelected"
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
        <img src="http://localhost:5500/packages/icons/{a}.png">
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
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isIfSelected"  class="options-container">
      <span class="node-name node-name-if">判断</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">引用变量</span>
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>

        <div class="middle-box-content">
          <span class="node-name">判断条件</span>
          <el-input
              clearable
              :disabled="!isSelected"
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
        <img src="http://localhost:5500/packages/icons/{a}.png">
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
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isGotoSelected"  class="options-container">
      <span class="node-name">前往</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <!-- <span class="node-name">引用变量</span> -->
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.label"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>
      </div>

      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in gotoVariables" :key="option" class="menu-item">
            <label>
              <input type="radio" :value="option" v-model="selectedOptions">
              {{ option }}
            </label>
          </li>
        </ul>
      </div>

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isDetectHumanSelected"  class="options-container options-container-end">
      <span class="node-name">人物检测</span>
    </div>

    <div v-if="isEndSelected"  class="options-container options-container-end">
      <span class="node-name node-name-end">服务结束</span>
    </div>

    <div v-if="isLoopEndSelected"  class="options-container options-container-loop-end">
      <span class="node-name node-name-loop-end">退出循环</span>
    </div>

    <div v-if="isUserRequestSelected"  class="options-container">
      <span class="node-name node-name-user-request">服务启动词</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <!-- <span class="node-name">引用变量</span> -->
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.label"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-goto"
          ></el-input>
        </div>
      </div>
      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isForSelected"  class="options-container">
      <span class="node-name node-name-for">循环</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">遍历</span>
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.label"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>
      </div>
      
      <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/packages/icons/{a}.png">
      </button>

      <div v-if="isMenuOpen" class="menu">
        <button @click="confirmAddVariable" class="close-button">确认添加</button>
        <ul class="menu-list">
          <li v-for="option in variables.all" :key="option" class="menu-item">
            <label>
              <input type="radio" :value="option" v-model="selectedOptions">
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
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isInfoDeclareSelected"  class="options-container">
      <span class="node-name node-name-info-declare">创建变量</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">变量名称</span>
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.label"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-goto"
          ></el-input>
        </div>
      </div>
      
      <!-- <button 
        @click="variablesMenu"
        class="bottom-button"
        >
        <img src="http://localhost:5500/packages/icons/{a}.png">
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
      </div> -->

      <button
        @click="handleUpdateLabel"
        class="bottom-button"
        >
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>

    <div v-if="isInfoAssignSelected"  class="options-container">
      <span class="node-name node-name-info-assign">变量赋值</span>

      <div class="middle-box">
        <div class="middle-box-content">
          <span class="node-name">引用变量</span>
          <el-input
            clearable
            :disabled="!isSelected"
            v-model="form.variable"
            @keyup.enter.native="handleUpdateLabel"
            class="update-input-yinyong"
          ></el-input>
        </div>

        <div class="middle-box-content">
          <span class="node-name">变量操作</span>
          <el-input
              clearable
              :disabled="!isSelected"
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
        <img src="http://localhost:5500/packages/icons/{a}.png">
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
        <img src="http://localhost:5500/packages/icons/yes.png">
      </button>
    </div>


  </div>
</template>

<script>
import { EventBus} from "./eventBus.js";
// import * as mockData from "./data";
import { graphFunc } from "../../packages";
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from "@vue/composition-api";
import { Message } from "element-ui";
import { session } from "./SessionRecording.js";
// import G6 from '@antv/g6';

// let list = [
//   // {
//   //   nodes: mockData.nodes2,
//   //   edges: mockData.edges2,
//   // },
//   {
//     nodes: mockData.nodes1,
//     edges: mockData.edges1,
//   },
// ];
let list = [];
const mermaidCode =  `graph TB
  r_01(["userRequest:预约开会"])
  id_01["infoDeclare:用户回复，地点，目标成员"]
  a_01["ask:询问用户想找哪个实验室成员开会"]
  ia_01["infoAssign:将用户回复赋值为目标成员;目标成员"]
  g_01["goto:目标成员的座位"]
  d_01["detectHuman"]
  c_01{"condition: 检测到人;人员检测结果1"}
  a_02["ask:询问目标成员是否有时间参会;目标成员"]
  ia_02["infoAssign:将用户回复赋值为是否有时间;用户回复1"]
  c_02{"condition: 目标成员有时间参会;用户回复1"}
  a_03["ask:询问目标成员想在哪里开会"]
  ia_03["infoAssign:将用户回复赋值为地点;地点"]
  ia_04["infoAssign:将目标成员有时间开会，他选择的地点是地点赋值为用户回复;用户回复"]
  ia_05["infoAssign:将目标成员没有时间开会赋值为用户回复;用户回复"]
  s_01["speak:感谢目标成员的回复"]
  ia_06["infoAssign:将目标成员不在座位上赋值为用户回复;用户回复"]
  g_02["goto:客厅"]
  s_02["speak:告知用户预约结果;用户回复"]
  k_01(["end:任务结束"])

  r_01 --> id_01 
  id_01 --> a_01
  a_01 --> ia_01
  ia_01 --> g_01
  g_01 --> d_01
  d_01 --> c_01
  c_01 --true--> a_02
  a_02 --> ia_02
  ia_02 --> c_02
  c_02 --true--> a_03
  a_03 --> ia_03
  ia_03 --> ia_04
  c_02 --false--> ia_05
  ia_04 --> s_01
  ia_05 --> s_01
  c_01 --false--> ia_06
  ia_06 --> s_01
  s_01 --> g_02
  g_02 --> s_02
  s_02 --> k_01`
// const mermaidCode = `graph TB
//                       r_01(["userRequest:巡逻任务"])
//                       h_01["info:定义地点列表，赋值为“小明的座位，小绿的座位，小白的座位，客厅，充电桩”;地点列表"]
//                       f_01{{"forLoop:地点列表"}}
//                       g_01["goto:地点列表[i]"]
//                       d_01["detectHuman"]
//                       c_01{"condition: 是否在当前地点检测到人;人员检测结果"}
//                       s_01["speak:在当前地点检测到人类;地点列表[i]"]
//                       s_02["speak:在当前地点没有检测到人类;地点列表[i]"]
//                       j_01{{"loopEnd:循环结束"}}
//                       g_02["goto:充电桩"]
//                       s_03["speak:告知任务完成，并返回充电"]
//                       k_01(["end:任务结束"])

//                       r_01 --> h_01
//                       h_01 --> f_01
//                       f_01 --处理当前位置信息--> g_01
//                       g_01 --> d_01
//                       d_01 --> c_01
//                       c_01 --true--> s_01
//                       s_01 --> f_01
//                       c_01 --false--> s_02
//                       s_02 --> f_01
//                       f_01 --完成遍历循环--> j_01
//                       j_01 --> g_02
//                       g_02 --> s_03
//                       s_03 --> k_01`
export default defineComponent({
  setup() {
    const data = reactive({
      // mode: "预览模式",
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
      isInfoDeclareSelected: false,
      isInfoAssignSelected: false,
      title: "",
      form: { label: "", name: "" , tooltip: "", variable: "", action: ""},
      variables: { all: ["21"]},
      gotoVariables: ["接待区", "会议室", "员工办公区", "领导办公室", "创作室", "健身房", "会客厅", "茶水间"],
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
        data.isInfoDeclareSelected = false
        data.isInfoAssignSelected = false
        data.isMenuOpen = false

        session.recording("nodeClick", e.label);
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
        data.isMenuOpen = false
        console.log("handleUpdateLabel: ", data.form)
        // if (data.form.name != 'goto' && data.form.name != "forLoop" && data.form.name != "userRequest") {
        //   data.form.label = data.form.action + ";" + data.form.variable        
        // }
        // if (data.form.name != 'GOTO' && data.form.name != "FORLOOP" && data.form.name != "USERREQUEST") {
        //   // data.form.label = data.form.action + ";" + data.form.variable    
        //   data.form.label = data.form.label + ";" + data.form.variable    
        // }

        if (data.form.name == 'SPEAK' || data.form.name == 'ASK' || data.form.name == 'IF' || data.form.name == 'INFOASSIGN') {
          data.form.label = data.form.action + ";" + data.form.variable    
        }

        console.log("handleUpdateLabel: ", data.form.label)
        graphFunc.updateNode(data.form);
        data.form.label = "";
        // data.isUpdate = false;
        data.isUpdate = true;
        // const { nodes, edges } = graphFunc.getAtoms();
        // console.log("auto-nodes: ", nodes);
        // graphFunc.autoLayout(nodes, edges);
        // data.isUpdate = false;

        session.recording("Node update", data.form);
        Message.success("节点内容修改成功！")
      },
      handleAutoLayout() {  //[AutoLayout]
        console.log("auto Layout！");
        //当用户点击“autoLayout”button之后，将整个流程图进行自动布局。
        // const { nodes, edges } = list[data.currentIndex];
        const { nodes, edges } = graphFunc.getAtoms();
        // console.log("auto-nodes: ", nodes);
        graphFunc.autoLayout(nodes, edges);
        session.recording("AutoLayout", "自动布局");
        Message.success("自动布局已完毕！");
      },

      handleConfirmChanges() {  //[confirm the changes]
        const { ok, errs } = graphFunc.graphValidate();
        if (ok && data.isUpdate==true) {
          const { nodesJSON, edgesJSON } = graphFunc.exportData();
          const nodes = nodesJSON
          const edges = edgesJSON
          list = [{nodes, edges}];
          console.log("list changes: ", list)
          const newMermaidCode = graphFunc.confirmChanges(nodesJSON, edgesJSON);
          EventBus.$emit("send-new-mermaid-data", newMermaidCode);
          // console.log(mermaidCode);

          Message.success("确认所有修改，生成新的代码！");

          // Message.success("Export succeeded. Please view it on the console");

          document.getElementById("emitTitleToParent").click()       

          data.isUpdate = false
        } else {
          console.log("[debug]errs:", errs);
          // Message.error(errs[0]);
        }
      },

      handleMagicUpdate() { //魔法棒修改
        const selectedCells = graphFunc.magicUpdate()
        console.log("selectedCells: ", selectedCells)
        if (selectedCells.length >= 1) {
          EventBus.$emit("magic-selected-cells", selectedCells);

          //session.recording("Graph+LLM update", "magicUpdate");

          Message.success("魔法棒施法成功，将生成该节点的文字解释！");
        }else {
          Message.success("魔法棒施法失败...");
        }
      },

      getData(mCode=mermaidCode){
        // console.log("流程图的mermaid code: ", data);
        const {nodes, edges, variables} = graphFunc.getListData(mCode);
        list = [{nodes,edges}];
        console.log("list:", list);
        data.variables.all = variables['all']
        // console.log("variables: ", data.variables.all);

        data.gotoVariables = [...new Set([...data.gotoVariables, ...data.variables.all])]
        // methods.emitTitleToParent();
      },

      getTitle(){
        data.title = list[0].nodes[0].attrs.label.text
        console.log("getTitle: ", list[0])
        for (let index = 0; index < list[0].length; index++) {
          const actionType = list[0].nodes[index].data.actionType;
          if (actionType == 'USERREQUEST') {
            data.title = list[0].nodes[index].attrs.label.text
          }          
        }
        console.log("gettitle: ", data.title)
        const newTitle = data.title
        console.log("newTitle: ", newTitle)
        EventBus.$emit("send-new-title", newTitle);
      },

      variablesMenu(){
        this.isMenuOpen = !this.isMenuOpen;
      },

      computedValue() {
        return this.form.label.replace(this.form.variable, "");
      },

      confirmAddVariable(){
        // console.log("确认添加这些变量")
        // console.log(this.selectedOptions);
        // console.log("form.name: ", data.form.name)
        if (data.form.name == 'GOTO' || data.form.name == 'FORLOOP') {
          data.form.label = this.selectedOptions;
          this.selectedOptions = []
        }else {
          this.selectedOptions = this.selectedOptions.join(";")
          if (data.form.variable.length != 0) {
            data.form.variable = data.form.variable + ";" + this.selectedOptions;
          } else {
            data.form.variable = data.form.variable + this.selectedOptions;
          }
          this.selectedOptions = []
        }
        console.log("data.form.variable: ", data.form.variable)
        session.recording("Node update -- variable", data.form);
        Message.success("变量修改成功！");
        data.isMenuOpen = false
      },
      // confirmGotoVariable(){
      //   console.log("确认添加这些变量")
      //   console.log(this.selectedOptions);
      //   data.form.label = this.selectedOptions;
      //   this.selectedOptions = []
      // },
      // confirmForVariable(){
      //   console.log("确认添加这些变量")
      //   console.log(this.selectedOptions);
      //   data.form.label = this.selectedOptions;
      //   this.selectedOptions = []
      // },
      emitTitleToParent() {
        data.titleData.title = list[0].nodes[0].attrs.label.text
        console.log("title: ", data.titleData.title)
        this.$emit('title-to-parent', this.titleData.title);
      },
      listener() {
        graphFunc.GraphListener.doubleNodeClick((detail) => {
          console.log("detail: ", detail.node.data)
          data.form.variable = ""
          data.form.action = ""
          data.form.tooltip = detail.node.data.tooltip;
          data.form.label = detail.label;
          // const parts = detail.node.data.tooltip.split(':');

          // // const parts = detail.label.split(':');
          // data.form.name = parts[0];   // 'name'
          // if (parts[1]) {
          //   data.form.label = parts[1]; // 'John'
          // }else{
          //   data.form.label = "";  //赋值为空
          // }

          data.form.name = detail.node.data.actionType
          // console.log("name: ", data.form.name)
          if (data.form.label) {
            // console.log("listen:label: ", data.form.label)

            if (data.form.label == 'goto') {
              data.form.variable = "接待区 会议室 开放办公空间 管理员办公室 教师办公室 小莉的座位 数字媒体创作室 健身房 会客厅 茶水间 展陈区 开放办公空间"
            }else {
              const parts2 = data.form.label.split(";");
              data.form.action = parts2[0];
              for (let index = 1; index < parts2.length; index++) {
                data.form.variable = data.form.variable + " " + parts2[index];
              }
            }
          }
          console.log("data.form: ", data.form)
          // data.isUpdate = true;

          // if (data.form.name == 'speak') {
          //   data.isSpeakSelected = true
          // }
          // if (data.form.name == 'ask') {
          //   data.isAskSelected = true            
          // }
          // if (data.form.name == 'goto') {
          //   data.isGotoSelected = true
          // }
          // if (data.form.name == 'condition') {
          //   data.isIfSelected = true
          // }
          // if (data.form.name == 'detectHuman') {
          //   data.isDetectHumanSelected = true
          // }
          // if (data.form.name == 'loopEnd') {
          //   data.isLoopEndSelected = true            
          // }
          // if (data.form.name == 'end') {
          //   data.isEndSelected = true
          // }
          // if (data.form.name == 'userRequest') {
          //   data.isUserRequestSelected = true
          // }
          // if (data.form.name == 'forLoop') {
          //   data.isForSelected = true
          // }
          // if (data.form.name == 'infoDeclare') {
          //   data.isInfoDeclareSelected = true
          // }
          // if (data.form.name == 'infoAssign') {
          //   data.isInfoAssignSelected = true
          // }
          if (data.form.name == 'SPEAK') {
            data.isSpeakSelected = true
          }
          if (data.form.name == 'ASK') {
            data.isAskSelected = true            
          }
          if (data.form.name == 'GOTO') {
            data.isGotoSelected = true
          }
          if (data.form.name == 'IF') {
            data.isIfSelected = true
          }
          if (data.form.name == 'DETECTHUMAN') {
            data.isDetectHumanSelected = true
          }
          if (data.form.name == 'FOR') {
            data.isForSelected = true            
          }
          if (data.form.name == 'END') {
            data.isEndSelected = true
          }
          if (data.form.name == 'USERREQUEST') {
            data.isUserRequestSelected = true
          }
          if (data.form.name == 'LOOPEND') {
            data.isLoopEndSelected = true
          }
          if (data.form.name == 'INFODECLARE') {
            data.isInfoDeclareSelected = true
          }
          if (data.form.name == 'INFOASSIGN') {
            data.isInfoAssignSelected = true
          }

          data.isSelected = true;
          console.log("[debug]detail:", detail);
        });

        graphFunc.GraphListener.nodeClick((detail) => {
          console.log("单击detail: ", detail)
          const cellCount = graphFunc.magicUpdate()
          // console.log("cellCount: ", cellCount.length)
          if (cellCount.length >= 1) {
            data.isSelected = true            
          } else{
            data.isSelected = false
          }
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
        document.getElementById("emitTitleToParent").click();
      });

      // EventBus.$on('send-new-title', (payload) => {
      //   // methods.getData(payload);
      //   console.log("send-new-title: ", payload)
      //   // methods.handleSwitchDefault();
      //   document.getElementById("emitTitleToParent").click()
      // });
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
      background-color: #675AB8;
      width: 55px;
      height: 55px;
      border-radius: 109px; 
      border: 2px solid #675AB8;
      margin-top: 40px;
      // flex-shrink: 0;
      // fill: #FFF;
      // stroke-width: 1px;
      // stroke: #FFF;
      filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8));
    }

    .redo-button-unselected{
      background-color: #e5e4ea;
      border: 2px solid #e5e4ea;
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
    .ok-button-unupdated {
      background-color: #e5e4ea;
      border: 2px solid #e5e4ea;
    }
  }

.options-container-end{
  width: 180px;
  color: #CCC74D;
}
.options-container-loop-end{
  width: 180px;
  color: #B16C9D;
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
  // border-radius: 5px;
  // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  // border: 2px solid #3e3b3b;
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

  // border-radius: 5px;
  // border: 1px solid #FBFBFB;
  border: 0px;
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
.node-name-end{
  color: #CCC74D;
}
.node-name-loop-end{
  color: #B16C9D;
}
.node-name-if{
  color: #B16C9D;
}
.node-name-for {
  color: #B16C9D;
}
.node-name-user-request{
  color: #CCC74D;
  width: 82px;
}
.node-name-info-assign{
  color: #6D9862;
}
.node-name-info-declare{
  color: #6D9862;
}
.menu {
  position: absolute;
  // top: calc(100% - 250px);
  bottom: calc(100px);
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

.mode-button {
  position: absolute;
  // left: 18px;
  left: 208px;
  top: 90px;
  width: 209px;
  height: 53px;
  flex-shrink: 0;
  border-radius: 5px;
  background-color: #FFF;
  box-shadow: 0px 0px 6px 5px rgba(209, 209, 209, 0.25);
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  color: #515151;
  font-family: Avenir;
  font-size: 28px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  }
</style>