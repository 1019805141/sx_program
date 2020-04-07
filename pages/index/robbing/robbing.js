// pages/index/robbing/robbing.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // i机构 e套餐
    i_size: 5,
    e_size: 5,
    i_page: 1,
    e_page: 1,
    i_is_last: 1,
    e_is_last: 1,
    iList: [],
    eList: [],
    ipUrl: null,
    e_last: 'display:none',
    bottomStyle: "display:none",
    adcode:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      ipUrl: app.globalData.ipUrl,
      adcode:options.adcode
    })
    that.loadTaocan()
  },
  loadTaocan: function () {
    var that = this
    var e_page = that.data.e_page
    var i_page = that.data.i_page
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/activity/index', {
        // 机构分页
        i_index: 0,
        i_size: that.data.i_size * i_page,
        // 套餐分页
        e_index: 0,
        e_size: that.data.e_size * e_page
      }, "GET")
      .then(res => {
        that.setData({
          i_is_last: res.data.iList.is_last,
          e_is_last: res.data.eList.is_last,
          iList: res.data.iList.list,
          eList: res.data.eList.list,
        })

        if (that.data.e_is_last == 0) {
          that.setData({
            e_last: 'display:block'
          })
        } else {
          that.setData({
            e_last: 'display:none'
          })
        }

        wx.hideLoading()
      })
  },
  loadEmore: function () {
    this.setData({
      e_page: this.data.e_page + 1
    })
    this.loadTaocan()
  },
  goIdetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'Detail98/Detail98?id=' + id
    })
  },
  goEdetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'meal398/meal398?id=' + id +'&adcode=' + this.data.adcode
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
    var that = this
    var i_page = that.data.i_page
    if (that.data.i_is_last == 1) {
      that.setData({
        bottomStyle: "display:block"
      })
    } else {
      that.setData({
        i_page: that.data.i_page + 1
      })
      that.loadTaocan()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})