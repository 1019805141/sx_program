// pages/my/myBuyDetail/myBuyDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ipUrl:null,
    id:null,
    content:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id:options.id,
      ipUrl:app.globalData.ipUrl
    })
    app.http('api/user/order/detail', {
      token:wx.getStorageSync('openid'),
      id:that.data.id
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
                  url: '../../index/index'
                })
              })
            }, 1000) //延迟时间
          }
        })
      }
      console.log(res,'1232132131')
      that.setData({
        content:res.data
      })
      wx.hideLoading()
    })
  },
  goPay:function(){
    var that = this

    var name = that.data.content.name
    var tel = that.data.content.tel
    var age = that.data.content.age
    var order_no = that.data.content.order_no
    var type = that.data.content.type

    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/order/pay', {
      order_id:that.data.id,
      token:wx.getStorageSync('openid')
    }, "POST")
    .then(res => {
      console.log(res,'支付')
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success (res) { 
          wx.redirectTo({
            url: '../../index/robbing/paySuccess/paySuccess?id=' + that.data.id,
          })
        },
        fail (res) { }
      })
      wx.hideLoading()
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