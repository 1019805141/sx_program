//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var area = require('../../utils/area.js')
var areaInfo = []; //所有省市区县数据

var provinces = []; //省

var citys = []; //城市

var countys = []; //区县

var index = [0, 0, 0];

var t = 0;
var show = false;
var moveY = 200;

var qqmapsdk;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    defult: '槐荫区',
    currentIndexs: 0,
    leixingList: [{
      label: '全部'
    }, {
      label: '0-3岁'
    }, {
      label: '3-6岁'
    }, {
      label: '6-9岁'
    }, {
      label: '9-12岁'
    }, {
      label: '其他'
    }, ],
    noticeList: [],
    chat: null,
    pingjia: null,
    weizhi: '获取位置',
    openid: null,
    latitude: '',
    longitude: '',
    orgList: [],
    ipUrl: null,
    iList: [],
    eList: [],
    iconList: [],
    adcode: null,
    show: show,
    provinces: provinces,
    citys: citys,
    countys: countys,
    value: [0, 0, 0],
    toptype: 1,
    district_id: null,
    district_name: '',
    suit: '',
    keywords: '',
    category_id: '',
    inputShowed: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    that.setData({
      ipUrl: app.globalData.ipUrl,
      toptype: 1
    })
    var date = new Date()

    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });

    // 定位
    wx.getLocation({
      type: 'wsg84',
      success: res => {
        console.log(res, '获取定位')
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.getLocal(latitude, longitude)
        wx.setStorageSync('latitude', latitude)
        wx.setStorageSync('longitude', longitude)
        console.log(that.data.latitude, that.data.longitude)
        that.loadNearg()
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res, ';ddddddd')
            let province = res.result.ad_info.province
            let city = res.result.ad_info.city
            let district = res.result.ad_info.district
            let adcode = res.result.ad_info.adcode
            that.setData({
              province: province,
              city: city,
              latitude: latitude,
              longitude: longitude,
              weizhi: district,
              adcode: adcode,
              district_name: district,
              dingwei: res.result.address_reference.landmark_l2.title
            })
            console.log(that.data.district_name)
            that.loadRobbing()
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        });




      },
      fail: function (res) {
        that.loadCoordinate()
      }
    })







    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.loadIcon()
    qqmapsdk = new QQMapWX({
      key: 'S3CBZ-4FQKP-PTXDJ-VXDYM-LFA7Z-WHBGA'
    });
    that.loadClass()
    // 加载附近机构
    wx.hideLoading()


    var that = this
    that.setData({
      openid: wx.getStorageSync('openid'),
      searchValue: ''
    })
    // 默认为空 走一遍接口定位
    // if (wx.getStorageSync('openid')) {
    //   that.onloadPosition()
    //   that.setData({
    //     toptype: 2
    //   })
    // } else {

    //   // 用户已登录获取定位
    //   that.loadCoordinate()
    // }
    // 通知公告
    app.http('api/notice', {}, "GET")
      .then(res => {
        that.setData({
          noticeList: res.data
        })
      })
    //  最新统计
    app.http('api/statistics', {}, "GET")
      .then(res => {
        that.setData({
          chat: res.data[0]
        })
      })
    // 加载年龄
    app.http('api/age', {}, "GET")
      .then(res => {
        console.log(res, 'age')

        var data = res.data

        var quanbu = {
          id: '',
          name: '全部'
        }
        data.unshift(quanbu)

        that.setData({
          leixingList: data
        })
      })


  },

  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this); //获取地级市数据
      getCountyInfo(val[0], val[1], this); //获取区县数据
    } else { //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this); //获取区县数据
      }
    }
    index = val;

    console.log(index + " => " + val);

    //更新数据
    this.setData({
      value: [val[0], val[1], val[2]],
      province: provinces[val[0]].name,
      city: citys[val[1]].name,
      county: countys[val[2]].name,
      weizhi: countys[val[2]].name,
      district_id: countys[val[2]].code,
      adcode: countys[val[2]].code
    })
    console.log(this.data.adcode)
  },
  //移动按钮点击事件
  translate: function (e) {
    console.log(t)
    if (t == 0) {
      moveY = 0;
      show = true;
      t = 1;
    } else {
      moveY = 200;
      show = false;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);
  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    console.log(e);
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
    this.loadRobbing()
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow: function () {


  },

  // 切换地图
  goMap: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res, 'dingwei')
        that.setData({
          dingwei: res.name
        })
        // thi.xuanze = res.address
        // thi.longitude = res.longitude
        // thi.latitude = res.latitude
        var latitude = res.latitude
        var longitude = res.longitude
        that.getLocal(latitude, longitude)
      }
    });
  },
  dianjis: function (e) {
    console.log(e)
    var that = this
    let query = e.currentTarget.dataset['index']
    var label = e.currentTarget.dataset.label
    if (label == '全部') {
      that.setData({
        suit: '',
        currentIndexs: query
      })
    } else {
      that.setData({
        currentIndexs: query,
        suit: label,
      })
    }
    // if (tabIndex == 0) {
    //   console.log(111)
    //   that.onLoadGY(typeOne)
    // } else if (tabIndex == 1) {
    //   // that.setData({
    //   //   currentIndex: e.currentTarget.dataset[0],
    //   // })
    //   console.log(222)
    that.loadNearg()

  },
  // 真实评价
  loadClass: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/appraise', {}, "GET")
      .then(res => {
        console.log(res, '真实评价')
        // app.globalData.gongyongfun(n,this.onloadPosition)
        that.setData({
          pingjia: res.data
        })
        wx.hideLoading()
      })
  },

  position: function () {
    var that = this
    console.log(that.data.toptype)


    if (t == 0) {
      moveY = 0;
      show = true;
      t = 1;
    } else {
      moveY = 200;
      show = false;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);


    // if (that.data.toptype == 1) {
    //   that.onloadPosition()
    //   that.setData({
    //     toptype: 2
    //   })
    // } else {
    //   console.log(t)
    //   if (t == 0) {
    //     moveY = 0;
    //     show = true;
    //     t = 1;
    //   } else {
    //     moveY = 200;
    //     show = false;
    //     t = 0;
    //   }
    //   // this.animation.translate(arr[0], arr[1]).step();
    //   animationEvents(this, moveY, show);
    // }

  },
  // 获取位置
  onloadPosition: function () {
    var that = this
    wx.getLocation({
      type: 'wsg84',
      success: res => {
        console.log(res, '获取定位')
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.getLocal(latitude, longitude)

        that.setData({
          latitude: latitude,
          longitude: longitude
        })

        wx.setStorageSync('latitude', latitude)
        wx.setStorageSync('longitude', longitude)
        console.log(that.data.latitude, that.data.longitude)
        that.loadNearg()

      },
      fail: function (res) {
        that.loadCoordinate()
      }
    })
  },
  // 刷新token
  loadToken: function () {
    var that = this
    app.http('api/refresh', {
        token: wx.getStorageSync('openid')
      }, "POST")
      .then(res => {
        wx.setStorageSync('openid', res.data.token)
        that.onloadPosition()
      })
  },
  // 未登录时默认获取经纬度
  loadCoordinate: function () {
    var that = this
    app.http('api/location', {}, "GET")
      .then(res => {
        wx.showToast({
          title: '已为您选择默认地址',
          duration: 2000,
          icon: 'none',
          success(data) {
            setTimeout(function () {
              console.log(res, '未登录获取经纬度')
              var latitude = res.data.latitude
              var longitude = res.data.longitude
              wx.setStorageSync('latitude', latitude)
              wx.setStorageSync('longitude', longitude)
              that.getLocal(latitude, longitude)
            }, 1000) //延迟时间
          }
        })

      })
  },
  // 经纬度转化名称
  getLocal: function (latitude, longitude) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res, ';ddddddd')
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        let district = res.result.ad_info.district
        let adcode = res.result.ad_info.adcode
        that.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude,
          weizhi: district,
          adcode: adcode,
          district_name: district,
          dingwei: res.result.address_reference.landmark_l2.title
        })
        console.log(that.data.district_name)
        that.loadNearg()
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  // 附近机构
  loadNearg: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/institution/nearby', {
        index: 1,
        size: 10,
        district_name: that.data.district_name,
        suit: that.data.suit,
        longitude: that.data.longitude,
        latitude: that.data.latitude
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
          orgList: res.data.list
        })
        wx.hideLoading()
      })
  },
  // 限时抢课
  loadRobbing: function () {
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    app.http('api/activity', {
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        district_id: that.data.adcode
      }, "GET")
      .then(res => {
        console.log(res, '限时')
        that.setData({
          iList: res.data.institutionList.list,
          eList: res.data.eduList.list
        })
        wx.hideLoading()
      })
  },
  // 加载课程分类
  loadIcon: function () {
    var that = this
    app.http('api/category', {
        index: 1,
        size: 3
      }, "GET")
      .then(res => {
        that.setData({
          iconList: res.data
        })
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
  goFujin: function () {
    wx.navigateTo({
      url: 'institutions/institutions'
    })
  },
  goInstitutionDetail: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: '../org/org?id=' + id
      })
    }
  },
  // 分类跳转
  goIcon: function (e) {
    var id = e.currentTarget.dataset.id
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'moreLearn/moreLearn?id=' + id + '&adcode=' + this.data.adcode,
      })
    }
  },
  goPingjia: function () {
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'evaluate/evaluate?adcode=' + this.data.adcode
      })
    }
  },
  // 跳转优惠券
  goCoupon: function () {
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'coupon/coupon?adcode=' + this.data.adcode,
      })
    }
  },
  // 跳转限时抢课
  goRobbing: function () {
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'robbing/robbing?adcode='+this.data.adcode
      })
    }
  },
  goIdetail: function (e) {
    var id = e.currentTarget.dataset.id
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'robbing/Detail98/Detail98?id=' + id
      })
    }
  },
  goEdetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(wx.getStorageSync('openid'), 'dsadasda')
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      wx.navigateTo({
        url: 'robbing/meal398/meal398?id=' + id + '&adcode=' + this.data.adcode
      })
    }
  },
  onReady: function () {
    
  },
  // 查询框内容
  bindKeyInput: function (e) {
    var that = this
    var value = e.detail.value
    that.setData({
      keywords: e.detail.value
    })
  },
  bindconfirm: function () {
    var that = this
    console.log(that.data.keywords)
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      if (that.data.keywords == "" || that.data.keywords == null) {

      } else {
        wx.navigateTo({
          url: 'search/search?keywords=' + that.data.keywords + '&adcode=' + this.data.adcode + '&id=' + this.data.category_id
        })
      }
    }
  },
  goSearch: function () {
    var that = this
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../login/index'
      })
    } else {
      if (that.data.keywords == "" || that.data.keywords == null) {

      } else {
        wx.navigateTo({
          url: 'search/search?keywords=' + that.data.keywords + '&adcode=' + this.data.adcode + '&id=' + this.data.category_id
        })
      }
    }
  }
})


//动画事件
function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

// ---------------- 分割线 ---------------- 

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
    province: "山东省",
    city: "济南市",
    county: "市中区",
  })

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
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