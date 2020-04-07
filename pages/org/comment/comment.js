// pages/org/comment/comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    appraisesList: [],
    xingji: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      id: options.id
    })
    that.loadAppraises()
  },
  loadAppraises: function (id) {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/institution/appraises', {
        id: that.data.id,
        index: 0,
        size: 5
      }, "GET")
      .then(res => {
        console.log(res, '11111')
        var data = res.data[0].appraises
        if (res.data[0].appraise.length > 0) {
          var dataz = res.data[0].appraise[0]
          var dataxiaoshu = res.data[0].appraise[0].aggregate + ''
          // 总评分星级判断
          if (dataxiaoshu.split('.')[1]) {
            dataz.xiaoshu = true
            dataz.xiaoshuz = dataxiaoshu.split('.')[0]
          } else {
            dataz.xiaoshu = false
            dataz.xiaoshu = dataxiaoshu
          }
        }

        if (data.length > 0) {
          // 列表星级遍历
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
          appraisesList: res.data[0].appraises,
          xingji: res.data[0].appraise[0]
        })
        wx.hideLoading()
      })
  },
  goIndex: function () {
    wx.redirectTo({
      url: '../org?id=' + this.data.id
    })
  },
  goCurriculum: function () {
    wx.redirectTo({
      url: '../curriculum/curriculum?id=' + this.data.id
    })
  },
  goDemeanor: function () {
    wx.redirectTo({
      url: '../demeanor/demeanor?id=' + this.data.id
    })
  },
  goComment: function () {
    wx.redirectTo({
      url: '../comment/comment?id=' + this.data.id
    })
  },
  goTeacher: function () {
    wx.redirectTo({
      url: '../teacherList/teacherList?id=' + this.data.id
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