import request from "@/utils/request";

export const getVendorAPI = () => {
  return request({
    url: "/api/v1/vendor/list",
    method: "get"
  });
};

export const createVendorAPI = (data: any) => {
  return request({
    url: "/api/v1/vendor",
    method: "post",
    data
  });
};

export const updateVendorAPI = (vendor_id: string, data: any) => {
  return request({
    url: `/api/v1/vendor/${vendor_id}`,
    method: "put",
    data
  });
};

export const deleteVendorAPI = (vendor_id: string) => {
  return request({
    url: `/api/v1/vendor/${vendor_id}`,
    method: "delete",
  });
};
