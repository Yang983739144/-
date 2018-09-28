// pages/storeindex/storeindex.js
var app = getApp();
var mtabW;
var a = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  click: function () {
    wx: wx.navigateTo({
      url: '../store/store',

    })
  },
  data: {
    wHeight:'500px',
    // tab 切换
     username:null,
     currentActive:0,
    name:"朱红可",
    kucun:"1000",
    yishou:"500",
    tabs: ['所有商品', '奶瓶', '奶粉专场', '买赠衣柜', '婴儿洗浴', '婴儿服装', '五折产品',],//tob标题
    // tabs: ['a', 'b', 'c', 'd', 'e', 'f', 'g',],//tob标题
    // tabs:[{
    //   name:"所有商品",
    //   name1:"a"
    // }, {
    //     name: "奶瓶",
    //     name1: "b"
    //   }, {
    //     name: "奶粉",
    //     name1: "c"
    //   }, {
    //     name: "所有商品",
    //     name1: "d"
    //   },
    // ],
    pageData: [
      [{
        price: "40.0",
        xiaoliang: "200",
        src: "../../images/tu3.png",
        message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
      }, {
        price: "50.0",
        xiaoliang: "300",
        src: "../../images/guanli1.png",
        message: '母亲儿童润肤霜120g宝宝草莓味'
      }, {
        price: "60.0",
        xiaoliang: "400",
        src: "../../images/guanli2.png",
        message: '啦啦啦啦啦啦啦啦啦'
      }, {
        price: "70.0",
        xiaoliang: "500",
        src: "../../images/guanli3.png",
        message: '啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊'
      },
      ],


      [{
        price: "40.0",
        xiaoliang: "200",
        src: "../../images/tu3.png",
        message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
      }, {
        price: "50.0",
        xiaoliang: "300",
        src: "../../images/guanli1.png",
        message: '母亲儿童润肤霜120g宝宝草莓味'
      }, {
        price: "60.0",
        xiaoliang: "400",
        src: "../../images/guanli2.png",
        message: '啦啦啦啦啦啦啦啦啦'
      },
      ],



      [{
        price: "40.0",
        xiaoliang: "200",
        src: "../../images/tu3.png",
        message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
      }, {
        price: "50.0",
        xiaoliang: "300",
        src: "../../images/guanli1.png",
        message: '母亲儿童润肤霜120g宝宝草莓味'
      },
      ],
      [{
        price: "40.0",
        xiaoliang: "200",
        src: "../../images/tu3.png",
        message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
      }, {
          price: "50.0",
          xiaoliang: "300",
          src: "../../images/guanli1.png",
          message: '母亲儿童润肤霜120g宝宝草莓味'
        },
      ],
      [{
        price: "40.0",
        xiaoliang: "200",
        src: "../../images/tu3.png",
        message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
      }, {
          price: "50.0",
          xiaoliang: "300",
          src: "../../images/guanli1.png",
          message: '母亲儿童润肤霜120g宝宝草莓味'
        },
      ],
      [{
        price: "40.0",
        xiaoliang: "200",
        src: "../../images/tu3.png",
        message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
      }, {
          price: "50.0",
          xiaoliang: "300",
          src: "../../images/guanli1.png",
          message: '母亲儿童润肤霜120g宝宝草莓味'
        },
      ],
      [
        {
          price: "40.0",
          xiaoliang: "200",
          src: "../../images/tu3.png",
          message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
        },
      ], [
        {
          price: "40.0",
          xiaoliang: "200",
          src: "../../images/tu3.png",
          message: '爱护宝宝抑菌洗手液250mle儿童婴儿专用s杀菌泡沫洗手液啦啦啦啦'
        },
      ],
    ],//page数据
    activeIndex: 0,
    slideOffset: 0,
    tabW: 0,
    index: 0,
    topView: 'A',
  
  
},

  tabClick: function (e) {

    var that = this;
    var index = 0;
    for (var i = 0; i < this.data.tabs.length; i++) {
      if (this.data.tabs[i] === e.currentTarget.dataset.item) {
        index = i
        break
      }
    }
    var offsetW = e.currentTarget.offsetLeft;
    this.setData({
      activeIndex: index,
      slideOffset: offsetW
    });

  },
  bindChange: function (e) {
    
    var current = e.detail.current;
    var offsetW = current * mtabW;

    this.setData({
      activeIndex: current,
      index: current,
      slideOffset: offsetW,
      topView: this.data.tabs[current]
    });
 
    // console.log(this.data.topView + ' ' + offsetW)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        mtabW = res.windowWidth / 3;
        let x = res.windowHeight -180;
        that.setData({
          tabW: mtabW,
          wHeight:x+'px'
        })
      }
    });
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