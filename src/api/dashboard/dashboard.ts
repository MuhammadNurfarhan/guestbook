import request from "@/utils/request";

export const getDashboardAPI = (params: any) => {
  return request({
    url: "/api/v1/dashboard",
    method: "get",
    params,
  });
};
