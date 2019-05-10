/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 *字典翻译
 *
 * @param {*} dictName //需要翻译的字典名
 * @param {*} dictData //所有的字典数据
//  * @param {*} list   //原始数据 arr [{},{}]
 * @param {*} filed  //需要翻译的字段
 * @param {*} name   //翻译后的字段
 * @returns
 */
export const dictTransle = (dictName, dictData, list, filed, name) => {
  // 从获取的总字典中获取相应的数据
  let needDict = dictData[dictName]
  if (list.length !== 0) {
    for (let item of list) {
      item[name] = needDict[item[filed]]
    }
  }
  return list
}
/**
 *无闪现下载excel
 *
 * @param {*} url
 */
export const iframeDownload = url => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  function iframeLoad () {
    console.log('iframe onload')
    const win = iframe.contentWindow
    const doc = win.document
    if (win.location.href === url) {
      if (doc.body.childNodes.length > 0) {
        // response is error
      }
      iframe.parentNode.removeChild(iframe)
    }
  }
  if ('onload' in iframe) {
    iframe.onload = iframeLoad
  } else if (iframe.attachEvent) {
    iframe.attachEvent('onload', iframeLoad)
  } else {
    iframe.onreadystatechange = function onreadystatechange () {
      if (iframe.readyState === 'complete') {
        iframeLoad()
      }
    }
  }
  iframe.src = ''
  document.body.appendChild(iframe)

  setTimeout(function loadUrl () {
    iframe.contentWindow.location.href = url
  }, 50)
}

/**
 *获取地址栏端口号等信息
 *
 * @returns
 */
export const getRealPath = () => {
  // 获取当前网址，如： http://localhost:8083/myproj/view/my.jsp
  let curWwwPath = window.document.location.href
  // 获取主机地址之后的目录，如： myproj/view/my.jsp
  let pathName = window.document.location.pathname
  let pos = curWwwPath.indexOf(pathName)
  // 获取主机地址，如： http://localhost:8083
  let localhostPaht = curWwwPath.substring(0, pos)
  // 获取带"/"的项目名，如：/myproj
  let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
  // 得到了 http://localhost:8083/myproj
  let realPath = localhostPaht + projectName
  return realPath
}

/**
 *设置标题
 *
 * @param {*} resTitle
 */
export const setTitle = resTitle => {
  window.document.title = resTitle
}
