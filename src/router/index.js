import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components//views/Login'
import MainPanel from '@/components//views/MainPanel'
import Stock from '@/components//views/Stock'
import SaleRecord from '@/components//views/SaleRecord'
import PurchaseRecord from '@/components//views/PurchaseRecord'
import PrePurchase from '@/components//views/PrePurchase'
import Item from '@/components//views/Item'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      alias: "/login",
      name: 'Login',
      component: Login
    },
    {
      path: '/mainPanel',
      name: 'MainPanel',
      component: MainPanel,
      children: [
        {
          path: '/stock',
          name: 'Stock',
          component: Stock
        },
        {
          path: '/saleRecord',
          name: 'SaleRecord',
          component: SaleRecord
        },
        {
          path: '/purchaseRecord',
          name: 'PurchaseRecord',
          component: PurchaseRecord
        },
        {
          path: '/prePurchase',
          name: 'PrePurchase',
          component: PrePurchase
        },
        {
          path: '/item',
          name: 'Item',
          component: Item
        }
      ]
    },
  ]
})
