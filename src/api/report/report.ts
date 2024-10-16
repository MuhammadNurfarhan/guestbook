import request from "@/utils/request";

export const getVisitReportAPI = (fromDate: string, toDate: string) => {
  return request({
    url: "/api/v1/visit/report",
    method: "get",
    params: {
      From_date: fromDate,
      To_date: toDate,
    },
  });
};
