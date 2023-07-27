<template>
    <div id="chat">
      <div class="chat-icon">
        <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/robot.png"/>
        <span class="chat-title">RSC</span>
      </div>
      <div class="chat-container">
        <div class="message" v-for="message in messages" :key="message.id" :class="message.role">
          <div class="content" :class="message.role ==='user' ?  'content-user' : 'content-assistant'">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div class="input-container">
        <textarea ref="textarea" v-model="userInput" placeholder="请输入内容" class="chat-input">
          
        </textarea>
        <button class="chatButton" @click="sendMessage">
          <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/sendButton.png" alt="按钮">
        </button>
        <!-- <button class="chatButton" @click="TemiServiceBuild">部署</button> -->
      </div>
    </div>
  </template>
  
  <script>

  // import { getMermaidData }     from "../../packages/x6/common/mermaid2antV.js";
  import { EventBus } from "./eventBus.js";
  import { session } from "./SessionRecording.js";
  
  export default {
    data() {
      return {
        userInput: "",
        messages: [],
        messageCounter: 0,
        systemMsg: "",
        historyMsg: [],
        currentMsg: "",
          currentJSCode: "",
          currentFlowCode: "",
        newMermaidData: "",
        selectedCells: [],
      };
    },
    methods: {
      async sendMessage() {
        if (this.userInput.trim() === "") return;
  
        let sendContent = this.userInput;
        console.log('sendContent', sendContent);

        this.addMessage(this.userInput, "user");
        this.addMessage("正在生成中....", "assistant");

        if(this.currentJSCode.length === 0) {
          this.currentJSCode = await this.NL2JS(sendContent);
          console.log('currentJSCode', this.currentJSCode);

          // 取回生成的hs代码后，进一步生成解释
          // const explainContent = await this.JS2NL(this.currentJSCode);
          // console.log('explainContent', explainContent);

          this.JS2NL(this.currentJSCode).then((data) => {
            console.log('data', data);
            const serverMsg = this.messages[this.messages.length - 1];
            serverMsg.content = data;
          });


          // 将最后的sytem message改成该解释内容
          // 获得 messages 中最后一条role为system的message
          // const serverMsg = this.messages[this.messages.length - 1];
          // serverMsg.content = explainContent;
        } else {
          const modifiedJSCode = await this.NL2JSwithContext(sendContent, this.currentJSCode);

          const explainContent = await this.ExplainModifiedJS(this.currentJSCode, modifiedJSCode);

          //将最后的sytem message改成该解释内容
          // 获得 messages 中最后一条role为system的message
          const serverMsg = this.messages[this.messages.length - 1];
          serverMsg.content = explainContent;          
        }

        // 生成代码后开始处理flow部分
        const mermaidCode = await this.js2flow(this.currentJSCode);
        this.currentFlowCode = mermaidCode;
        EventBus.$emit('callGetData', this.currentFlowCode);




        this.userInput = "";
  
  
        //resize textarea height after 0.5 sce
        setTimeout(() => {
          this.resizeTextarea({ target: this.$refs.textarea });
        }, 100);
  
      },

      async TemiServiceBuild() {
        console.log('temiServiceBuild');
        this.addMessage("正在部署中....", "assistant");


        //部署代码到temi上
        const res = await fetch("http://192.168.123.70:3001/APIs/js2temi",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: this.currentJSCode })
          }
        );

        const result = await res.text().then((data) => {
          console.log('data', data);

          return data;
        });

        // 获得 messages 中最后一条role为system的message
        const serverMsg = this.messages[this.messages.length - 1];
        serverMsg.content = result;

      },

      async NL2JS(userInput) {
        const res = await fetch("http://192.168.123.70:3001/APIs/nl2js",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: userInput,sessionID: session.id })
          }
        );

        const result = await res.text().then((data) => {
          //console.log('data', data);

          return data;
        });

        return result;
              
      },

      async NL2JSwithContext(_userInput,_currentJSCode) {
        const res = await fetch("http://192.168.123.70:3001/APIs/nl2jswithContext" ,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: _userInput,context: _currentJSCode })
          }
        );

        const result = await res.text().then((data) => {
          console.log('data', data);

          return data;
        });

        return result;
        
      },

      async ExplainModifiedJS(originCode, ModifiedCode) {
        const res = await fetch("//192.168.123.70:3001/APIs/explainModifiedJS",
        {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ origin: originCode, modified: ModifiedCode})
          }
        );

        const result = await res.text().then((data) => {
          console.log('data', data);

          return data;
        });

        return result;

      },

      async JS2NL(jscode) {
        const res = await fetch("//192.168.123.70:3001/APIs/js2NLexplain",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: jscode})
          }
        );


        const result = await res.text().then((data) => {
          //console.log('data', data);

          return data;
        });

        return result;
          
      },

      async js2flow() {
        const res = await fetch("//192.168.123.70:3001/APIs/js2flow",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: this.currentJSCode})
          }
        );


        const result = await res.text().then((data) => {
          console.log('data', data);

          return data;
        });

        return result;
                  
      },

      addMessage(content, role) {
        this.messages.push({
          id: this.messageCounter++,
          content,
          role,
        });
  
      },
      resizeTextarea(event) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
      } , 

      //根据前端用户修改，返回的new mermaid code，修改后端的驱动机器人的js code
      async changeRobotJsCode(){
        console.log("newMermaidData: ", this.newMermaidData);
        //

        
        //方法体（补充）
        const res = await fetch("//192.168.123.70:3001/APIs/flow2js",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ jscode: this.currentJSCode, oldFlow: this.currentFlowCode, newFlow: this.newMermaidData})
          }
        );


        const result = await res.text().then((data) => {
          console.log('new jscode data', data);
          return data;
        });

        this.currentJSCode = result;

        // 生成代码后开始处理flow部分
        const mermaidCode = await this.js2flow(this.currentJSCode);
        this.currentFlowCode = mermaidCode;
        EventBus.$emit('callGetData', this.currentFlowCode);        


        return result;
        //
      },

      //魔法棒修改，选中流程图中的节点，与LLM对话
      async magicUpdateWithLLM(){
        
        console.log("chatview中的魔法棒: ", this.selectedCells)

        //从选中的cells中提取出node，然后从node中取出label,并记录，然后进行打印。
        let selectedNodes = [];

        for (let i = 0; i < this.selectedCells.length; i++){
        // 判断当前cell是否为node
          if (!this.selectedCells[i].isNode()) {
            console.log("not node!");
            } else {
            console.log("find node!");
            //添加到selectedNodes中
            selectedNodes.push(this.selectedCells[i]);    

          }

          // 提取出node的label
           console.log("selectedNodes[i].id: ", selectedNodes[i].id);


      

        }






        console.log("selectedNodes: ", selectedNodes);
        console.log("current mermaidCode:" + this.currentFlowCode);



      },
    },
    mounted() {
      this.$refs.textarea.addEventListener("input", this.resizeTextarea);
      //this.setSystemMsg();
  
      this.addMessage("你好，我是你的助手，我将帮助你进行机器人的功能定制，请你开始进行创作吧！", "assistant");

      EventBus.$on("send-new-mermaid-data", newMermaidCode => {
        this.newMermaidData = newMermaidCode;
        this.changeRobotJsCode();
      });
      EventBus.$on("magic-selected-cells", selectedCells => {
        this.selectedCells = selectedCells;
        this.magicUpdateWithLLM();
      });
      // getMermaidData();
    },
    beforeDestroy() {
      EventBus.$off("send-new-mermaid-data");
      EventBus.$off("magic-selected-cells");
    }
  };
  </script>
  
  
  <style>
  #chat {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    text-align: center;
    /* margin-top: 60px; */
    /* display: block; */
    display: flex;
    flex-direction: column;
    height: 100%;
    /* width: 100%; */
  }
  .chat-icon, .chat-container, .input-container {
    flex: 1;
  }

  .chat-icon {
    flex-grow: 1;
    height: 10%;
  }

  .chat-container {
    flex-grow: 7;
    height: 70%;
    overflow-y: auto;
  }

  .input-container {
    flex-grow: 2;
    height: 20%;
    position: relative;
  }
  
  .chat-container {
    width: 88%;
    height: 90%;
    min-height: 500px;
    /* border: 1px solid #ccc; */
    margin: 0 auto;
    overflow-y: auto;
    padding: 10px;
    border-radius: 21px;
    background: #FFF;
  }

.chat-icon {
  position: relative;
  top: 0px;
  /* margin-top: -20px; */
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-icon img {
  width: 30px;
  height: 30px;
}

.chat-title {
  color: #5AB2B8;
  font-family: Avenir;
  font-size: 18px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  margin-left: 9px;
}
  
  .message {
    display: flex;
    margin-bottom: 10px;
    padding: 5px;
    /* max-width: 80%; */
    text-align: left;
  }
  
  .message.user {
    justify-content: flex-end;
    
  }
  
  .message.assistant {
    justify-content: flex-start;
    
  }
  
  .content {
    border-radius: 5px;
    padding: 10px;
    width: 80%;
    white-space: pre-wrap;
  }
  
  .content-user {
    background-color: #00a1ff;
    color: #fff;
  }
  
  .content-assistant {
    background-color: #f1f1f1;
    color: #333;
  }
  
  .input-container {
    /* display: flex; */
    justify-content: center;
    padding: 10px;
    /* width: 100%; */
  }
  
  input[type="text"] {
    /* width: 200px; */
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    /* margin-right: 10px; */
    resize: vertical;
  }
  
  .chat-input {
    position: relative;
    /* width: 450px; */
    width: 92%;
    min-height: 100px;
    max-height: 100px;
    overflow: auto;
    padding: 10px;
    border-radius: 12px;
    border: 1px solid #878787;
    background: #FFF;
    /* margin-right: 10px; */
    resize: none;
    /* overflow: hidden; */
    font-size: 16px;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
  }
  .chatButton {
    position: relative;
    bottom: 49px;
    right: -171px;
    background-color: #5AB2B8;
    color: #fff;
    border: none;
    border-radius: 5px;
    width: 35px;
    height: 35px;
    /* padding: 10px 20px; */
    cursor: pointer;
  }

  .chatButton:hover{
    transform: scale(1.1) !important;
  }

  .chatButton img {
    display: block; /* 将图片设置为块级元素 */
    width: 32px; /* 设置图片宽度为按钮的宽度 */
    height: 32px; /* 设置高度自适应 */
  }

    
  textarea:focus {
    outline: none;
  }
  /* 滚动条整体样式 */
  ::-webkit-scrollbar {
    width: 8px; /* 宽度 */
    height: 8px; /* 高度 */
  }

  /* 滚动条轨道样式 */
  ::-webkit-scrollbar-track {
    background-color: #f5f5f5; /* 背景色 */
  }

  /* 滚动条滑块样式 */
  ::-webkit-scrollbar-thumb {
    background-color: #c1c1c1; /* 滑块颜色 */
    border-radius: 10px; /* 滑块圆角 */
  }

  /* 滚动条滑块悬停样式 */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
  }
  </style>