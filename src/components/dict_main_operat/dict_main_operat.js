export default {
  name: 'DictMainOperat',
  mouted () {},
  data () {},
  methods: {
    edit () {
      this.params.context.componentParent.editMain(this.params.node)
    },
    showSub () {
      this.params.context.componentParent.showSub(this.params.node)
    },
    del () {
      this.params.context.componentParent.delMainRow(this.params.node)
    }
  }
}
