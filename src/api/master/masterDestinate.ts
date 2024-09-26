import request from "@/utils/request";

export const getMasterDestinateAPI = (params: any) => {
  return request({
    url: "/api/v1/master/destinate",
    method: "get",
    params,
  });
};

export const createMasterDestinateAPI = (data: any) => {
  return request({
    url: "/api/v1/master/destinate",
    method: "post",
    data,
  });
};

export const updateMasterDestinateAPI = (data: any) => {
  return request({
    url: "/api/v1/master/destinate",
    method: "put",
    data,
  });
};
