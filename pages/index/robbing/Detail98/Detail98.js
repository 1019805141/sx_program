// pages/index/robbing/Detail398/Detail398.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endTime: '2030-03-21 10:40:30',
    id:null,
    detail:{},
    ipUrl:null,
    appraisesList:[],
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
    var that = this;
    that.setData({
      id:options.id,
      ipUrl:app.globalData.ipUrl
    })
    that.loadDetail()
    that.countDown()
  },
  loadDetail:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/activity/course', {
      id:that.data.id,
      type:2
    }, "GET")
      .then(res => {

        var data = res.data.appraises
        if(data.length>0){
          for(var i = 0;i<data.length; i++){
            var xiaoshu = data[i].grade
            data[i].grade = +data[i].grade
            if(xiaoshu.split('.')[1]){
              data[i].xiaoshu = true
              data[i].xiaozhuz = xiaoshu.split('.')[0]
            }else{
              data[i].xiaoshu = false
            }
          }
        }
        that.setData({
          detail:res.data,
          endTime:res.data.end_time,
          appraisesList:data
        })
        wx.hideLoading()
      })
  },

  // 倒计时
  countDown:function(){
    var that=this;
    var nowTime = new Date().getTime();//现在时间（时间戳）
    var endtime=this.data.endTime.replace(new RegExp("-","gm"),"/")
    var endTime = new Date(endtime).getTime();//结束时间（时间戳）
    var time = (endTime-nowTime)/1000;//距离结束的毫秒数
    // 获取天、时、分、秒
    let day = parseInt(time / (60 * 60 * 24));
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    // console.log(day + "," + hou + "," + min + "," + sec)
    day = that.timeFormin(day),
    hou = that.timeFormin(hou),
    min = that.timeFormin(min),
    sec = that.timeFormin(sec)
    that.setData({
      day: that.timeFormat(day),
      hou: that.timeFormat(hou),
      min: that.timeFormat(min),
      sec: that.timeFormat(sec)
    })
    // 每1000ms刷新一次
    if (time>0){
      that.setData({
        countDown: true
      })
      setTimeout(this.countDown, 1000);
    }else{
      that.setData({
        countDown:false
      })
    }
  },
  //小于10的格式化函数（2变成02）
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //小于0的格式化函数（不会出现负数）
  timeFormin(param) {
    return param < 0 ? 0: param;
  },
goPay:function(e){
  var id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '../pay98/pay98?id='+id,
  })
},
goinDetail:function(e){
  console.log(e)
  var id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '../../../org/org?id=' +id
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