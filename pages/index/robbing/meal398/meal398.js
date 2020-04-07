// pages/index/robbing/meal398/meal398.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endTime: '2030-03-12 10:40:30',
    controls: true,
    showModalStatus: false,
    id:null,
    ipUrl:null,
    educourses:null,
    arr:[],
    xuanze2:'display:none',
    xuanze1:'display:none',
    nums:'',
    adcode:null,
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
    console.log(options)
    var that = this;
    that.setData({
      id:options.id,
      ipUrl:app.globalData.ipUrl,
      adcode:options.adcode
    })
    that.loadList()

  },
  loadList:function(){
    var that =this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/activity/edu', {
      id:that.data.id,
      district_id:that.data.adcode
    }, "GET")
      .then(res => {
        console.log(res,'dsadaddd-------')
        var data = res.data.educourses
        for(var i=0; i<data.length; i++){
          data[i].value = 1
        }
        that.setData({
          endTime:res.data.end_time,
          educourses:data
        })
        console.log(that.data.educourses)
        that.countDown()
        wx.hideLoading()
      })
  },
  // 倒计时
  countDown:function(){
    var that=this;
    var nowTime = new Date().getTime();//现在时间（时间戳）
    var endtime=this.data.endTime.replace(new RegExp("-","gm"),"/")
    var endTime = new Date(endtime).getTime();//结束时间（时间戳）
    console.log(new Date(that.data.endTime),1231312,new Date(that.data.endTime).getTime(),that.data.endTime)
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
    console.log(sec,day,hou,min,'这是为什么',endTime,nowTime)
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

  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例  
    var animation = wx.createAnimation({
      duration: 300, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false,
        });
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  goPay:function(e){
    var that = this
    console.log(that.data.arr,'list')
    var currentStatu = e.currentTarget.dataset.statu;
    if(4 - that.data.arr.length == 1){
      that.setData({
        nums:'一'
      })
    }else if(4 - that.data.arr.length == 2){
      that.setData({
        nums:'二'
      })
    }else if(4 - that.data.arr.length == 3){
      that.setData({
        nums:'三'
      })
    }else if(4 - that.data.arr.length == 4){
      that.setData({
        nums:'四'
      })
    }
    if(that.data.arr.length>4){
      that.setData({
        xuanze2:'display:block',
        xuanze1:'display:none'
      })
      this.util(currentStatu)
      return
    }
    if(that.data.arr.length<4){
      that.setData({
        xuanze2:'display:none',
        xuanze1:'display:block'
      })
      
      this.util(currentStatu)
      return
    }
    var id =that.data.arr.toString()
    wx.navigateTo({
      url: '../pay398/pay398?id='+id,
    })
  },

  checkboxChange: function (e) {
    var that = this
    console.log(e)
    var data = e.detail.value
    var array=[]
    for(var i = 0; i<data.length; i++){
      if(data[i] != null){
        array.push(data[i])
      }
    }
    that.setData({
      arr:array
    })
    console.log(that.data.arr)
  },
  select:function(){
    var that = this
    that.setData({
      showModalStatus: false,
      xuanze2:'display:none',
      xuanze1:'display:none'
    })
  },

  goDetail:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Detail398/Detail398?id='+id
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