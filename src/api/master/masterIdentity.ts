import request from "@/utils/request";


export const getIdentityAPI = () => {
  return request({
    url: "/api/v1/identitas/list",
    method: "get"
  });
};

export const createIdentityAPI = (data: any) => {
  return request({
    url: "/api/v1/master/identity",
    method: "post",
    data,
  });
};

export const updateIdentityAPI = (data: any) => {
  return request({
    url: "/api/v1/master/identity",
    method: "put",
    data,
  });
};
