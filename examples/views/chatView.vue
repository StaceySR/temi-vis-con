<template>
    <div id="chat">
      <div class="chat-icon">
        <img :src="VUE_APP_ICON_Server + '/packages/icons/logo.png'"/>
        <span class="chat-title">co-CoBot</span>
      </div>
      <div class="chat-container">
        <div class="message" v-for="message in messages" :key="message.id" :class="message.role">
          <div class="content" :class="{'user': 'content-user', 'assistant': 'content-assistant', 'magic': 'content-magic'}[message.role]">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div class="input-container">
        <textarea ref="textarea" v-model="userInput" placeholder="请输入内容" class="chat-input" @keyup.enter="sendMessage">
          
        </textarea>
        <button class="chatButton" @click="sendMessage">
          <img :src="VUE_APP_ICON_Server + '/packages/icons/sendButton.png'" alt="按钮">
        </button>
        <!-- <button class="chatButton" @click="TemiServiceBuild">部署</button> -->
      </div>
    </div>
  </template>
  
  <script>

  // import { getMermaidData }     from "../../packages/x6/common/mermaid2antV.js";
  import { EventBus } from "./eventBus.js";
  import { session } from "./SessionRecording.js";

  // 定义阶段类型，包括 authoring,debugging, magicModify
  const stageType = {
    authoring: 0,
    debugging: 1,
    magicModify: 2,
  };
  
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
        currentStage: stageType.authoring,
        currentSeletecNodes: [],
        authoringChat: [],
        serviceGoal: "",
        serviceReuqirements: "",
        VUE_APP_ICON_Server: process.env.VUE_APP_ICON_Server
      };
    },
    methods: {
      // 处理每次的用户交互
      async sendMessage() {
        if (this.userInput.trim() === "") return;

        this.userInput = this.userInput.replace(/\n$/, '');  // 去除末尾的换行符
        
        console.log("userInput: ", this.userInput)
        let sendContent = this.userInput;
        this.addMessage(sendContent, "user");
        
        this.userInput = "";
        if (this.currentStage == stageType.authoring) {

            this.addMessage("正在理解...", "assistant");
            //let serverMsg = this.messages[this.messages.length - 1];


            // 将用户输入添加到authoringChat中
            this.authoringChat.push({
              role: "user",
              content: sendContent});

            // 向后端发送请求，获得gpt返回结果
            const result = await this.authoringNEW(this.authoringChat);
            console.log('【authoringNEW result】', result);
            this.authoringChat.push({
              role: "assistant",
              content: result
            });

            // 处理authoring阶段的返回结果
            this.authoringMsgHandler(result);

            // // 获得当前的需求沟通阶段: 从result中搜索包含phase xml标记的内容，如果没有就报错
            // const phase = this.getXMLcontent(result, "phase");
            // console.log('phase', phase);
            
            // const chatContent = this.getChatContent(result);

            // // 判断当前的阶段
            // switch (phase) {
            //   case "GoalCommunication":
            //     serverMsg.content = chatContent;
            //     //this.addMessage(chatContent, "assistant");
            //     break;
            //   case "RefiningRequirements":
            //     serverMsg.content = chatContent;
            //     break;
            //   case "Completion":
            //     serverMsg.content = chatContent;
            //     this.serviceGoal = this.getXMLcontent(result, "goal");
            //     this.serviceReuqirements = this.getXMLcontent(result, "requirements");

            //     this.initCode();


            //     break;
            //   default:
            //     break;
            // }

            this.scrollToButton();
          


          } else if (this.currentStage == stageType.debugging) {
            this.addMessage("正在理解你的需求....", "assistant");
            const modifiedJSCode = await this.NL2JSwithContext(sendContent, this.currentJSCode);
            const oldJSCode = this.currentJSCode;
            this.currentJSCode = modifiedJSCode;

            const explainContent = await this.ExplainModifiedJS(oldJSCode, modifiedJSCode);

            
            //将最后的sytem message改成该解释内容
            // 获得 messages 中最后一条role为system的message
            let serverMsg = this.messages[this.messages.length - 1];
            serverMsg.content = explainContent;   
            this.scrollToButton();

            this.addMessage("正在绘制定制服务的流程图，请稍候。", "assistant");
            // 生成代码后开始处理flow部分
            const mermaidCode = await this.js2flow(this.currentJSCode);
            this.currentFlowCode = mermaidCode;
            console.log("修改后的currentFlowCode: ", this.currentFlowCode);
            EventBus.$emit('callGetData', this.currentFlowCode);

            serverMsg = this.messages[this.messages.length - 1];
            serverMsg.content = "已重新绘制流程图，你可以继续提出你的服务流程修改需求，我会帮助你进行修改。";
            this.scrollToButton();

            // EventBus.$emit("send-new-title", "send-new-title");
        }else if(this.currentStage == stageType.magicModify) {
          console.log("magic modify time!");

          this.magicModifyIT(sendContent);
        } 

        
  
        //resize textarea height after 0.5 sce
        setTimeout(() => {
          this.resizeTextarea({ target: this.$refs.textarea });
        }, 100);
        

      },

      authoringMsgHandler(result) {

        let tag = "";
        let content = "";

        // 从内容中搜索xml标签以及内容，将标签赋值给tag，将内容赋值给content
        const parser = new DOMParser();
        const xmlContent = parser.parseFromString(result, "text/xml");

        // 获取标签名
        tag = xmlContent.documentElement.nodeName;
        //console.log("标签名:", tag); 

        // 获取标签内容
        content  = xmlContent.documentElement.textContent;
        //console.log("文本内容:", content); // 输出：完成

        // const pattern = /<.*?>(.*?)<\/.*?>/g;
        // const resultArray = result.match(pattern);
        // if (resultArray == null) {
        //   console.log("没有找到xml标记");
        //   return null;
        // } else {
        //   tag = resultArray[0].replace(/<.*?>/g, "");
        //   content = resultArray[0].replace(/<.*?>/g, "");
        // }

        let serverMsg = this.messages[this.messages.length - 1];

        switch (tag) {
          case "require":
            this.serviceReuqirements = content;
            serverMsg.content = `好的，你的需求如下：
${ this.serviceReuqirements }
你可以继续提出你的机器人服务定制需求或者进行修改。也可以告诉我你已经完成了你的需求描述，我会为你生成机器人的行为程序。
            `;
            break;
          case "modifiedrequire":
            this.serviceReuqirements = content;
            serverMsg.content = `好的，你修改后的需求如下：
              ${ this.serviceReuqirements }
              你可以继续提出你的机器人服务定制需求或者进行修改。也可以告诉我你已经完成了你的需求描述，我会为你生成机器人的行为程序。
            `;
            break;
          case "end":
            serverMsg.content = `好的，你的需求如下：
${ this.serviceReuqirements }
即将为你生成机器人的服务流程，请稍候...
            `;
            this.initCode();
            break;
          default:
            console.log("没有找到xml标记");
            break;

        }
  




      },


      async initCode() {
        this.addMessage("正在根据你的需求构建服务流程...", "assistant");
        let serviceBuildMsg = this.messages[this.messages.length - 1];

        console.log('serviceGoal', this.serviceGoal);
        console.log('serviceReuqirements', this.serviceReuqirements);
        const codeRequirement = `
        实现一个${this.serviceGoal}的服务，该服务需要满足以下需求：${this.serviceReuqirements}
        `

        this.currentJSCode = await this.NL2JS(codeRequirement);
        console.log('currentJSCode', this.currentJSCode);

        // 取回生成的js代码后，进一步生成解释

        await this.JS2NL(this.currentJSCode).then((data) => {
          console.log('explainContent', data);
          serviceBuildMsg.content = data;
          this.scrollToButton();
        });

        this.addMessage("正在绘制定制服务的流程图，请稍候。", "assistant");
        let flowMsg = this.messages[this.messages.length - 1];
        const mermaidCode = await this.js2flow(this.currentJSCode);
        this.currentFlowCode = mermaidCode;
        EventBus.$emit('callGetData', this.currentFlowCode);

        flowMsg.content = "已完成个性化机器人服务的构建！我可以为你进一步解释实现的服务流程，你也可以直接向我提出修改需求，我会帮你完成修改。";       
        this.scrollToButton();
        
        this.currentStage = stageType.debugging;

      },

      getChatContent(content) {
        //从内容中删除所有xml标记的内容，比如删除<phase>content</phase>
        const pattern = /<.*?>(.*?)<\/.*?>/g;
        return content.replace(pattern, "");
        
      },



      getXMLcontent(content, tag) {
        //从内容中搜索包含tag xml标记的内容，如果没有就报错
        const pattern = new RegExp(`<${tag}>(.*?)</${tag}>`, "g");
        const result = content.match(pattern);
        if (result == null) {
          console.log(`没有找到${tag}标记`);
          return null;
        } else {
          return result[0].replace(new RegExp(`<${tag}>`, "g"), "").replace(new RegExp(`</${tag}>`, "g"), "");
        }
        
      },

      getPhase(content) {
        //从内容中搜索包含phase xml标记的内容，如果没有就报错
        const phasePattern = /<phase>(.*?)<\/phase>/g;
        const phase = content.match(phasePattern);
        if (phase == null) {
          console.log("没有找到phase标记");
          return null;
        } else {
          return phase[0].replace(/<phase>/g, "").replace(/<\/phase>/g, "");
        }
      },

      async authoringNEW(authoringChat) { 
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/authoringNEW` ,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat: authoringChat , sessionID: session.id})
          }
        );

        const result = await res.text().then((data) => {
          //console.log('data', data);
          return data;

        });

        return result;
      },

      async authoring(authoringChat) {
          const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/authoring`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ chat: authoringChat , sessionID: session.id})
            }
          ); 

          const result = await res.text().then((data) => {
            //console.log('data', data);
            return data;

          });

          return result;
      },

      async TemiServiceBuild() {
        console.log('temiServiceBuild');
        this.addMessage("正在部署中....", "assistant");


        //部署代码到temi上
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/js2temi`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: this.currentJSCode, sessionID: session.id})
          }
        );

        const result = await res.text().then((data) => {
          console.log('data', data);

          return data;
        });

        // 获得 messages 中最后一条role为system的message
        const magcMsg = this.messages[this.messages.length - 1];
        magcMsg.content = result;
        this.scrollToButton();

      },

      async NL2JS(userInput) {
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/nl2js`,
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
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/nl2jswithContext` ,
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
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/explainModifiedJS`,
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
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/js2NLexplain`,
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
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/js2flow`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: this.currentJSCode,
              sessionID: session.id
            })
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

        // 将 chat-container 视图滚动到最下方
        this.scrollToButton();
  
      },

      scrollToButton() {
        // 将 chat-container 视图滚动到最下方
        this.$nextTick(() => {
          const chatContainer = this.$el.querySelector(".chat-container");
          chatContainer.scrollTop = chatContainer.scrollHeight;
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

        //生成等待提示对话框
        this.addMessage("正在按照修改后的流程图生成新的机器人服务流程，请等待...", "assistant");
        let serverMsg = this.messages[this.messages.length - 1];

        //方法体（补充）
        const res = await fetch("//192.168.123.70:3001/APIs/flow2js",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
              body: JSON.stringify({
                  jscode: this.currentJSCode,
                  oldFlow: this.currentFlowCode,
                newFlow: this.newMermaidData,
                sessionID : session.id
            })
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

        serverMsg.content = "已经为你按照修改后的流程图重新生成机器人的服务程序"
        //this.addMessage("按照流程图，新的代码已生成完毕！", "assistant");
        

        return result;
        //
      },

      //魔法棒修改，选中流程图中的节点，与LLM对话
      async magicUpdateWithLLM(){
        console.log("chatview中的魔法棒: ", this.selectedCells)
        //从选中的cells中提取出node，然后从node中取出label,并记录，然后进行打印。
        let selectedNodesID = [];

        for (let i = 0; i < this.selectedCells.length; i++){
        // 判断当前cell是否为node
          if (!this.selectedCells[i].isNode()) {
            console.log("not node!");
            } else {
            console.log("find node!");
            //添加到selectedNodes中
            
            selectedNodesID.push(this.selectedCells[i].data.actionType + ": " + this.selectedCells[i].data.tooltip);    
          }
        }
        console.log("selectNodesID: ", selectedNodesID)
        // 提取出node的label
        //console.log("selectedNodes[i].id: ", selectedNodes[i].id);

        this.currentSeletecNodes = selectedNodesID;
        this.addMessage("正在思考解释你选中的节点....", "magic");
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/magicModify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
              body: JSON.stringify({
                  sessionID: session.id,
                  selectedNodes: this.currentSeletecNodes,
                  jscode: this.currentJSCode,
                  flow: this.currentFlowCode,
            })
          }
        );
        await res.text().then((data) => {
          //console.log('data', data);
          console.log("data from magic modify: ", data);
          const serverMsg = this.messages[this.messages.length - 1];
          serverMsg.content = data;

          // 最后修改当前的stage
          this.currentStage = stageType.magicModify;
          return data;
        });

      },

      async magicModifyIT(userInput) {
        this.addMessage("正在思考....", "magic");
        const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/magicModifyPhase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
              body: JSON.stringify({
                  sessionID: session.id,
                  selectedNodes: this.currentSeletecNodes,
                  jscode: this.currentJSCode,
                  flow: this.currentFlowCode,
                  text: userInput,
            })
          }
        );


        const result =  await res.text().then((data) => {
          //console.log('data', data);
          console.log("data from magic modify: ", data);
          return data;
        }); 

        //判断回复的data字符串中是否包含<end>标签。，如果有的话就结束魔法修改。
        if (result.indexOf("<end>") != -1) {
        //包含<end>标签，结束魔法修改
        const serverMsg = this.messages[this.messages.length - 1];
        serverMsg.content = "退出节点调试模式";
        this.addMessage("你可以继续提出你的服务流程修改需求，我会帮助你进行修改。", "assistant");
        this.currentStage = stageType.debugging;
        }        

        // 如果用户请求的是修改代码
        if (result.indexOf("<code>") != -1) {
          const serverMsg = this.messages[this.messages.length - 1];
          serverMsg.content = "正在生成新的代码....";          
          // 将<code></code>标签内的内容提取出来，作为新的jscode
          const newJSCode = result.substring(result.indexOf("<code>") + 6, result.indexOf("</code>"));
          this.currentJSCode = newJSCode;

          // 将<description></description>标签内的内容提取出来,作为新的description
          const newDescription = result.substring(result.indexOf("<description>") + 13, result.indexOf("</description>"));

          const newflowCode = await this.js2flow(this.currentJSCode);
          this.currentFlowCode = newflowCode;
          EventBus.$emit('callGetData', this.currentFlowCode);

          //const serverMsg = this.messages[this.messages.length - 1];
          serverMsg.content = newDescription;

          this.currentJSCode = newJSCode;


          this.addMessage("已退出节点调试模式。你现在可以继续提出你对整个服务流程的修改要求。或者再次选中节点进入节点调试模式进行修改。", "assistant");
        }

        if (result.indexOf("<explain>") != -1) {
          // 将<explain></explain>标签内的内容提取出来
          const newExplain = result.substring(result.indexOf("<explain>") + 9, result.indexOf("</explain>"));
          const serverMsg = this.messages[this.messages.length - 1];
          serverMsg.content = newExplain;
        }
        
      },

      async startRunTemi() {
        // 部署到Temi上
        console.log('chatView 子组件startRunTemi方法被调用了！');
        console.log("current jscode:"+ this.currentJSCode);

        if (this.currentJSCode.length > 0) {
          //部署代码到temi上
          const res = await fetch(`${process.env.VUE_APP_GPT_API_Server}/APIs/js2temi`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
                body: JSON.stringify({
                    sessionID: session.id,
                    text: this.currentJSCode, 
              })
            }
          );
          await res.text().then((data) => {
            //console.log('data', data);
            console.log(data);
            this.addMessage(data, "assistant");
            return data;
          });
          }
      }
    },
    mounted() {
      this.$refs.textarea.addEventListener("input", this.resizeTextarea);
      //this.setSystemMsg();
  
      this.addMessage("你好，我是你的助手，我将帮助你进行Temi机器人的服务定制，请你告诉我你的机器人个性化服务定制需求", "assistant");

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
  width: 200px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-icon img {
  width: 50px;
  height: 50px;
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

  .message.magic {
    justify-content: flex-start;
    
  }
  
  .content {
    border-radius: 5px;
    padding: 10px;
    width: 80%;
    white-space: pre-wrap;
  }
  
  .content-user {
    background-color: #f1f1f1;
    color: #333;
  }
  
  .content-assistant {
    background-color: #5AB2B8;
    color: #fff;
  }

  .content-magic{
    background-color: #675AB8;
    color: #fff;
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
    bottom: 51px;
    right: -256px;
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