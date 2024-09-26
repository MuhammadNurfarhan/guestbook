import request from "@/utils/request";

export const getMasterVendorAPI = (params: any) => {
  return request({
    url: "/api/v1/master/vendor",
    method: "get",
    params,
  });
};

export const createMasterVendorAPI = (data: any) => {
  return request({
    url: "/api/v1/master/vendor",
    method: "post",
    data,
  });
};

export const updateMasterVendorAPI = (data: any) => {
  return request({
    url: "/api/v1/master/vendor",
    method: "put",
    data,
  });
};
