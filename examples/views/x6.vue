<template>
  <div class="container">
    <div class="title-container">
      <el-link
        type="primary"
        href="https://github.com/g0ngjie/antv-x6-vue2"
        :underline="false"
        target="_blank"
        >antv-x6-vue2</el-link
      >
    </div>
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
    <div class="options-container">
      <el-button size="mini" :disabled="disabled" @click="handleClean"
        >Clear</el-button
      >
      <el-button size="mini" :disabled="disabled" @click="handleExportAtoms"
        >GetData</el-button
      >
      <el-button size="mini" :disabled="disabled" @click="handleExport"
        >Export</el-button
      >
      <el-button
        size="mini"
        :type="disabled ? 'danger' : ''"
        @click="handleOnlyLook"
        >Readonly</el-button
      >
      <el-button size="mini" :disabled="disabled" @click="handleSwitchDefault"
        >SwitchData</el-button
      >
      <el-button
        size="mini"
        :disabled="disabled"
        type="danger"
        @click="handleTestError"
        >Exception</el-button
      >
      <el-button
        size="big"
        :disabled="disabled"
        type="danger"
        @click="handleAutoLayout"
        >autoLayout</el-button
      >
      
      <div>
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
      </div>
    </div>
  </div>
</template>

<script>
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

export default defineComponent({
  setup() {
    const data = reactive({
      disabled: false,
      currentIndex: 0,
      isUpdate: false,
      form: { label: "" },
    });
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
        // console.log("defaultData: node: ", nodes);
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
        graphFunc.updateNode(data.form);
        data.form.label = "";
        data.isUpdate = false;
      },
      handleAutoLayout() {  //[AutoLayout]
        console.log("auto Layout！");
        //当用户点击“autoLayout”button之后，将整个流程图进行自动布局。
        // const { nodes, edges } = list[data.currentIndex];
        const { nodes, edges } = graphFunc.getAtoms();
        graphFunc.autoLayout(nodes, edges);
      },

      listener() {
        graphFunc.GraphListener.doubleNodeClick((detail) => {
          data.form.label = detail.label;
          data.isUpdate = true;
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

      getData(){
        const {nodes,edges} = graphFunc.getListData();
        list = [{nodes,edges}];
        console.log("list:",list);
      }
    };

    onMounted(() => {
      methods.getData();
      methods.handleSwitchDefault();
      methods.listener();
      // methods.handleAutoLayout();
    });

    return {
      ...toRefs(data),
      ...methods,
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
    padding: 5px 20px;
    background-color: #f2f6fc;
  }
}
.graph-container {
  height: 85vh;
}
.options-container {
  padding: 0 10px;
}
</style>