export default {
  name: 'Page404',
  computed: {
    message () {
      return '页面没有找到......'
    }
  },
  methods: {
    Back () {
      history.go(-1)
    }
  }
}
