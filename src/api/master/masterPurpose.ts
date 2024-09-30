import request from "@/utils/request";

export const getPurposeAPI = () => {
  return request({
    url: "/api/v1/purpose/list",
    method: "get",
  });
};

export const createPurposeAPI = (data: any) => {
  return request({
    url: "/api/v1/master/purpose",
    method: "post",
    data,
  });
};

export const updatePurposeAPI = (data: any) => {
  return request({
    url: "/api/v1/master/purpose",
    method: "put",
    data,
  });
};
