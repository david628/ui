/*Vue.component('todo-item', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
});
var app7 = new Vue({
  el: '#app-7',
  data: {
    groceryList: [
      {text: 'Vegetables'},
      {text: 'Cheese'},
      {text: 'Whatever else humans are supposed to eat'}
    ]
  }
});*/
//注册组件
/*Vue.component('my-component', {
  // 模板
  template: '<div>{{msg}} {{privateMsg}}</div>',
  // 接受参数
  props: {
    msg: String<br>    
  },
  // 私有数据，需要在函数中返回以避免多个实例共享一个对象
  data: function () {
    return {
      privateMsg: 'component!'
    }
  }
});*/
Vue.component('grid', {
  // 模板
  template: '<div>{{msg}} {{privateMsg}}</div>',
  // 私有数据，需要在函数中返回以避免多个实例共享一个对象
  data: {
  	privateMsg: 'component!'
  }
});
var app7 = new Vue({
  el: '#id-test',
  data: {
  	msg: "sdfsdfsdf"
  }
});