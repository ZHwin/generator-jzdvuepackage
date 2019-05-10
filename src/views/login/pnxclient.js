export const JITGWExtInterface = (() => {
  let currentSessionWSURL = ''
  let useActioveX = false

  /**
   * simple polyfill Object.assign for IE <= 11
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
   * @param {Object} target - target options
   * @param {Object} options - new options
   */
  const extendOptions = (target, options) => {
    if (typeof Object.assign === 'function') {
      Object.assign(target, options)
    } else {
      // for IE < 11
      for (const key in options) {
        target[key] = options[key]
      }
    }
  }

  const options = {}

  const checkSessionWSURL = () => {
    if (currentSessionWSURL === '') {
      if (document.location.protocol === 'https:') {
        currentSessionWSURL = SendAndWaitMessage(
          'http://127.0.0.1:10087/',
          'QueryService'
        )
      } else {
        currentSessionWSURL = SendAndWaitMessage(
          'http://127.0.0.1:10086/',
          'QueryService'
        )
      }
    }
  }

  // 是否是IE
  const isUseActioveX = () => {
    if (Boolean(window.ActiveXObject) || 'ActiveXObject' in window) {
      try {
        // eslint-disable-next-line no-unused-vars
        const ax = new ActiveXObject('PNXClient.PNXDataTrans')
        useActioveX = true
      } catch (e) {
        useActioveX = false
      }
    } else {
      useActioveX = false
    }
  }

  const addActioveX = () => {
    document.write(
      "<object classid='clsid:9DD991F7-6FB0-4004-95A4-0A55006A8C42' width='0' height='0' id='PNXGWClient'></object>"
    )
  }

  const SendAndWaitMessageEx = (operatorCmd, sendMsg) => {
    checkSessionWSURL()
    const strSendMsg = `${operatorCmd}:${sendMsg}`

    return SendAndWaitMessage(currentSessionWSURL, strSendMsg)
  }

  var SendAndWaitMessage = (wsurl, sendMsg) => {
    let ResultMsg = '{"value":""}'

    if (ResultMsg === wsurl) {
      return
    }
    try {
      const globalXmlHttpRequest = new XMLHttpRequest()
      globalXmlHttpRequest.open('POST', wsurl, false)
      globalXmlHttpRequest.setRequestHeader(
        'Content-Type',
        'text/plain;charset=UTF-8'
      )
      globalXmlHttpRequest.send(sendMsg)
      ResultMsg = globalXmlHttpRequest.responseText
    } catch (e) {
      currentSessionWSURL = ''
      if (options.onError) {
        options.onError.call(undefined, e)
      }
    }
    return ResultMsg
  }

  return {
    Config (extendOption) {
      if (extendOption && typeof extendOption === 'object') {
        extendOptions(options, extendOption)
      }
    },
    Init () {
      isUseActioveX()
      if (useActioveX) {
        addActioveX()
      }
    },
    // 功能：返回客户端的版本 HRESULT GetClientVersion([out,retval] BSTR* bstrClientVersion);
    GetClientVersion () {
      if (useActioveX) {
        return PNXGWClient.GetClientVersion()
      }
      const result = JSON.parse(SendAndWaitMessageEx('GetClientVersion', ''))
      return result.Version
    },

    // 功能：下载客户端程序并安装 HRESULT SetupClient([in] BSTR strURL, [in] BSTR strHashValue, [in] BOOL bSync, [in] BOOL bOnlySSO, [out,retval] LONG* lRetVal);
    SetupClient (bstrURL, bstrHashValue, bSync, bOnlySSO) {
      if (useActioveX) {
        return PNXGWClient.SetupClient(bstrURL, bstrHashValue, bSync, bOnlySSO)
      }
      const jsonstr = {
        strURL: bstrURL,
        strHashValue: bstrHashValue,
        bSync: bSync,
        bOnlySSO: bOnlySSO
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('SetupClient', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：获取硬件指纹信息 HRESULT GetFinger([in] ULONG dwSign, [in] BSTR strGateWayIP, [out,retval] BSTR* bstrFinger);
    GetFinger (dwSign, strGateWayIP) {
      if (useActioveX) {
        return PNXGWClient.GetFinger(dwSign, strGateWayIP)
      }
      const jsonstr = { dwSign: dwSign, strGateWayIP: strGateWayIP }
      const result = JSON.parse(
        SendAndWaitMessageEx('GetFinger', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：设置转发策略和代填策略 HRESULT SetPolicy([in] BSTR strProxyPolicy, [in] BSTR strSSOPolicy, [in] BSTR strGatewayAddress, [out,retval] LONG* lRetVal);
    SetPolicy (strProxyPolicy, strSSOPolicy, strGatewayAddress) {
      if (useActioveX) {
        return PNXGWClient.SetPolicy(
          strProxyPolicy,
          strSSOPolicy,
          strGatewayAddress
        )
      }
      const jsonstr = {
        strProxyPolicy: strProxyPolicy,
        strSSOPolicy: strSSOPolicy,
        strGatewayAddress: strGatewayAddress
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('SetPolicy', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：启动认证信息模块 HRESULT GetAuthToken([in] BSTR strFileName,[in] BSTR strXmlData,[out,retval] BSTR* bstrInfo);
    GetAuthToken (strFileName, strXmlData) {
      if (useActioveX) {
        return PNXGWClient.GetAuthToken(strFileName, strXmlData)
      }
      const jsonstr = { strFileName: strFileName, strXmlData: strXmlData }
      const result = JSON.parse(
        SendAndWaitMessageEx('GetAuthToken', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：打开BS应用 HRESULT NavigateURL([in] BSTR strUrl, [out,retval] LONG* lRetVal);
    NavigateURL (strUrl) {
      if (useActioveX) {
        return PNXGWClient.NavigateURL(strUrl)
      }
      const jsonstr = { strUrl: strUrl }
      const result = JSON.parse(
        SendAndWaitMessageEx('NavigateURL', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：打开CS应用 HRESULT ExecuteCS([in] BSTR strGatewayAddress, [in] BSTR strAppFlag, [in] BSTR strAppPath, [out,retval] LONG* lRetVal);
    ExecuteCS (strGatewayAddress, strAppFlag, strAppPath) {
      if (useActioveX) {
        return PNXGWClient.ExecuteCS(strGatewayAddress, strAppFlag, strAppPath)
      }
      const jsonstr = {
        strGatewayAddress: strGatewayAddress,
        strAppFlag: strAppFlag,
        strAppPath: strAppPath
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('ExecuteCS', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：设置自动更新策略 HRESULT SetUpdatePolicy([in] BSTR strGatewayAddress, [in] SHORT nGatewayPort, [in] BSTR strUserToken, [in] ULONG ulUpdateDelay, [out, retval] LONG* lRetVal);
    SetUpdatePolicy (
      strGatewayAddress,
      nGatewayPort,
      strUserToken,
      updatedelay
    ) {
      if (useActioveX) {
        return PNXGWClient.SetUpdatePolicy(
          strGatewayAddress,
          nGatewayPort,
          strUserToken,
          updatedelay
        )
      }
      const jsonstr = {
        strGatewayAddress: strGatewayAddress,
        nGatewayPort: nGatewayPort,
        strUserToken: strUserToken,
        ulUpdateDelay: ulUpdateDelay
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('SetUpdatePolicy', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：获取客户端IP HRESULT GetClientIP([in] BSTR strGatewayIP, [out, retval] BSTR* RetVal);
    GetClientIP (strGatewayIP) {
      if (useActioveX) {
        return PNXGWClient.GetClientIP(strGatewayIP)
      }
      const jsonstr = { strGatewayIP: strGatewayIP }
      const result = JSON.parse(
        SendAndWaitMessageEx('GetClientIP', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：登出网关 HRESULT GWLogout([in] BSTR strServerIP, [out, retval] LONG* lRetVal);
    GWLogout (strServerIP) {
      if (useActioveX) {
        return PNXGWClient.GWLogout(strServerIP)
      }
      const jsonstr = { strServerIP: strServerIP }
      const result = JSON.parse(
        SendAndWaitMessageEx('GWLogout', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：运行安装包: 0 非静默安装，1 静默安装，2 同步安装，4 异步安装 HRESULT RunSetup([in] LONG lRunType, [in] BOOL bIsOnlySSO, [out, retval] LONG* lRetVal);
    RunSetup (lRunType, bIsOnlySSO) {
      if (useActioveX) {
        return PNXGWClient.RunSetup(lRunType, bIsOnlySSO)
      }
      const jsonstr = { lRunType: lRunType, bIsOnlySSO: bIsOnlySSO }
      const result = JSON.parse(
        SendAndWaitMessageEx('RunSetup', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：获取下载进度 HRESULT GetDownloadProgress([out, retval] LONG* lRetVal);
    GetDownloadProgress () {
      if (useActioveX) {
        return PNXGWClient.GetDownloadProgress()
      }
      const jsonstr = ''
      const result = JSON.parse(
        SendAndWaitMessageEx('GetDownloadProgress', jsonstr)
      )
      return result.value
    },

    // 功能：是否安装完成 HRESULT IsInstallComplete([out, retval] BOOL* lRetVal);
    IsInstallComplete () {
      if (useActioveX) {
        return PNXGWClient.IsInstallComplete()
      }
      const jsonstr = ''
      const result = JSON.parse(
        SendAndWaitMessageEx('IsInstallComplete', jsonstr)
      )
      return result.value
    },

    // 功能：初始化签包对象 HRESULT Initialize([in] BSTR strAlgType, [in] BSTR strAuxParam, [out,retval] LONG* Result);
    Initialize (strAlgType, strAuxParam) {
      if (useActioveX) {
        return PNXGWClient.Initialize(strAlgType, strAuxParam)
      }
      const jsonstr = { strAlgType: strAlgType, strAuxParam: strAuxParam }
      const result = JSON.parse(
        SendAndWaitMessageEx('Initialize', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：设置摘要算法 HRESULT SetDigestAlg([in] BSTR strDigestAlg, [out,retval] LONG* Result);
    SetDigestAlg (strDigestAlg) {
      if (useActioveX) {
        return PNXGWClient.SetDigestAlg(strDigestAlg)
      }
      const jsonstr = { strDigestAlg: strDigestAlg }
      const result = JSON.parse(
        SendAndWaitMessageEx('SetDigestAlg', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：设置单证书是否弹出对话框 HRESULT SetChooseSingleCert([in] ULONG isChoose, [out,retval] LONG* Result);
    SetChooseSingleCert (isChoose) {
      if (useActioveX) {
        return PNXGWClient.SetChooseSingleCert(isChoose)
      }
      const jsonstr = { isChoose: isChoose }
      const result = JSON.parse(
        SendAndWaitMessageEx('SetChooseSingleCert', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：添加证书过滤条件 HRESULT AddFilter([in] ULONG ulType, [in] BSTR strValue, [out,retval] LONG* Result);
    AddFilter (ulType, strValue) {
      if (useActioveX) {
        return PNXGWClient.AddFilter(ulType, strValue)
      }
      const jsonstr = { ulType: ulType, strValue: strValue }
      const result = JSON.parse(
        SendAndWaitMessageEx('AddFilter', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：清除所有过滤条件 HRESULT ClearFilter([out,retval] LONG* Result);
    ClearFilter () {
      if (useActioveX) {
        return PNXGWClient.ClearFilter()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('ClearFilter', jsonstr))
      return result.value
    },

    // 功能：P1签名 HRESULT P1Sign([in] BSTR strValueBase64, [out,retval] BSTR* Result);
    P1Sign (strValueBase64) {
      if (useActioveX) {
        return PNXGWClient.P1Sign(strValueBase64)
      }
      const jsonstr = { strValueBase64: strValueBase64 }
      const result = JSON.parse(
        SendAndWaitMessageEx('P1Sign', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：P1签名字符串 HRESULT P1SignString([in] BSTR strValue, [out,retval] BSTR* Result);
    P1SignString (strValue) {
      if (useActioveX) {
        return PNXGWClient.P1SignString(strValue)
      }
      const jsonstr = { strValue: strValue }
      const result = JSON.parse(
        SendAndWaitMessageEx('P1SignString', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：P7签名 HRESULT P7Sign([in] BSTR strValueBase64,[in] VARIANT_BOOL isDetach,[in] VARIANT_BOOL isIncludeCert, [out,retval] BSTR* Result);
    P7Sign (strValueBase64, isDetach, isIncludeCert) {
      if (useActioveX) {
        return PNXGWClient.P7Sign(strValueBase64, isDetach, isIncludeCert)
      }
      const jsonstr = {
        strValueBase64: strValueBase64,
        isDetach: isDetach,
        isIncludeCert: isIncludeCert
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('P7Sign', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：P7签名字符串 HRESULT P7SignString([in] BSTR strValue,[in] VARIANT_BOOL isDetach,[in] VARIANT_BOOL isIncludeCert, [out,retval] BSTR* Result);
    P7SignString (strValue, isDetach, isIncludeCert) {
      if (useActioveX) {
        return PNXGWClient.P7SignString(strValue, isDetach, isIncludeCert)
      }
      const jsonstr = {
        strValue: strValue,
        isDetach: isDetach,
        isIncludeCert: isIncludeCert
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('P7SignString', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：释放签名对象 HRESULT Finalize([out,retval] LONG* Result);
    Finalize () {
      if (useActioveX) {
        return PNXGWClient.Finalize()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('Finalize', jsonstr))
      return result.value
    },

    // 功能：获取签名版本 HRESULT GetSignVersion([out,retval] BSTR* Result);
    GetSignVersion () {
      if (useActioveX) {
        return PNXGWClient.GetSignVersion()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('GetSignVersion', jsonstr))
      return result.value
    },

    // 功能：获取签名证书 HRESULT GetSignCert([out,retval] BSTR* RetCert);
    GetSignCert () {
      if (useActioveX) {
        return PNXGWClient.GetSignCert()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('GetSignCert', jsonstr))
      return result.value
    },

    // 功能：获取错误码 HRESULT GetLastError([out,retval] ULONG* RetLong);
    GetLastError () {
      if (useActioveX) {
        return PNXGWClient.GetLastError()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('GetLastError', jsonstr))
      return result.value
    },

    // 功能：获取错误信息 HRESULT GetLastErrorMessage([out,retval] BSTR* RetStr);
    GetLastErrorMessage () {
      if (useActioveX) {
        return PNXGWClient.GetLastErrorMessage()
      }
      const jsonstr = ''
      const result = JSON.parse(
        SendAndWaitMessageEx('GetLastErrorMessage', jsonstr)
      )
      return result.value
    },

    // 功能：销毁认证对象 HRESULT DestoryAuth([out,retval] LONG* lRetVal);
    DestoryAuth () {
      if (useActioveX) {
        return PNXGWClient.DestoryAuth()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('DestoryAuth', jsonstr))
      return result.value
    },

    // 功能：获取证书类型 HRESULT GetSignCertType([out,retval] BSTR* RetCertType);
    GetSignCertType () {
      if (useActioveX) {
        return PNXGWClient.GetSignCertType()
      }
      const jsonstr = ''
      const result = JSON.parse(
        SendAndWaitMessageEx('GetSignCertType', jsonstr)
      )
      return result.value
    },

    // 功能：获取签名摘要算法 HRESULT GetSignHash([out,retval] BSTR* RetSignHash);
    GetSignHash () {
      if (useActioveX) {
        return PNXGWClient.GetSignHash()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('GetSignHash', jsonstr))
      return result.value
    },

    // 功能：使能调用序列 HRESULT CallQueueEnable([in] BOOL bCallQueueEnable, [in] BOOL bHeadInfoEnable, [out,retval] LONG* lRetVal);
    CallQueueEnable (bCallQueueEnable, bHeadInfoEnable) {
      if (useActioveX) {
        return PNXGWClient.CallQueueEnable(bCallQueueEnable, bHeadInfoEnable)
      }
      const jsonstr = {
        bCallQueueEnable: bCallQueueEnable,
        bHeadInfoEnable: bHeadInfoEnable
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('CallQueueEnable', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：清空调用序列结果 HRESULT CallQueueClear([out,retval] LONG* lRetVal);
    CallQueueClear () {
      if (useActioveX) {
        return PNXGWClient.CallQueueClear()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('CallQueueClear', jsonstr))
      return result.value
    },

    // 功能：获取调用序列结果 HRESULT CallQueueGet([out,retval] BSTR* bstrRetVal);
    CallQueueGet () {
      if (useActioveX) {
        return PNXGWClient.CallQueueGet()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('CallQueueGet', jsonstr))
      return result.value
    },

    // 功能：客户端安全策略检查 HRESULT DoClientSecurityCheck([in] BSTR strGatewayAddress, [in] SHORT usGatewayPort, [in] BSTR strSecurityPolicys, [out,retval] BOOL* RetVal);
    DoClientSecurityCheck (
      strGatewayAddress,
      usGatewayPort,
      strSecurityPolicys
    ) {
      if (useActioveX) {
        return PNXGWClient.DoClientSecurityCheck(
          strGatewayAddress,
          usGatewayPort,
          strSecurityPolicys
        )
      }
      const jsonstr = {
        strGatewayAddress: strGatewayAddress,
        usGatewayPort: usGatewayPort,
        strSecurityPolicys: strSecurityPolicys
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('DoClientSecurityCheck', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：获取通讯协议版本 HRESULT GetProtocolVersion([out,retval] BSTR* strProtocolVersion);
    GetProtocolVersion () {
      if (useActioveX) {
        return PNXGWClient.GetProtocolVersion()
      }
      const jsonstr = ''
      const result = JSON.parse(
        SendAndWaitMessageEx('GetProtocolVersion', jsonstr)
      )
      return result.value
    },

    // 功能：修改Key的Pin码 HRESULT ChangePinCode([in] BSTR strCertSn, [in] LONG lPinCodeType, [in] BSTR strCurPinCode, [in] BSTR strNewPinCode, [out,retval] LONG *pRet);
    ChangePinCode (strCertSn, lPinCodeType, strCurPinCode, strNewPinCode) {
      if (useActioveX) {
        return PNXGWClient.ChangePinCode(
          strCertSn,
          lPinCodeType,
          strCurPinCode,
          strNewPinCode
        )
      }
      const jsonstr = {
        strCertSn: strCertSn,
        lPinCodeType: lPinCodeType,
        strCurPinCode: strCurPinCode,
        strNewPinCode: strNewPinCode
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('ChangePinCode', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：等待策略设置完毕 HRESULT WaitSetPolicyFinish([in] BSTR strGatewayAddress, [out,retval] LONG* lRetVal);
    WaitSetPolicyFinish (strGatewayAddress) {
      if (useActioveX) {
        return PNXGWClient.WaitSetPolicyFinish(strGatewayAddress)
      }
      const jsonstr = { strGatewayAddress: strGatewayAddress }
      const result = JSON.parse(
        SendAndWaitMessageEx('WaitSetPolicyFinish', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：获取会话Token HRESULT GetSessionToken([in] BSTR strGatewayAddress, [out,retval] BSTR* bstrToken);
    GetSessionToken (strGatewayAddress) {
      if (useActioveX) {
        return PNXGWClient.GetSessionToken(strGatewayAddress)
      }
      const jsonstr = { strGatewayAddress: strGatewayAddress }
      const result = JSON.parse(
        SendAndWaitMessageEx('GetSessionToken', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：获取控件版本 HRESULT GetVersion([out,retval] BSTR* bstrRetVal);
    GetVersion () {
      if (useActioveX) {
        return PNXGWClient.GetVersion()
      }
      const jsonstr = ''
      const result = JSON.parse(SendAndWaitMessageEx('GetVersion', jsonstr))
      console.log(result)
      return result.value
    },

    // 功能：设置语言资源 HRESULT SetLanguage([in] BSTR strLanguage, [out,retval] LONG* Result);
    SetLanguage (strLanguage) {
      if (useActioveX) {
        return PNXGWClient.SetLanguage(strLanguage)
      }
      const jsonstr = { strLanguage: strLanguage }
      const result = JSON.parse(
        SendAndWaitMessageEx('SetLanguage', JSON.stringify(jsonstr))
      )
      return result.value
    },

    // 功能：获取用户属性 HRESULT GetAttribute([in] BSTR strGatewayAddress, [in] BSTR strAppFlag, [in] BSTR strAttributeName, [out, retval] BSTR* attributevalue);
    GetAttribute (strGatewayAddress, strAppFlag, strAttributeName) {
      if (useActioveX) {
        return PNXGWClient.GetAttribute(
          strGatewayAddress,
          strAppFlag,
          strAttributeName
        )
      }
      const jsonstr = {
        strGatewayAddress: strGatewayAddress,
        strAppFlag: strAppFlag,
        strAttributeName: strAttributeName
      }
      const result = JSON.parse(
        SendAndWaitMessageEx('GetAttribute', JSON.stringify(jsonstr))
      )
      return result.value
    }
  }
})()
