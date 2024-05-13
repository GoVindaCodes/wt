import requests from './httpService';

const NotificationServices = {
  addNotification: async (body) => {
    return requests.post('api/notification/add', body);
  },

  getAllNotification: async () => {
    return requests.get('api/notification');
  },

  updateStatus: async (id, body) => {
    return requests.put(`api/notification/${id}`, body);
  },

  deleteNotification: async (id) => {
    return requests.delete(`api/notification/${id}`);
  },
};

export default NotificationServices;
