// pages/index/moreLearn/moreLearn.js
const app = getApp()
var area = require('../../../utils/area.js')

var areaInfo = []; //所有省市区县数据

var provinces = []; //省

var provinces1 = []; //城市

var provinces2 = []; //区县
var provincea = []
var index = [0, 0, 0];
var index2=0
var cellId;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputStyle: 'display:none',
    searchValue: '',
    content: [],
    px: ['全部', '早教', '感统训练', '全脑/潜能', '美术/书法', '托班', '少儿英语', '兴趣/运动', "课程辅导", '音乐/乐器'], //排序列表内容
    qyopen: false, //点击地铁区域筛选滑动弹窗显示效果，默认不显示
    qyshow: true, //用户点击闭关区域的弹窗设置，默认不显示
    nzopen: false, //价格筛选弹窗
    pxopen: false, //排序筛选弹窗
    nzshow: true,
    pxshow: true,
    isfull: false,
    select1: '地铁', //地铁区域选中后的第二个子菜单，默认显示地铁下的子菜单
    select2: '', //地铁区域选择部分的中间
    select3: '', //地铁区域选择部分的右边
    shownavindex: '',
    // 价格筛选框设置
    leftMin: 0,
    leftMax: 10000, //左边滑块最大值
    rightMin: 0, //右边滑块的最小值
    rightMax: 10000, //右边滑块最大值
    leftValue: 1000, //左边滑块默认值
    rightValue: 6000, //右边滑块默认值
    leftPer: '50', //左边滑块可滑动长度：百分比
    rightPer: '50', //右边滑块可滑动长度

    pxIndex: 0, //排序内容下拉框，默认第一个
    selected: 0,
    selectedquyu: 0,
    selectedquyu2:0,
    list: ['机构', '课程'],
    qiyulist: ['全部', '天桥区', '槐荫区', '历下区', '天桥区', '槐荫区', '历下区'],
    pageHeight: '',
    category_id: null,
    page: 1,
    size: 8,
    learnList: null,
    adcode: null,
    quList:null,
    province_id:'',
    city_id:"",
    district_id:'',
    institutionList:null,
    is_last:1,
    bottomStyle: "display:none",
    order:'id',
    keywords:'',
    iconList:[],
    ipUrl:null,
    inputShowed:false,
    count:null,
    pllist:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      category_id: options.id,
      adcode: options.adcode,
      province_id:options.adcode.substring(0, 3)+'000',
      ipUrl:app.globalData.ipUrl
    })
    var page = that.data.page
  
    var date = new Date()
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
      var arr = []
      provinces.map(function (x) {
        arr.push(x.sheng)
      })
      arr.map(function (z) {
        var zx = []
        provinces1.map(function (x) {
          if (z == x.sheng) {
            zx.push(x)
          }
        })
        provincea.push(zx)
      })
   
      // 加载筛选分类

      app.http('api/category', {
      }, "GET")
      .then(res => {
        var sd = {
          id:'',
          name:'全部'
        }
        res.data.unshift(sd)
        that.setData({
          iconList:res.data
        })
      })
    }
    );
    that.loadPinglun()
  },
  loadPinglun:function(){
    var that = this
    wx.showLoading({ //显示 loading 提示框
      title: "加载中..."
    })
    var page = that.data.page
    app.http('api/store/appraise', {
      type: 1,
      index: 0,
      size: page * that.data.size,
      province_id:that.data.province_id,
      city_id:that.data.city_id,
      district_id:that.data.district_id,
      order:that.data.order
    }, "GET")
    .then(res => {
      console.log(res,'pinglun')

      var data = res.data.count
      var xiaoshu = data.count + ''
      var listdata = res.data.list
      if(xiaoshu.split('.')[1]){
        data.xiaoshu = true
        data.xiaoshuz = xiaoshu.split('.')[0]
      }else{
        data.xiaoshu = false
      }


      if(listdata.length>0){
        listdata.map(function(zz){
          var xiaoshu = zz.grade+''
          zz.grade =+zz.grade
          if(xiaoshu.split('.')[1]>0){
            zz.xiaoshu = true
            zz.xiaozhuz = xiaoshu.split('.')[0]
          }else{
            zz.xiaoshu = false
          }
        })
      }

      that.setData({
        pllist:listdata,
        count:data
      })
      wx.hideLoading()
    })
  },




  // 查询框内容
  bindKeyInput: function (e) {
    var that = this
    var value = e.detail.value
    if (value != '' || value != null || value != "") {
      that.setData({
        inputStyle: 'display:block',
        searchValue: value
      })
    }
    if (value == "") {
      that.setData({
        inputStyle: 'display:none',
        searchValue: value
      })
    }
    that.setData({
      keywords:e.detail.value
    })
  },
  bindconfirm:function(){
    var that = this
    var page = that.data.page
    that.loadPinglun()
  },
  searchClose: function () {
    var that = this
    that.setData({
      searchValue: '',
      inputStyle: 'display:none'
    })
  },
  // 地铁区域列表下拉框是否隐藏
  listqy: function (e) {
    var all={
      code:'',
      name:"全部"
    }
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        nzopen: false,
        pxopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: false,
        shownavindex: 0,
      })
    } else {
      var adcode = this.data.adcode.substring(0, 2)+'0000'
      provinces.map(function (z,index) {
        if (z.code == adcode) {
          index2=index
        }
      })
      
      if(provincea[index2][0].name=="全部"){

      }else{
        provincea[index2].unshift(all)
      }
      this.setData({
        qyopen: true,
        pxopen: false,
        nzopen: false,
        nzshow: true,
        pxshow: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        qiyulist:provincea[index2]
      })
    }
  },
  // 排序下拉框是否隐藏
  listpx: function (e) {
    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        content: this.data.px,
        nzopen: false,
        pxopen: true,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: true,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },

  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: true,
      pxshow: true,
      qyshow: true,
      isfull: false
    })
  },
  // 左边滑块滑动的值
  leftSchange: function (e) {
    let currentValue = parseInt(e.detail.value);
    let currentPer = parseInt(currentValue)
    var that = this;
    that.setData({
      leftValue: e.detail.value //设置左边当前值
    })
  },
  // 右边滑块滑动的值
  rightSchange: function (e) {
    let currentValue = parseInt(e.detail.value);
    var that = this;
    that.setData({
      rightValue: e.detail.value,
    })
  },
  // 价格筛选框重置内容
  PriceEmpty: function () {
    this.setData({
      leftValue: 1000, //左边滑块默认值
      rightValue: 6000, //右边滑块默认值
    })
  },
  // 价格筛选框提交内容
  submitPrice: function () {
    // 隐藏价格下拉框选项
    this.setData({
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: false,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 0
    })
  },
  // 排序内容下拉框筛选
  selectPX: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    this.setData({
      pxIndex: e.currentTarget.dataset.index,
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: true,
      pxshow: false,
      qyshow: true,
      isfull: false,
      shownavindex: 3,
      category_id:id
    });
    var page = that.data.page
    that.loadPinglun()
  },


  selected: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    if (index == 0) {
      that.setData({
        selected: 0
      })
    } else if (index == 1) {
      that.setData({
        selected: 1
      })
    } else if (index == 2) {
      that.setData({
        selected: 2
      })
    } else {
      that.setData({
        selected: 3
      })
    }
  },

  selectedquyu: function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let city_id = e.currentTarget.dataset.code
    var code=provincea[index2][index].code
    var provincarr=[]
    provinces2.map(function(rz){
      if(rz.code.substring(0,4)+'00'==code){
        provincarr.push(rz)
      }
    })
    provincarr.splice(0,1)
    that.setData({
      selectedquyu: index,
      quList:provincarr,
      city_id:city_id
    })

  },
  selectSearch:function(e){
    var that = this
    var district_id = e.currentTarget.dataset.code
    that.setData({
      district_id:district_id,
      page:1,
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: false,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: 1
    })
    var page = that.data.page
    that.loadPinglun()
  },
  // 综合排序
  searchAll:function(e){
    var that = this
    var index = e.currentTarget.dataset.nav

    that.setData({
      order:'id',
      page:1,
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: false,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: index
    })
    var page = that.data.page
    that.loadPinglun()
  },
  // 距离排序
  searchDistance:function(e){
    var that = this
    var index = e.currentTarget.dataset.nav
    that.setData({
      order:'location',
      page:1,
      nzopen: false,
      pxopen: false,
      qyopen: false,
      nzshow: false,
      pxshow: true,
      qyshow: true,
      isfull: false,
      shownavindex: index
    })
    var page = that.data.page
    that.loadPinglun()
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
          .then(res => {
            
          })
      },
    })
  },
  searchqyAll:function(){
    var that = this
    that.setData({
      district_id:''
    })
    var page = that.data.page
    that.loadPinglun()
  },
  goInstitutionDetail:function(e){
    var that =this
    var id = e.currentTarget.dataset.id
    if (wx.getStorageSync('openid') == null || wx.getStorageSync('openid') == '' || wx.getStorageSync('openid') == undefined) {
      wx.navigateTo({
        url: '../../login/index'
      })
    } else {
      wx.navigateTo({
        url: '../../org/org?id='+id
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
      that.loadLearn(page)
    }
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