module.exports = {
    currentPage: null,
    onLoad: function(e) {
        this.currentPage = e;
        i = this;
        if (e.options) {
            var t = 0;
            if (e.options.user_id) t = e.options.user_id; else if (e.options.scene) if (isNaN(e.options.scene)) {
                var a = decodeURIComponent(e.options.scene);
                a && (a = getApp().utils.scene_decode(a)) && a.uid && (t = a.uid);
            } else t = e.options.scene;
            t && wx.setStorageSync("parent_id", t);
        }
        if (void 0 === e.openWxapp && (e.openWxapp = getApp().openWxapp), void 0 === e.showToast && (e.showToast = function(e) {
            i.showToast(e);
        }), void 0 === e._formIdFormSubmit) {
            var i = this;
            e._formIdFormSubmit = function(e) {
                i.formIdFormSubmit(e);
            };
        }
        getApp().setNavigationBarColor(), this.setPageNavbar(e), e.naveClick = function(t) {
            getApp().navigatorClick(t, e);
        }, this.setDeviceInfo(), this.setPageClasses(), this.setUserInfo(), void 0 === e.showLoadling && (e.showLoading = function(e) {
            i.showLoading(e);
        }), void 0 === e.hideLoading && (e.hideLoading = function(e) {
            i.hideLoading(e);
        }), this.setWxappImg(), this.setBarTitle();
    },
    onReady: function(e) {
        this.currentPage = e;
    },
    onShow: function(e) {
        this.currentPage = e, getApp().order_pay.init(e, getApp());
    },
    onHide: function(e) {
        this.currentPage = e;
    },
    onUnload: function(e) {
        this.currentPage = e;
    },
    showToast: function(e) {
        var t = this.currentPage, a = e.duration || 2500, i = e.title || "", s = (e.success, 
        e.fail, e.complete || null);
        t._toast_timer && clearTimeout(t._toast_timer), t.setData({
            _toast: {
                title: i
            }
        }), t._toast_timer = setTimeout(function() {
            var e = t.data._toast;
            e.hide = !0, t.setData({
                _toast: e
            }), "function" == typeof s && s();
        }, a);
    },
    formIdFormSubmit: function(e) {},
    setDeviceInfo: function() {
        var e = this.currentPage, t = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], a = wx.getSystemInfoSync();
        if (a.model) {
            a.model.indexOf("iPhone X") >= 0 && (a.model = "iPhone X");
            for (var i in t) t[i].model == a.model && e.setData({
                __device: t[i].id
            });
        }
    },
    setPageNavbar: function(e) {
        function t(t) {
            var a = !1, i = e.route || e.__route__ || null;
            for (var s in t.navs) t.navs[s].url === "/" + i ? (t.navs[s].active = !0, a = !0) : t.navs[s].active = !1;
            a && e.setData({
                _navbar: t
            });
        }
        var a = this, i = wx.getStorageSync("_navbar");
        i && t(i);
        var s = !1;
        for (var n in this.navbarPages) if (e.route == this.navbarPages[n]) {
            s = !0;
            break;
        }
        s && getApp().request({
            url: getApp().api.default.navbar,
            success: function(e) {
                0 == e.code && (t(e.data), wx.setStorageSync("_navbar", e.data), a.setPageClasses());
            }
        });
    },
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index", "mch/m/myshop/myshop", "mch/shop-list/shop-list", "pages/integral-mall/index/index", "pages/integral-mall/register/index", "pages/article-detail/article-detail", "pages/article-list/article-list" ],
    setPageClasses: function() {
        var e = this.currentPage, t = e.data.__device;
        e.data._navbar && e.data._navbar.navs && e.data._navbar.navs.length > 0 && (t += " show_navbar"), 
        t && e.setData({
            __page_classes: t
        });
    },
    setUserInfo: function() {
        var e = this.currentPage, t = wx.getStorageSync("user_info");
        t && e.setData({
            __user_info: t
        });
    },
    showLoading: function(e) {
        this.currentPage.setData({
            _loading: !0
        });
    },
    hideLoading: function(e) {
        this.currentPage.setData({
            _loading: !1
        });
    },
    setWxappImg: function(e) {
        var t = this.currentPage, a = wx.getStorageSync("wxapp_img");
        a && t.setData({
            __wxapp_img: a
        });
    },
    setBarTitle: function(e) {
        var t = this.currentPage.route, a = wx.getStorageSync("wx_bar_title");
        for (var i in a) a[i].url === t && wx.setNavigationBarTitle({
            title: a[i].title
        });
    }
};