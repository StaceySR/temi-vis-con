<template>
    <div class="container">
      <div class="title-container">
        <div class="title-center">
          <a class="title" href="https://github.com/g0ngjie/antv-x6-vue2">{{titleData.title}}</a>
        </div>
        <div class="title-buttons">
          <!-- <button class="title-button">
            <img src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/play.png"/>
          </button> -->
          <button class="title-button">
            <img class="title-button-img2" src="http://localhost:5500/Temi-Program-Visualization-main/packages/icons/download.png"/>
          </button>
        </div>
      </div>
      <div class="inner-container">
        <div class="Flow-Wrapper">
        <!-- <x6/> -->
        <x6 @title-to-parent="handleTitleFromX6" />
        </div>
        <div class="ChatView-Wrapper">
          <chatView/>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  import x6 from '../views/x6.vue';
  import chatView from '../views/chatView.vue';
  import Vue from 'vue'; // 导入 Vue 对象，用于创建响应式数据
  // import { EventBus } from "./eventBus.js";
  
  export default {
    components: {
        x6,
        chatView
    },
    data() {
      return {
        titleData: Vue.observable({
          title: '标题从子组件传递给父组件，困扰了我2天，无法解决，只能通过页面中点按钮，从子组件传给父组件，而无法自动',
        }),
        newTitleData: "",
      };
    },
    methods: {
      // 父组件中的事件处理函数，用于接收从 x6 子组件传递的 title 参数
      handleTitleFromX6(title) {
        console.log('Received title from x6:', title);
        this.titleData.title = title; // 更新父组件的 title 数据
      },
    },
    // mounted() {
    //   EventBus.$on("send-new-title", newTitle => {
    //     this.newTitleData = newTitle;
    //     console.log("app;newTitle: ", this.newTitleData)
    //   });
    // },
  };
  </script>
  
  
  <style>
  .test-button {
    position:absolute;
    left: 0px;
    top: 10px;
  }
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .inner-container {
    display: flex;
    flex: 1; /* take up all remaining space */
    height: 95%;
  }
  .title-container {
    display: flex;
    justify-content: space-between; /* 将内容左中右横向排布 */
    align-items: center; /* 垂直方向居中对齐 */
    text-align: center;
    padding: 3px;
    background-color: #5AB2B8;  
    height: 5%;  
    
  }
  .title-center {
    flex: 1; /* 自动占据剩余的空间 */
    text-align: center; /* 文字居中 */
  }
  .title-buttons {
    display: flex;
    justify-content: flex-end; /* 将按钮放置在容器的右侧 */
    align-items: center; /* 垂直居中按钮 */
  }
  .title-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-right: 20px;
    /* width: 30px;
    height: 30px; */

    /* background-color: #000; */
    /* width: 55px; */
    /* height: 55px; */
    /* border-radius: 109px;  */
    /* border: 2px solid #fff; */
    /* filter: drop-shadow(0px 0px 6px rgba(209, 209, 209, 0.8)); */
    
  }
  /* 图片样式可以根据需要设置宽高等 */
  .title-button img {
    position: relative;
    top: 2px;
    width: 32px;
    height: 32px;
  }
  .title-button:hover{
    transform: scale(1.1) !important;
  }

  a.title {
    text-decoration: none;
    color: #FFF;
    font-family: Avenir;
    font-size: 18px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    align-items: center; /* 垂直方向居中对齐标题 */
  }

  a.title:hover {
    text-decoration: underline;
  }
  .Flow-Wrapper{
    width: 80%;
  }
  
  
  .ChatView-Wrapper{
    width: 30%;
    background: #EDF7F8;
    border: 1px solid #B4B4B4;
  }
  </style>