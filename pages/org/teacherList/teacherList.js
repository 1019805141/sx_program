// pages/org/teacherList/teacherList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    coursesList:[],
    ipUrl:null,
    page:1,
    size:8,
    is_last:1,
    bottomStyle: "display:none",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    that.setData({
      id:options.id,
      ipUrl:app.globalData.ipUrl
    })
    var page = that.data.page
    that.onloadTeacher(page)
  },
  onloadTeacher:function(page){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    var page = that.data.page
    app.http('api/institution/teachers', {
      institution_id: that.data.id,
      index: 0,
      size:page * that.data.size
    }, "GET")
    .then(res => {
      that.setData({
        is_last:res.data.is_last,
        coursesList:res.data.list
      })
      wx.hideLoading()
    })
  },
  goDe:function(e){
    var id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: '../teacherDe/teacherDe?id='+id
    })
  },
  goIndex:function(){
    wx.redirectTo({
      url: '../org?id='+this.data.id
    })
  },
  goCurriculum:function(){
    wx.redirectTo({
      url: '../curriculum/curriculum?id='+this.data.id
    })
  },
  goDemeanor:function(){
    wx.redirectTo({
      url: '../demeanor/demeanor?id='+this.data.id
    })
  },
  goComment:function(){
    wx.redirectTo({
      url: '../comment/comment?id='+this.data.id
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
    var page = that.data.page
    if (that.data.is_last == 1) {
      that.setData({
        bottomStyle: "display:block"
      })
    } else {
      that.setData({
        page: that.data.page + 1
      })
      that.onloadTeacher(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})