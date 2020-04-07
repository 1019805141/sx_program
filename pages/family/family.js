// pages/family/family.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    size:10,
    list:[],
    ipUrl:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    that.setData({
      ipUrl:app.globalData.ipUrl
    })

  },
  onLoadList:function(page,size){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/parents/post', {
      index:page,
      size:size
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
  goMore:function(){
    if(wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined){
      wx.navigateTo({
        url: '../login/index'
      })
    }else{
      wx.navigateTo({
        url: 'more/more'
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
    var that = this
    var page = that.data.page
    var size = that.data.size
    that.onLoadList(page,size)
  },
  goDetail:function(e){
    var id =e.currentTarget.dataset.id
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'details/details?id='+id
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