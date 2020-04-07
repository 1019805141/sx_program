// pages/index/courseDetails/pingjia/pingjia.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    appraisesList:[],
    ipUrl:null,
    bottomStyle: "display:none",
    is_last:1, 
    page:1,
    size:20
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
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/course/appraises', {
        id: that.data.id
      }, "GET")
      .then(res => {
        if (res.data.length > 0) {
          var data = res.data
          data.map(function (zz) {
            if (zz.grade.split('.')[1]) {
              zz.xiaoshu = true
              zz.xiaoshuz = zz.grade.split('.')[0]
            } else {
              zz.xiaoshu = false
              zz.xiaoshuz = zz.grade
            }
            zz.grade = +zz.grade
          })
        }
        that.setData({
          appraisesList: res.data
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