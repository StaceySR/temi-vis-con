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
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        userInput: "",
        messages: [],
        messageCounter: 0,
        systemMsg: "",
        historyMsg: [],
        currentMsg: "",
        currentJSCode:""
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
          const explainContent = await this.JS2NL(this.currentJSCode);
          console.log('explainContent', explainContent);

          //将最后的sytem message改成该解释内容
          // 获得 messages 中最后一条role为system的message
          const serverMsg = this.messages[this.messages.length - 1];
          serverMsg.content = explainContent;

        } else {
          const modifiedJSCode = await this.NL2JSwithContext(sendContent, this.currentJSCode);

          const explainContent = await this.ExplainModifiedJS(this.currentJSCode, modifiedJSCode);

          //将最后的sytem message改成该解释内容
          // 获得 messages 中最后一条role为system的message
          const serverMsg = this.messages[this.messages.length - 1];
          serverMsg.content = explainContent;          

          
            
        }
  


        this.userInput = "";
  
  
        //resize textarea height after 0.5 sce
        setTimeout(() => {
          this.resizeTextarea({ target: this.$refs.textarea });
        }, 100);
  
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

        // console.log('res', res.text());
        // const data = await res.json();
        // console.log('data', data);

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

      addMessage(content, role) {
        this.messages.push({
          id: this.messageCounter++,
          content,
          role,
        });
  
      },

      async fetchConversationReply() {
        try {
          //console.log('historyMsg', this.historyMsg);
          //const stringhistory = JSON.stringify(this.historyMsg);
          //console.log('stringhistory', stringhistory);
          const response = await fetch("http://192.168.123.70:3333/conversation", {
            method: "POST",
            // mode: 'cors',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: this.historyMsg })
          });
  
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let serverResponse = "";
  
  
          // 在处理前显示正在生成中的信息
          //this.addMessage("正在生成中....", "assistant");
          //let serverResponseProcessed = "";
  
          const processStream = async ({ done, value }) => {
            if (done) {
              //const serverMsg = this.messages[this.messages.length - 1];
              //serverMsg.content = "生成完成";
              this.processResultfromGPT();
              return;
            }
  
            const chunk = decoder.decode(value, { stream: true });
            serverResponse += chunk;
            const lines = serverResponse.split("\n");
  
            while (lines.length > 1) {
              const line = lines.shift();
              if (line.startsWith("data: ")) {
                const jsonString = line.substring(6);
                if (jsonString.trim() !== "[DONE]") {
                  const data = JSON.parse(jsonString);
                  const delta = data.choices[0].delta;
                  if (delta && delta.content) {
                    //serverResponseProcessed += delta.content;
  
                    const lastMsg = this.historyMsg[this.historyMsg.length - 1];
                    console.log('lastMsg', lastMsg.role);
                    if (lastMsg.role === "assistant") {
                      lastMsg.content += delta.content;
                    } else {
                      this.historyMsg.push({
                        role: 'assistant',
                        content: delta.content
                      });
                    }
                    
                  }
                }
              }
            }
  
            serverResponse = lines[0];
            return reader.read().then(processStream);
          };
  
          reader.read().then(processStream);
        } catch (error) {
          console.error("Error fetching reply:", error);
          this.addMessage("Error fetching reply", "server");
        }      
      },
      async processResultfromGPT() {
        //通过post向“http://127.0.0.1:1880/flows”发起请求，将生成的文本传递给node-red。headers中的“Content-Type”为“application/json”，“Node-RED-Deployment-Type”为“full”。body是messages中的最后一条消息的content。
  
        if(this.currentMsg.length === 0) {
          this.currentMsg = this.historyMsg[this.historyMsg.length - 1].content;
          console.log('rawdata', this.currentMsg);
        } else {
          this.currentMsg += this.historyMsg[this.historyMsg.length - 1].content;
          console.log('rawdata', this.currentMsg);
        }
  
        // 对当前msg进行处理，将内容提取出来，如果提取不出来的话，表示内容不完整，再次请求服务器
  
        try {
          const donedataMatch = this.currentMsg.match(/<done>([\s\S]*?)<\/done>/);
          if (donedataMatch) {
            console.log('已经输出完成内容，rawdata', this.currentMsg);
            // 表示内容完整，进行下一步处理
            //const donedata = donedataMatch[1];
  
            // 处理flow中的内容
            const flowdata = this.currentMsg.match(/<flow>([\s\S]*?)<\/flow>/)[1];
            console.log('flowdata', flowdata);
  
            // 处理<describ>中的内容，并在UI上进行反馈
            const describdata = this.currentMsg.match(/<describ>([\s\S]*?)<\/describ>/)[1];
            console.log('describdata', describdata);
            const serverMsg = this.messages[this.messages.length - 1];
            serverMsg.content = "生成完成，我将按照一下内容进行部署：\n" + describdata;
  
            // 将生成的内容发送给node-red
            const headers = {
              "Content-Type": "application/json",
              "Node-RED-Deployment-Type": "full"
            };
            const response = await axios.post('http://127.0.0.1:1880/flows', flowdata, { headers: headers });
  
            // 处理响应
            console.log(response);
            this.refreshTargetPage();
  
            // 清空当前msg
            this.currentMsg = "";
  
          }else{
            // 内容不完整，再次请求服务器
            //this.fetchConversationReply();
            console.log('内容不完整，再次请求服务器');
  
            const gotoPrompt = "go on";
  
            //this.addMessage(gotoPrompt, "user");
            this.historyMsg.push({
              role: 'user',
              content: gotoPrompt
            });
            //this.fetchReply(this.userInput);
            this.fetchConversationReply();
          }
  
        }catch (error) {
          console.error("Error fetching reply:", error);
          this.addMessage("Error fetching reply", "server");
        }
  
        
    
  
  
      },
      resizeTextarea(event) {
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
      } , 
  
      // set system message from  prompt.txt assets file
      // async setSystemMsg() {
      //   const fileUrl = 'assets/prompts.txt';
      //   fetch(fileUrl)
      //     .then(response => response.text())
      //     .then(text => {
      //       this.systemMsg = text;
      //       console.log('systemMsg', this.systemMsg);

      //       this.historyMsg.push({
      //         role: 'system',
      //         content : this.systemMsg
      //       });
      //     }
      //   )
      //   .catch(error => {
      //     console.error('读取文件失败:', error);
      //   });
      // },
      
      // refreshTargetPage() {
      //   window.postMessage(
      //     {
      //       type: 'MY_CUSTOM_EVENT',
      //       data: {
      //         message: 'refresh',
      //       },
  
      //     }, '*'
  
  
      //   );
  
  
      //   console.log('refreshTargetPage');
      // }
      
      
  
  
    },
    mounted() {
      this.$refs.textarea.addEventListener("input", this.resizeTextarea);
      //this.setSystemMsg();
  
      this.addMessage("你好，我是你的助手，我将帮助你进行机器人的功能定制，请你开始进行创作吧！", "assistant");
    }
  };
  </script>
  
  
  <style>
  #chat {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    text-align: center;
    margin-top: 60px;
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
  
  button {
    background-color: #0080ff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>