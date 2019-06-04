/*// 创建构造器
var Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建 Profile 实例，并挂载到一个元素上。
new Profile({
	el: "#mount-point"
});*/
var data = {a: 1};
// 直接创建一个实例
var vm = new Vue({
  data: data
});
var vm2 = new Vue({
  data: data
});
//alert(vm.a); // -> 1
//alert(vm.$data === data) // -> true
alert(vm.a);
alert(vm2.a);
vm.a = 2;
alert(vm.a);
alert(vm2.a);



// Vue.extend() 中 data 必须是函数
var Component = Vue.extend({
  data: function () {
    return {a: 1}
  }
})