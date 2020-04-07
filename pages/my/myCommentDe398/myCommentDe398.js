// pages/my/myCommentDe/myCommentDe.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ipUrl:null,
    id:null,
    type:null,
    list:null,
    ipUrl:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      ipUrl:app.globalData.ipUrl,
      id:options.id,
      type:options.type,
      ipUrl:app.globalData.ipUrl
    })
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/user/appraise/detail', {
      id:that.data.id,
      type:that.data.type,
      token:wx.getStorageSync('openid')
    }, "GET")
    .then(res => {
     console.log(res,'list')
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
      var data = res.data
      if (data.length > 0) {
      data.map(function (zz) {
        if (zz.grade.split('.')[1]) {
          zz.grade = +zz.grade
            zz.xiaoshu = true
            zz.xiaoshuz=xiaoshu.split('.')[0]
          } else {
            zz.grade = +zz.grade
            zz.xiaoshu = false
          }
        })
      }
      that.setData({
        list:data
      })
    console.log(that.data.list)
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