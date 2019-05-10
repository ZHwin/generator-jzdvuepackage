export default {
  name: 'DelButton',
  mouted () {},
  data () {},
  methods: {
    //  删除方法
    DelRowData () {
      this.params.context.componentParent.delCurrentData(this.params.node)
    }
  }
}
