// pages/store/store.js

Page({

  /**
   * 页面的初始数据
   */
  click:function(){
    wx:wx.navigateTo({
      url: '../storeindex/storeindex',

    })

  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {

    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  data: {
       name:"朱红可",
       numperson:"2",
       numding:"10",
       numjian:"100",
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['1', '2', '3', '4', '5', '6', '5', '6'],//下拉列表的数据
    index: 0,//选择的下拉列表下标,
    array: [{
      src:"../../images/guanli.png",
      message: '店铺管理'
    }, {
        src: "../../images/guanli1.png",
      message: '商品管理'
      }, {
        src: "../../images/guanli2.png",
        message: '订单管理'
      }, {
        src: "../../images/guanli3.png",
        message: '数据统计'
      }, {
        src: "../../images/guanli4.png",
        message: '资产'
      }, {
        src: "../../images/guanli5.png",
        message: '店铺二维码'
      }],
    
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
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