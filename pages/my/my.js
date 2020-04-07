// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    console.log(app.globalData.userInfo,'xxxx')
    console.log(wx.getStorageSync('openid'),'32323333')
    var that = this
    

    if(wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == ''){
      that.setData({
        user:null
      })
    }else{
      app.http('api/user/info', {
        token:wx.getStorageSync('openid'),
      }, "GET")
      .then(res => {
        if(res.status_code == 401){
          wx.showToast({
            title: '登录超时，重新登录中..',
            duration: 2000,
            icon: 'none',
            success(data) {
              setTimeout(function () {
                app.http('api/refresh', {
                  token: wx.getStorageSync('openid')
                }, "POST").then(res => {
                  wx.setStorageSync('openid', res.data.token)
                  wx.switchTab({
                    url: '../index/index'
                  })
                })
              }, 1000) //延迟时间
            }
          })
        }
        wx.setStorageSync('userInfo', res.data)
        
        that.setData({
          user:wx.getStorageSync('userInfo')
        })
        console.log(that.data.user)
        wx.hideLoading()
      })
    }
  },
  goLogin:function(){
    wx.navigateTo({
      url: '../login/index'
    })
  },
  goUserinfo:function(){
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'userInfo/userInfo'   
      })
    }
  },
  goCash:function(){
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'coupon/coupon'   
      })
    }
  },
  goAudi:function(){
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'myAuditioning/myAuditioning'   
      })
    }
  },
  goBuy:function(){
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'myBuy/myBuy'   
      })
    }
  },
  goSele:function(){
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'settled/settled'   
      })
    }
  },
  goComment:function(){
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'myComment/myComment'   
      })
    }
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