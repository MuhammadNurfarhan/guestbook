import request from "@/utils/request";

export const getVendorAPI = () => {
  return request({
    url: "/api/v1/vendor/list",
    method: "get"
  });
};

export const createVendorAPI = () => {
  return request({
    url: "/api/v1/vendor",
    method: "post"
  });
};

export const updateVendorAPI = (params: any) => {
  return request({
    url: "/api/v1/vendor",
    method: "put",
    params,
  });
};

export const deleteVendorAPI = (data: any) => {
  return request({
    url: "/api/v1/vendor",
    method: "delete",
    data,
  });
};
