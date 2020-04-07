// pages/login/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello',
    userInfo: {},
    hasUserInfo: false,
    getUserInfoFail: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          this.setData({
            getUserInfoFail: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.login();
    } else {
      this.openSetting();
    }
  },

  // 登录
  login: function () {
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            //由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //所以此处加入 callback 以防止这种情况
            app.globalData.userInfo = res.userInfo
            app.http('api/login', {
                code: code
              }, "POST")
              .then(res => {
                console.log(res, '登录')

                // let result = JSON.stringify(res);
                wx.setStorageSync('openid', res.data.token)
                app.globalData.openid = res.data.token

                // 更新用户信息
                app.http('api/user/loginInfo', {
                    token: wx.getStorageSync('openid'),
                    avatar: app.globalData.userInfo.avatarUrl,
                    nickname: app.globalData.userInfo.nickName
                  }, "POST")
                  .then(rel => {
                    console.log(rel, '更新用户信息')
                    wx.hideLoading()
                  })

                // 更新坐标信息
                app.http('api/user/location', {
                    longitude: wx.getStorageSync('longitude'),
                    latitude: wx.getStorageSync('latitude'),
                    token:wx.getStorageSync('openid')
                  }, "POST")
                  .then(res => {
                    console.log(res,'更新坐标成功')
                  })

                // 获取用户信息
                app.http('api/user/info', {
                    token: wx.getStorageSync('openid')
                  }, "GET")
                  .then(ress => {
                    console.log(ress, '用户信息')
                    wx.setStorageSync('userInfo', ress.data)
                    wx.hideLoading()
                  })
                wx.navigateBack({
                  delta: 1
                })
                // wx.switchTab({
                //   url: '../index/index',
                // })
                // wx.redirectTo({
                //   url: '../index/index'
                // })
                // if (200 == res.flag) {

                // } else{
                //   wx.showToast({
                //     title: res.msg,
                //     icon: "none",
                //     duration: 2000
                //   })
                // }

              })

            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }

            //平台登录
          },
          fail: function (res) {
            that.setData({
              getUserInfoFail: true
            })

          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.login();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})