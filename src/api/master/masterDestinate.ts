import request from "@/utils/request";

export const getDestinateAPI = () => {
  return request({
    url: "/api/v1/destinate/list",
    method: "get",
  });
};

export const createDestinateAPI = (data: any) => {
  return request({
    url: "/api/v1/master/destinate",
    method: "post",
    data,
  });
};

export const updateDestinateAPI = (data: any) => {
  return request({
    url: "/api/v1/master/destinate",
    method: "put",
    data,
  });
};
