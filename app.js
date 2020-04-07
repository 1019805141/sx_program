//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res,'userinfo')
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              var openid = wx.getStorageSync('openid') || null
              this.globalData.openid = openid
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  http: function (url, data = '', method = "GET") { //封装http请求
    const apiUrl = 'https://tongxueyueke.com/'
    var currency = {}
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: apiUrl + url,
        data: Object.assign(currency, data),
        method: method,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.code != 200) {
          }
          resolve(res.data)
        },
        fail: function (res) {
          reject(res);
        },
        complete: function () {
        }
      })
    })
  },

  globalData: {
    userInfo: null,
    openid:null,
    ipUrl:'https://tongxueyueke.com/uploads/',
    playIndex: 0, //当前播放列表的index
    currentTime: 0, //当前播放时间
    duration: 0, //总时长
  }
})