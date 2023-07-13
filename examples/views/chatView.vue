<template>
    <div id="chat">
      <div class="chat-container">
        <div class="message" v-for="message in messages" :key="message.id" :class="message.role">
          <div class="content" :class="message.role ==='user' ?  'content-user' : 'content-assistant'">
            {{ message.content }}
          </div>
        </div>
      </div>
      <div class="input-container">
        <textarea ref="textarea" v-model="userInput" placeholder="请输入内容"></textarea>
        <button class="chatButton" @click="sendMessage">发送</button>
        <button class="chatButton" @click="TemiServiceBuild">部署</button>
      </div>
    </div>
  </template>
  
  <script>

  // import { getMermaidData }     from "../../packages/x6/common/mermaid2antV.js";
  import { EventBus } from "./eventBus.js";
  
  export default {
    data() {
      return {
        userInput: "",
        messages: [],
        messageCounter: 0,
        systemMsg: "",
        historyMsg: [],
        currentMsg: "",
        currentJSCode:"",
        newMermaidData: "",
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
        EventBus.$emit('callGetData', mermaidCode);




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
            body: JSON.stringify({ text: userInput })
          }
        );

        const result = await res.text().then((data) => {
          console.log('data', data);

          return data;
        });

        return result;
              
      },

      async NL2JSwithContext(userInput,currentJSCode) {
        const res = await fetch("http://192.168.123.70:3001/APIs/js2NLexplain" ,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: userInput,context: currentJSCode })
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
          console.log('data', data);

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
      changeRobotJsCode(){
        console.log("newMermaidData: ", this.newMermaidData);
        //

        //方法体（补充）

        //
      }  
    },
    mounted() {
      this.$refs.textarea.addEventListener("input", this.resizeTextarea);
      //this.setSystemMsg();
  
      this.addMessage("你好，我是你的助手，我将帮助你进行机器人的功能定制，请你开始进行创作吧！", "assistant");

      EventBus.$on("send-new-mermaid-data", newMermaidCode => {
        this.newMermaidData = newMermaidCode;
        this.changeRobotJsCode();
      });
      // getMermaidData();
    },
    beforeDestroy() {
      EventBus.$off("send-new-mermaid-data");
    }
  };
  </script>
  
  
  <style>
  #chat {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 60px;
    display: block;
  }
  
  .chat-container {
    width: 300px;
    height: 90%;
    min-height: 500px;
    border: 1px solid #ccc;
    margin: 0 auto;
    overflow-y: auto;
    padding: 10px;
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
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding: 10px;
  }
  
  input[type="text"] {
    width: 200px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    resize: vertical;
  }
  
  textarea {
    width: 200px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    resize: none;
    overflow: hidden;
  }
  
  textarea:focus {
    outline: none;
  }
  
  .chatButton {
    background-color: #0080ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    width: 50px;
    /* padding: 10px 20px; */
    cursor: pointer;
    margin: 5px;
  }
  </style>