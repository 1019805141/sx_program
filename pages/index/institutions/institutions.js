// pages/index/institutions/institutions.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orgList: [],
    is_last:1,
    ipUrl:null,
    bottomStyle: "display:none",
    page:1,
    size:8
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      ipUrl:app.globalData.ipUrl
    })
    var page = that.data.page
    that.loadNearg()
  },
 // 附近机构
 loadNearg: function () {
  var that = this
  wx.showLoading({ //显示 loading 提示框
    title: "加载中..."
  })
  var page = that.data.page
  app.http('api/institution/nearby', {
      index: 1,
      size: page * that.data.size
    }, "GET")
    .then(res => {
      res.data.list.map(function (zz) {
        if (zz.appraise.length > 0) {
          var xiaoshu = zz.appraise[0].aggregate + ''
          if (xiaoshu.split('.')[1]) {
            zz.appraise[0].xiaoshu = true
            zz.appraise[0].xiaoshuz = xiaoshu.split('.')[0]
          } else {
            zz.appraise[0].xiaoshu = false
          }
        }
      })
      that.setData({
        orgList: res.data.list,
        is_last:res.data.is_last
      })
      wx.hideLoading()
    })
},
 // 拨打电话
 goTel: function (e) {
  var that = this
  var tel = e.currentTarget.dataset.tel
  var id = e.currentTarget.dataset.id
  wx.makePhoneCall({
    phoneNumber: tel,
    success: function () {
      // 更新拨打电话次数
      app.http('api/institution/call', {
          id: id
        }, "POST")
        .then(res => {})
    },
  })
},
goInstitutionDetail: function (e) {
  var that = this
  var id = e.currentTarget.dataset.id
  if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
    wx.navigateTo({
      url: '../../login/index'
    })
  } else {
    wx.navigateTo({
      url: '../../org/org?id=' + id
    })
  }
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
    var that = this
    var page = that.data.page
    if (that.data.is_last == 1) {
      that.setData({
        bottomStyle: "display:block"
      })
    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.loadNearg(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})