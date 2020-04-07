// pages/family/more/more.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    ipUrl:null,
    page:1,
    size:8,
    is_last:1,
    bottomStyle: "display:none",
    title:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    that.setData({
      ipUrl:app.globalData.ipUrl
    })
 
    var page = that.data.page

    app.http('api/parents/post/head', {
    }, "GET")
    .then(res => {
      that.setData({
        title:res.data
      })  
    })



    that.onLoadList(page)




  },
  onLoadList:function(page){
    var that = this
    var page = that.data.page
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/parents/post', {
      index:0,
      size:that.data.size * page
    }, "GET")
    .then(res => {
      var dataList = res.data.list
      if(dataList.length>0){
        dataList.forEach((item) =>{
          item.updated_at = item.updated_at.split(' ')
        })
      }
      that.setData({
        list: dataList
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
      that.onLoadList(page)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})