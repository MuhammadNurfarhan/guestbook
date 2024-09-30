import request from "@/utils/request";

export const getVisitAPI = (date: Date) => {
  const formattedDate = formatDate(date);
  return request({
    url: "/api/v1/visit/list",
    method: "get",
    params: {
      Created_date: formattedDate,
    },
  });
}

export const createVisitAPI = (data: any) => {
  return request({
    url: "/api/v1/visit",
    method: "post",
    data,
  });
};

export const updateVisitAPI = (data: any) => {
  return request({
    url: "/api/v1/visit",
    method: "put",
    data,
  });
};

export const deleteVisitAPI = (data: any) => {
  return request({
    url: "/api/v1/visit",
    method: "delete",
    data,
  });
}

// Helper function to format the date
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
