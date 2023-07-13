<template>
    <div class="container">
      <!-- <div class="HelloWorld-Wrapper">
        <HelloWorld/>
      </div>         -->
  
      <div class="Flow-Wrapper">
        <x6/>
      </div>
      <div class="ChatView-Wrapper">
        <chatView/>
      </div>
  
    </div>
  
  </template>
  
  <script>
  
  import x6 from '../views/x6.vue';
  import chatView from '../views/chatView.vue';
  
  export default {
    components: {
        x6,
        chatView
    }
  };
  </script>
  
  
  <style>
  .container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  
  
  .Flow-Wrapper{
    width: 80%;
  }
  
  
  .ChatView-Wrapper{
    /* width: 30%; */
    /* background-color: beige; */
  }
  </style>