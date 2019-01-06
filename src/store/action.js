import http from '../http.js'
const actions = {
  getCommodityList (context, data) {
    return http.sendPost({action: 'commodity.getCommodityList', data: data})
  },
  addCommodity (context, data) {
    return http.sendPost({action: 'commodity.addCommodity', data: data})
  },
  removeCommodity (context, data) {
    return http.sendPost({action: 'commodity.removeCommodity', data: data})
  },
  getOrderList (context, data) {
    return http.sendPost({action: 'order.getOrderList', data: data})
  },
  removeImage(context, data) {
    return http.sendPost({action: 'commodity.removeImage', data: data})
  }
};

export default actions;

