import request from "@/utils/request";

export const getMasterPurposeAPI = (params: any) => {
  return request({
    url: "/api/v1/master/purpose",
    method: "get",
    params,
  });
};

export const createMasterPurposeAPI = (data: any) => {
  return request({
    url: "/api/v1/master/purpose",
    method: "post",
    data,
  });
};

export const updateMasterPurposeAPI = (data: any) => {
  return request({
    url: "/api/v1/master/purpose",
    method: "put",
    data,
  });
};
