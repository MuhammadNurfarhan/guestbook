import request from "@/utils/request";

export const getDestinateAPI = () => {
  return request({
    url: "/api/v1/destinate/list",
    method: "get",
  });
};

export const createDestinateAPI = (data: any) => {
  return request({
    url: "/api/v1/destinate",
    method: "post",
    data,
  });
};

export const updateDestinateAPI = (destinate_id: string, data: any) => {
  return request({
    url: `/api/v1/destinate/${destinate_id}`,
    method: "put",
    data,
  });
};

export const deleteDestinateAPI = (destinate_id: string) => {
  return request({
    url: `/api/v1/destinate/${destinate_id}`,
    method: "delete",
  });
};
