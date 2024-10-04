import request from "@/utils/request";

export const getReportAPI = (params: any) => {
  return request({
    url: "/api/v1/report",
    method: "get",
    params,
  });
};
