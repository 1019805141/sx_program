// pages/index/coupon/coupon.js
const app = getApp()
var area = require('../../../utils/area.js')
var areaInfo = []; //所有省市区县数据

var provinces = []; //省

var provinces1 = []; //城市

var provinces2 = []; //区县
var provincea = []
var index = [0, 0, 0];
var index2 = 0
var cellId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    defalu: '请选择',
    hangye: '请选择',
    ipUrl: null,
    adcode: '',
    city_id: '',
    iconList: [],
    category_id: '',
    couponList: [],
    ipUrl: null,
    btnText: '立即领取',
    controls: true,
    showModalStatus: false,
    bannerImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      adcode: options.adcode,
      ipUrl: app.globalData.ipUrl
    })

    provinces = []
    provinces1 = []
    provinces2 = []

    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //省份
      for (var i = 0; i < areaInfo.length; i++) {
        var inde = areaInfo[i].level
        if (inde == 1) {
          provinces.push(areaInfo[i])
        } else if (inde == 2) {
          provinces1.push(areaInfo[i])
        } else {
          provinces2.push(areaInfo[i])
        }
      }
      var code = that.data.adcode.substring(0, 4)
      var provincarr = []
      provinces2.map(function (rz) {
        if (rz.code.substring(0, 4) == code) {
          provincarr.push(rz)
        }
      })
      provincarr.splice(0, 1)
      that.setData({
        array: provincarr
      })
    });

    // 加载筛选分类
    app.http('api/category', {}, "GET")
      .then(res => {
        var sd = {
          id: '',
          name: '全部'
        }
        res.data.unshift(sd)
        that.setData({
          iconList: res.data
        })
      })

    that.loadCoupon()
    that.loadImg()
  },
  loadImg: function () {
    var that = this
    app.http('api/discount/banner', {}, "GET")
      .then(res => {
        that.setData({
          bannerImg: app.globalData.ipUrl + res.data.image
        })
      })
  },
  bindPickerChange: function (e) {
    let index = e.detail.value
    let array = this.data.array
    this.setData({
      index,
      defalu: array[index].name,
      city_id: array[index].code
    })
    this.loadCoupon()
  },
  bindPickerChange2: function (e) {
    let index = e.detail.value
    let array = this.data.iconList
    this.setData({
      index,
      hangye: array[index].name,
      category_id: array[index].id
    })
    this.loadCoupon()
  },

  // 加载优惠券
  loadCoupon: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })

    app.http('api/discount', {
        type: 2,
        city_id: that.data.city_id,
        category_id: that.data.category_id,
        token: wx.getStorageSync('openid')
      }, "GET")
      .then(res => {

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
          couponList: res.data
        })
        wx.hideLoading()
      })
  },
  powerDrawer: function (e) {
    var that = this
    var currentStatu = e.currentTarget.dataset.statu;
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    if (status == 0) {
      wx.showLoading({ //显示 loading 提示框
        title: "加载中..."
      })
      app.http('api/discount/draw', {
          type: 2,
          discount_id: id,
          token: wx.getStorageSync('openid')
        }, "POST")
        .then(res => {


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



          if (res.status_code == 200) {
            that.util(currentStatu)
          }
          wx.hideLoading()
        })
    } else {
      return
    }

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
          showModalStatus: false
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
  select: function () {
    this.setData({
      showModalStatus: false
    });
    this.loadCoupon()
  },
  goCash: function () {
    wx.navigateTo({
      url: '../coupon/coupon?adcode='+this.data.adcode
    })
  },
  goDetail:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../cashDetail/cashDetail?id='+id
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

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
  that.setData({
    province: "北京市",
    city: "市辖区",
    county: "东城区",
  })

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = {
      name: ''
    };
  }

  that.setData({
    city: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = {
      name: ''
    };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}