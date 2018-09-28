
function t(t) {
  if (t < 60) return "00:00:" + ((e = t) < 10 ? "0" + e : e);
  if (t < 3600) {
    e = t % 60;
    return "00:" + ((i = parseInt(t / 60)) < 10 ? "0" + i : i) + ":" + (e < 10 ? "0" + e : e);
  }
  if (t >= 3600) {
    var a = parseInt(t / 3600), i = parseInt(t % 3600 / 60), e = t % 60;
    return (a < 10 ? "0" + a : a) + ":" + (i < 10 ? "0" + i : i) + ":" + (e < 10 ? "0" + e : e);
  }
}



var t = require("../../../api.js"), a = getApp();

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0,
        pt_url: !1,
        page: 1,
        is_show: 0,
        quick_icon: !0,
      time_list: null,
      goods_list: null,
      page: 1,
      loading_more: !1,
      status: !0

        
    },
    onLoad: function(o) {
      a.pageOnLoad(this), this.loadData(o);
      var i = this, r = wx.getStorageSync("pages_index_index");
      r && (r.act_modal_list = [], i.setData(r)), a.request({
        url: t.default.index,
        success: function (t) {
          var yang = t.data.nav_icon_list
          i.setData({ yang: yang })
    
        },
        complete: function () {
          wx.stopPullDownRefresh();
        }
      });
        this.systemInfo = wx.getSystemInfoSync(), a.pageOnLoad(this);
        var e = wx.getStorageSync("store");
        this.setData({
            store: e
        });
        var n = this;
        if (o.cid) {
            var i = o.cid;
          return console.log("cid=>" + i), this.setData({
                pt_url: !1
            }), wx.showLoading({
                title: "正在加载",
                mask: !0
            }), void a.request({
                url: t.group.index,
            
                method: "get",
                success: function(t) {
                console.log(t)
                    n.switchNav({
                        currentTarget: {
                            dataset: {
                                id: o.cid
                            }
                        }
                    }), 0 == t.code && n.setData({
                        banner: t.data.banner,
                        ad: t.data.ad,
                        page: t.data.goods.page,
                        page_count: t.data.goods.page_count
                    });
                }
            });
          
        }
        this.setData({
            pt_url: !0
        }), this.loadIndexInfo(this);


        
    },
  quickNavigation: function () {
    this.setData({
      quick_icon: !this.data.quick_icon
    });
    this.data.store;
    var t = wx.createAnimation({
      duration: 300,
      timingFunction: "ease-out"
    });
    this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(),
      this.setData({
        animationPlus: t.export()
      });
  },
  loadData: function (t) {
    console.log(a)
    var e = this;
    a.request({
      url: a.api.miaosha.list,
      success: function (t) {
        if (0 == t.code) if (0 == t.data.list.length) {
          if (0 == t.data.next_list.length) return void wx.showModal({
            content: "暂无秒杀活动",
            showCancel: !1,
            confirmText: "返回首页",
            success: function (t) {
              t.confirm && wx.navigateBack({
                url: "/pages/index/index"
              });
            }
          });
          e.setData({
            goods_list: t.data.next_list.list,
            ms_active: !0,
            time_list: t.data.list,
            next_list: t.data.next_list.list,
            next_time: t.data.next_list.time
          });
        } else e.setData({
          time_list: t.data.list,
          next_list: "" == t.data.next_list ? [] : t.data.next_list.list,
          next_time: "" == t.data.next_list ? [] : t.data.next_list.time,
          ms_active: !1
        }), e.topBarScrollCenter(), e.setTimeOver(), e.loadGoodsList(!1);
        1 == t.code && wx.showModal({
          title: "提示",
          content: t.msg,
          success: function () {
            wx.navigateBack({
              url: "/pages/index/index"
            });
          },
          showCancel: !1
        });
      }
    });
  },
  setTimeOver: function () {
    function a() {
      for (var a in a.data.time_list) {
        var e = a.data.time_list[a].begin_time - a.data.time_list[a].now_time, s = a.data.time_list[a].end_time - a.data.time_list[a].now_time;
        e = e > 0 ? e : 0, s = s > 0 ? s : 0, a.data.time_list[a].begin_time_over = t(e),
          a.data.time_list[a].end_time_over = t(s), a.data.time_list[a].now_time = a.data.time_list[a].now_time + 1;
      }
      a.setData({
        time_list: a.data.time_list
      });
    }
    var i = this;
    a(), setInterval(function () {
      a();
    }, 1e3);
  },
  miaosha_next: function () {
    var t = this, a = t.data.time_list;
    t.forEach(function (t, i, e) {
      a[i].active = !1;
    }), t.setData({
      goods_list: null,
      ms_active: !0,
      time_list: a
    }), setTimeout(function () {
      t.setData({
        goods_list: t.data.next_list
      });
    }, 500);
  },
  topBarScrollCenter: function () {
    var t = this, a = 0;
    for (var i in t.data.time_list) if (t.data.time_list[i].active) {
      a = i;
      break;
    }
    t.setData({
      top_bar_scroll: 64 * (a - 2)
    });
  },
  topBarItemClick: function (t) {
    var a = this, i = t.currentTarget.dataset.index;
    for (var e in t.datt.time_list) t.datt.time_list[e].active = i == e;
    t.setData({
      time_list: t.data.time_list,
      loading_more: !1,
      page: 1,
      ms_active: !1
    }), t.topBarScrollCenter(), t.loadGoodsList(!1);
  },
loadGoodsList: function (t) {

    var e = this, s = !1;
    for (var n in e.data.time_list) {
      if (e.data.time_list[n].active) {
        s = e.data.time_list[n].start_time;
        break;
      }
      e.data.time_list.length == parseInt(n) + 1 && 0 == s && (s = e.data.time_list[0].start_time,
        e.data.time_list[0].active = !0);
    }
    t ? e.setData({
      loading_more: !0
    }) : e.setData({
      goods_list: null
    }), a.request({
      url: t.miaosha.goods_list,
      data: {
        time: s,
        page: e.data.page
      },
      success: function (a) {
        0 == t.code && (e.data.goods_list = t ? e.data.goods_list.concat(t.data.list) : t.data.list,
          e.setData({
            loading_more: !1,
            goods_list: e.data.goods_list,
            page: t.data.list && 0 != t.data.list.length ? e.data.page + 1 : -1
          }));
      }
    });
  },
  receive: function (e) {
    var i = this, o = e.currentTarget.dataset.index;
    wx.showLoading({
      title: "领取中",
      mask: !0
    }), i.hideGetCoupon || (i.hideGetCoupon = function (t) {
      var a = t.currentTarget.dataset.url || !1;
      i.setData({
        get_coupon_list: null
      }), a && wx.navigateTo({
        url: a
      });
    }), a.request({
      url: t.coupon.receive,
      data: {
        id: o
      },
      success: function (t) {
        wx.hideLoading(), 0 == t.code ? i.setData({
          get_coupon_list: t.data.list,
          coupon_list: t.data.coupon_list
        }) : (wx.showToast({
          title: t.msg,
          duration: 2e3
        }), i.setData({
          coupon_list: t.data.coupon_list
        }));
      }
    });
  },  

    onReady: function() {},
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        var t = this.data.store, a = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), o = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), e = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), n = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), i = wx.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), s = -55;
        this.data.quick_icon ? (a.opacity(0).step(), e.opacity(0).step(), o.opacity(0).step(), 
        n.opacity(0).step(), i.opacity(0).step()) : (t.option && t.option.wxapp && t.option.wxapp.pic_url && (i.translateY(s).opacity(1).step(), 
        s -= 55), t.show_customer_service && 1 == t.show_customer_service && t.service && (n.translateY(s).opacity(1).step(), 
        s -= 55), t.option && t.option.web_service && (e.translateY(s).opacity(1).step(), 
        s -= 55), 1 == t.dial && t.dial_pic && (o.translateY(s).opacity(1).step(), s -= 55), 
        a.translateY(s).opacity(1).step()), this.setData({
            animationPlus: a.export(),
            animationPic: o.export(),
            animationcollect: e.export(),
            animationTranspond: n.export(),
            animationInput: i.export()
        });
    },
    onShow: function() {
        a.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
      // -1 != t.data.page && t.loadGoodsList(!0);
        t.data.page < t.data.page_count ? (t.setData({
            page: t.data.page + 1
        }), t.getGoods(t)) : t.setData({
            is_show: 1
        });
    },
    onShareAppMessage: function() {},
    loadIndexInfo: function(o) {
        var e = o;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.group.index,
            method: "get",
            data: {
                page: e.data.page
            },
            success: function(t) {
           
                0 == t.code && (wx.hideLoading(), e.setData({
                    cat: t.data.cat,
                    banner: t.data.banner,
                    ad: t.data.ad,
                    goods: t.data.goods.list,
                    page: t.data.goods.page,
                    page_count: t.data.goods.page_count
                }), t.data.goods.row_count <= 0 && e.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    getGoods: function(o) {
        var e = o;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.group.list,
            method: "get",
            data: {
                page: e.data.page
            },
            success: function(t) {
                0 == t.code && (wx.hideLoading(), e.data.goods = e.data.goods.concat(t.data.list), 
                e.setData({
                    goods: e.data.goods,
                    page: t.data.page,
                    page_count: t.data.page_count
                }));
            }
        });
    },
    switchNav: function(o) {
        var e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var n = 0;
        if (n != o.currentTarget.dataset.id || 0 == o.currentTarget.dataset.id) {
            n = o.currentTarget.dataset.id;
            var i = this.systemInfo.windowWidth, s = o.currentTarget.offsetLeft, d = this.data.scrollLeft;
            d = s > i / 2 ? s : 0, e.setData({
                cid: n,
                page: 1,
                scrollLeft: d,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1,
                is_show: 0
            }), a.request({
                url: t.group.list,
                method: "get",
                data: {
                    cid: n
                },
                success: function(t) {
                    if (0 == t.code) {
                        setTimeout(function() {
                            wx.hideLoading();
                        }, 1e3);
                        var a = t.data.list;
                        t.data.page_count >= t.data.page ? e.setData({
                            goods: a,
                            page: t.data.page,
                            page_count: t.data.page_count,
                            row_count: t.data.row_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    pullDownLoading: function(o) {
        var e = this;
        if (1 != e.data.emptyGoods && 1 != e.data.show_loading_bar) {
            e.setData({
                show_loading_bar: 1
            });
            var n = parseInt(e.data.page + 1), i = e.data.cid;
            a.request({
                url: t.group.list,
                method: "get",
                data: {
                    page: n,
                    cid: i
                },
                success: function(t) {
                    if (0 == t.code) {
                        var a = e.data.goods;
                        t.data.page > e.data.page && Array.prototype.push.apply(a, t.data.list), t.data.page_count >= t.data.page ? e.setData({
                            goods: a,
                            page: t.data.page,
                            page_count: t.data.page_count,
                            row_count: t.data.row_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    navigatorClick: function(t) {
        var a = t.currentTarget.dataset.open_type, o = t.currentTarget.dataset.url;
        return "wxapp" != a || (o = function(t) {
            var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g, o = /^[^\?]+\?([\w\W]+)$/.exec(t), e = {};
            if (o && o[1]) for (var n, i = o[1]; null != (n = a.exec(i)); ) e[n[1]] = n[2];
            return e;
        }(o), o.path = o.path ? decodeURIComponent(o.path) : "", wx.navigateToMiniProgram({
            appId: o.appId,
            path: o.path,
            complete: function(t) {}
        }), !1);
    },
    to_dial: function() {
        var t = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    }
});
