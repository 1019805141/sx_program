// pages/index/courseDetails/courseDetails.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: {},
    ipUrl: null,
    appraisesList: null,
    indicatorDots: true,
    vertical: false,
    autoplay: 5000,
    interval: 2000,
    duration: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id,
      ipUrl: app.globalData.ipUrl
    })
    that.loadCourse()
    that.loadPl()
  },
  loadCourse: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    // 加载详情
    app.http('api/course/detail', {
        id: that.data.id,
        token: wx.getStorageSync('openid')
      }, "GET")
      .then(res => {
        console.log(res,'详情')
      
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
                    url: '../index'
                  })
                })
              }, 1000) //延迟时间
            }
          })
        }



        that.setData({
          detail: res.data
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
  // 获取评论
  loadPl: function () {
    var that = this
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
      })
  },
  goBm:function(e){
    var institution_id = e.currentTarget.dataset.institution_id
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'audition/audition?id='+id+'&institution_id='+institution_id
    })
  },
  plMore:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'pingjia/pingjia?id='+id
    })
  },
  goinDetail:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../org/org?id=' +id
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