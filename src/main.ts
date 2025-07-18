import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import "flyonui/flyonui";
import '@preline/overlay';

// 初始化Preline Overlay组件
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM加载完成，初始化Overlay组件');
});

createApp(App).mount('#app')
