var t = require("../../../api.js"), a = getApp();

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        currentGood: {},
        checked_attr: [],
        checkedGood: [],
        attr_group_list: [],
        goods: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        check_goods_price: 0,
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.setData({
            store: wx.getStorageSync("store")
        });
    },
    onShow: function() {
        a.pageOnShow(this), this.loadData();
    },
    onHide: function() {
        a.pageOnHide(this);
        var t = this, o = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: [],
            checked_attr: t.data.checked_attr
        };
        wx.setStorageSync("item", o);
    },
    onUnload: function() {
        a.pageOnUnload(this);
        var t = this, o = {
            quick_list: t.data.quick_list,
            carGoods: t.data.carGoods,
            total: t.data.total,
            quick_hot_goods_lists: [],
            checked_attr: t.data.checked_attr
        };
        console.log(t.data.quick_list), wx.setStorageSync("item", o);
    },
    loadData: function(o) {
        var r = this, i = wx.getStorageSync("item");
        r.setData({
            total: i.total ? i.total : [],
            carGoods: i.carGoods ? i.carGoods : []
        }), wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.quick.quick,
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = t.data.list, o = [], e = [];
                    for (var s in a) if (a[s].goods.length > 0) {
                        e.push(a[s]);
                        for (var d in a[s].goods) {
                            for (var c in i.carGoods) i.carGoods[c].goods_id === parseInt(a[s].goods[d].id) && (a[s].goods[d].num = a[s].goods[d].num ? a[s].goods[d].num : 0, 
                            a[s].goods[d].num += i.carGoods[c].num);
                            parseInt(a[s].goods[d].hot_cakes) && o.push(a[s].goods[d]);
                        }
                    }
                    r.setData({
                        quick_hot_goods_lists: o,
                        quick_list: e
                    });
                }
            }
        });
    },
    get_goods_info: function(t) {
        var a = this, o = a.data.carGoods, r = a.data.total, i = a.data.quick_hot_goods_lists, e = a.data.quick_list, s = {
            carGoods: o,
            total: r,
            quick_hot_goods_lists: i,
            check_num: a.data.check_num,
            quick_list: e
        };
        wx.setStorageSync("item", s);
        var d = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/goods/goods?id=" + d + "&quick=1"
        });
    },
    selectMenu: function(t) {
        var a = t.currentTarget.dataset, o = this.data.quick_list;
        if ("hot_cakes" == a.tag) for (var r = !0, i = o.length, e = 0; e < i; e++) o[e].cat_checked = !1; else {
            for (var s = a.index, i = o.length, e = 0; e < i; e++) o[e].cat_checked = !1, o[e].id == o[s].id && (o[e].cat_checked = !0);
            r = !1;
        }
        this.setData({
            toView: a.tag,
            selectedMenuId: a.id,
            quick_list: o,
            cat_checked: r
        });
    },
    onShareAppMessage: function(t) {
        var o = this;
        return {
            path: "/pages/quick-purchase/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                1 == ++share_count && a.shareSendCoupon(o);
            }
        };
    },
    jia: function(t) {
        var a = this, o = t.currentTarget.dataset, r = a.data.quick_list;
        for (var i in r) for (var e in r[i].goods) if (parseInt(r[i].goods[e].id) === parseInt(o.id)) {
            var s = r[i].goods[e].num;
            if (r[i].goods[e].num = s ? ++s : 1, s > JSON.parse(r[i].goods[e].attr)[0].num) return wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), void --s;
            var d = a.data.carGoods, c = 1, n = t.currentTarget.dataset.price ? t.currentTarget.dataset.price : r[i].goods[e].price;
            for (var u in d) {
                if (d[u].goods_id === parseInt(o.id) && 1 === d[u].attr.length) {
                    c = 0, d[u].num += 1, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
                if (d[u].price == parseFloat(t.currentTarget.dataset.price)) {
                    c = 0, d[u].num += 1, d[u].goods_price = (d[u].num * d[u].price).toFixed(2);
                    break;
                }
            }
            if (1 === c || 0 === d.length) {
                var g = JSON.parse(r[i].goods[e].attr), _ = [];
                _.push(g[0].attr_list[0]), d.push({
                    goods_id: parseInt(r[i].goods[e].id),
                    attr: _,
                    goods_name: r[i].goods[e].name,
                    goods_price: n,
                    num: 1,
                    price: n
                });
            }
        }
        var l = a.data.total.total_num ? a.data.total.total_num : 0, p = a.data.total.total_price ? a.data.total.total_price : 0, h = {
            total_num: l += 1,
            total_price: p = (parseFloat(p) + parseFloat(n)).toFixed(2)
        };
        a.setData({
            carGoods: d,
            quick_list: r,
            total: h
        });
    },
    jian: function(t) {
        var a = this, o = t.currentTarget.dataset, r = a.data.quick_list;
        for (var i in r) for (var e in r[i].goods) if (parseInt(r[i].goods[e].id) === parseInt(o.id)) {
            var s = r[i].goods[e].num;
            if (r[i].goods[e].num = --s, s > JSON.parse(r[i].goods[e].attr)[0].num) return wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), void ++s;
            var d = a.data.carGoods;
            for (var c in d) {
                var n = t.currentTarget.dataset.price ? t.currentTarget.dataset.price : r[i].goods[e].price;
                if (d[c].goods_id === parseInt(o.id) && 1 === d[c].attr.length) {
                    0, d[c].num -= 1, d[c].goods_price = (d[c].num * d[c].price).toFixed(2);
                    break;
                }
                if (d[c].price == parseFloat(t.currentTarget.dataset.price)) {
                    0, d[c].num -= 1, d[c].goods_price = (d[c].num * d[c].price).toFixed(2);
                    break;
                }
            }
        }
        var u = a.data.total.total_num, g = a.data.total.total_price, _ = {
            total_num: u -= 1,
            total_price: g = (parseFloat(g) - parseFloat(n)).toFixed(2)
        };
        a.setData({
            carGoods: d,
            quick_list: r,
            total: _
        });
    },
    tianjia: function(t) {
        this.jia(t);
    },
    jianshao: function(t) {
        this.jian(t);
    },
    showDialogBtn: function(o) {
        var r = this, i = o.currentTarget.dataset;
        a.request({
            url: t.default.goods,
            data: {
                id: i.id
            },
            success: function(t) {
                0 == t.code && (r.setData({
                    currentGood: t.data,
                    goods_name: t.data.name,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                }), r.resetData(), r.updateData());
            }
        });
    },
    resetData: function() {
        this.setData({
            checked_attr: [],
            check_num: 0,
            check_goods_price: 0,
            goods: {
                price: "0.00"
            }
        });
    },
    updateData: function() {
        var t = this, a = t.data.currentGood, o = t.data.carGoods, r = JSON.parse(a.attr), i = a.attr_group_list;
        for (var e in r) {
            var s = [];
            for (var d in r[e].attr_list) s.push(r[e].attr_list[d].attr_id);
            for (var c in o) {
                var n = [];
                for (var u in o[c].attr) n.push(o[c].attr[u].attr_id);
                if (s.sort().join() === n.sort().join()) {
                    for (var g in i) for (var _ in i[g].attr_list) for (var l in s) {
                        if (parseInt(i[g].attr_list[_].attr_id) === parseInt(s[l])) {
                            i[g].attr_list[_].checked = !0;
                            break;
                        }
                        i[g].attr_list[_].checked = !1;
                    }
                    var p = {
                        price: o[c].price
                    };
                    return void t.setData({
                        attr_group_list: i,
                        check_num: o[c].num,
                        check_goods_price: o[c].goods_price,
                        checked_attr: s,
                        goods: p
                    });
                }
            }
        }
    },
    checkUpdateData: function(t) {
        var a = this, o = a.data.carGoods;
        for (var r in o) {
            var i = [];
            for (var e in o[r].attr) i.push(o[r].attr[e].attr_id);
            i.sort().join() === t.sort().join() && a.setData({
                check_num: o[r].num,
                check_goods_price: o[r].goods_price
            });
        }
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, r = t.target.dataset.id, i = a.data.attr_group_list, e = a.data.currentGood;
        for (var s in i) if (i[s].attr_group_id == o) for (var d in i[s].attr_list) i[s].attr_list[d].attr_id == r ? i[s].attr_list[d].checked = !0 : i[s].attr_list[d].checked = !1;
        var c = [];
        for (var s in i) for (var d in i[s].attr_list) !0 === i[s].attr_list[d].checked && c.push(i[s].attr_list[d].attr_id);
        var n = JSON.parse(a.data.currentGood.attr), u = a.data.goods;
        for (var g in n) {
            var _ = [];
            for (var l in n[g].attr_list) _.push(n[g].attr_list[l].attr_id);
            if (_.sort().join() === c.sort().join()) {
                if (0 === parseInt(n[g].num)) return void wx.showToast({
                    title: "商品库存不足，请选择其它规格或数量",
                    image: "/images/icon-warning.png"
                });
                u = parseFloat(n[g].price) ? {
                    price: n[g].price.toFixed(2)
                } : {
                    price: e.price.toFixed(2)
                };
            }
        }
        a.resetData(), a.checkUpdateData(c), a.setData({
            attr_group_list: i,
            goods: u,
            checked_attr: c
        });
    },
    onConfirm: function(t) {
        var a = this, o = a.data.attr_group_list, r = a.data.checked_attr, i = a.data.currentGood, e = a.data.check_num ? ++a.data.check_num : 1;
        if (r.length === o.length) {
            var s = a.data.quick_list;
            for (var d in s) for (var c in s[d].goods) if (parseInt(s[d].goods[c].id) === parseInt(i.id)) {
                var n = s[d].goods[c].num;
                if (s[d].goods[c].num = n ? ++n : 1, n > JSON.parse(s[d].goods[c].attr)[0].num) return wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), void --n;
                var u = a.data.total.total_num ? a.data.total.total_num : 0, g = a.data.total.total_price ? a.data.total.total_price : 0;
                u += 1, g = (parseFloat(g) + parseFloat(1 * a.data.goods.price)).toFixed(2);
                var _ = a.data.carGoods, l = 1, p = (parseFloat(a.data.goods.price) * e).toFixed(2);
                for (var h in _) {
                    var f = [];
                    for (var v in _[h].attr) f.push(_[h].attr[v].attr_id);
                    if (f.sort().join() === r.sort().join()) {
                        l = 0, _[h].num += 1, _[h].goods_price = (parseFloat(a.data.goods.price) * _[h].num).toFixed(2);
                        break;
                    }
                }
                if (1 === l || 0 === _.length) {
                    var m = JSON.parse(s[d].goods[c].attr), k = [];
                    for (var w in m) {
                        var x = [];
                        for (var G in m[w].attr_list) x.push(m[w].attr_list[G].attr_id);
                        if (x.sort().join() === a.data.checked_attr.sort().join()) {
                            var q = parseFloat(m[w].price) ? m[w].price.toFixed(2) : i.price.toFixed(2);
                            if (k = m[w].attr_list, 0 === parseInt(m[w].num)) return void wx.showToast({
                                title: "商品库存不足，请选择其它规格或数量",
                                image: "/images/icon-warning.png"
                            });
                        }
                    }
                    _.push({
                        goods_id: parseInt(s[d].goods[c].id),
                        attr: k,
                        goods_name: s[d].goods[c].name,
                        goods_price: p,
                        num: 1,
                        price: q
                    });
                }
            }
            var D = {
                total_num: u,
                total_price: g
            }, F = {
                price: a.data.goods.price
            };
            a.setData({
                carGoods: _,
                quick_list: s,
                total: D,
                check_goods_price: p,
                check_num: e,
                goods: F
            });
        } else wx.showToast({
            title: "请选择规格",
            image: "/images/icon-warning.png"
        });
    },
    preventTouchMove: function() {},
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    guigejian: function(t) {
        var a = this, o = a.data.checked_attr, r = a.data.carGoods, i = a.data.quick_list, e = a.data.check_num ? --a.data.check_num : 1, s = a.data.currentGood;
        for (var d in r) {
            var c = [];
            for (var n in r[d].attr) c.push(r[d].attr[n].attr_id);
            if (c.sort().join() === o.sort().join()) {
                r[d].num -= 1, r[d].goods_price = (r[d].num * parseFloat(r[d].price)).toFixed(2);
                var u = a.data.total.total_num, g = a.data.total.total_price, _ = {
                    total_num: --u,
                    total_price: g = (parseFloat(g) - parseFloat(r[d].price)).toFixed(2)
                };
                for (var l in i) for (var p in i[l].goods) parseInt(i[l].goods[p].id) === parseInt(s.id) && (i[l].goods[p].num -= 1);
                var h = {
                    price: a.data.goods.price
                };
                return void a.setData({
                    carGoods: r,
                    total: _,
                    quick_list: i,
                    check_goods_price: r[d].goods_price,
                    check_num: e,
                    goods: h
                });
            }
        }
    },
    goodsModel: function(t) {
        var a = this, o = (a.data.carGoods, a.data.goodsModel);
        o ? a.setData({
            goodsModel: !1
        }) : a.setData({
            goodsModel: !0
        });
    },
    hideGoodsModel: function() {
        this.setData({
            goodsModel: !1
        });
    },
    clearCar: function(t) {
        var a = this, o = a.data.quick_list;
        for (var r in o) for (var i in o[r].goods) o[r].goods[i].num = 0;
        a.setData({
            goodsModel: !1,
            carGoods: [],
            total: {},
            check_num: 0,
            quick_list: o,
            currentGood: [],
            checked_attr: [],
            check_goods_price: 0,
            goods: {}
        }), wx.removeStorageSync("item");
    },
    buynow: function(t) {
        var a = this, o = a.data.carGoods;
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var r = o.length, i = [], e = [], s = 0; s < r; s++) 0 != o[s].num && (e = {
            id: o[s].goods_id,
            num: o[s].num,
            attr: o[s].attr
        }, i.push(e));
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?cart_list=" + JSON.stringify(i)
        }), a.clearCar();
    }
});