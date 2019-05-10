export default {
  name: 'DictSubOperat',
  mouted () {},
  data () {},
  methods: {
    edit () {
      this.params.context.componentParent.editSub(this.params.node)
    },
    add () {
      this.params.context.componentParent.addSubSub(this.params.node)
    },
    del () {
      this.params.context.componentParent.delSub(this.params.node)
    }
  }
}
