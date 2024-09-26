import request from "@/utils/request";


export const getMasterIdentityAPI = (params: any) => {
  return request({
    url: "/api/v1/master/identity",
    method: "get",
    params,
  });
};

export const createMasterIdentityAPI = (data: any) => {
  return request({
    url: "/api/v1/master/identity",
    method: "post",
    data,
  });
};

export const updateMasterIdentityAPI = (data: any) => {
  return request({
    url: "/api/v1/master/identity",
    method: "put",
    data,
  });
};
