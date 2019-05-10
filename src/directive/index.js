import Vue from 'vue'
export default () => {
  // 针对 el-input做的限制，只能输入正整数
  Vue.directive('int', {
    bind: function (el) {
      const input = el.getElementsByTagName('input')[0]
      input.onkeyup = function (e) {
        if (input.value.length === 1) {
          input.value = input.value.replace(/[^0-9]/g, '')
        } else {
          input.value = input.value.replace(/[^\d]/g, '')
        }
        trigger(input, 'input')
      }
      input.onblur = function (e) {
        if (input.value.length === 1) {
          input.value = input.value.replace(/[^0-9]/g, '')
        } else {
          input.value = input.value.replace(/[^\d]/g, '')
        }
        trigger(input, 'input')
      }
    }
  })
  // 失去焦点后变为数字
  Vue.directive('numberInt', {
    bind: function (el, binding, vnode) {
      const element = el.getElementsByTagName('input')[0]
      const len = binding.arg // 初始化设置
      element.value = Number(element.value).toFixed(len) // 失焦时候格式化
      element.addEventListener('blur', function () {
        if (isNaN(element.value)) {
          vnode.data.model.callback(0)
        } else {
          vnode.data.model.callback(Number(element.value).toFixed(len))
        }
      })
    }
  })

  // 自动获取焦点
  Vue.directive('focus', {
    inserted (el) {
      // 聚焦元素
      el.focus()
    },
    update (el, binding) {
      // 被绑定
      if (binding.value) {
        el.focus()
      }
    }
  })

  // 2秒之后才可点击
  let timer = null
  Vue.directive('noRepeatClick', {
    inserted (el) {
      el.addEventListener('click', e => {
        el.classList.add('is-disabled')
        el.disabled = true
        timer = setTimeout(() => {
          el.disabled = false
          el.classList.remove('is-disabled')
        }, 2000)
      })
    },
    unbind () {
      clearInterval(timer)
      timer = null
    }
  })
}

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
