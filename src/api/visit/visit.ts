import request from "@/utils/request";

export const getVisitAPI = (params: any) => {
  return request({
    url: "/api/v1/visit",
    method: "get",
    params,
  });
};

export const createVisitAPI = (data: any) => {
  return request({
    url: "/api/v1/visit",
    method: "post",
    data,
  });
};
