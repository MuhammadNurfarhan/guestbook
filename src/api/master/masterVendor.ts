import request from "@/utils/request";

export const getVendorAPI = () => {
  return request({
    url: "/api/v1/vendor/list",
    method: "get",
  });
};

export const createVendorAPI = (data: any) => {
  return request({
    url: "/api/v1/vendor",
    method: "post",
    data
  });
};

export const updateVendorAPI = (data: any) => {
  return request({
    url: `/api/v1/vendor/${data.vendor_id}`,
    method: "put",
    data,
  });
};

export const deleteVendorAPI = (params: any) => {
  return request({
    url: `/api/v1/vendor/${params.vendor_id}`,
    method: "delete",
    params,
  });
};
