var Comp = Vue.extend({
  props: ['msg'],
  template: '<div>{{ msg }}</div>'
})
var vm = new Comp({
	el: "#app-7",
  propsData: {
    msg: 'hello'
  }
});