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

export const updateDestinateAPI = (data: any) => {
  return request({
    url: `/api/v1/destinate/${data.destinate_id}`,
    method: "put",
    data,
  });
};

export const deleteDestinateAPI = (params: any) => {
  return request({
    url: `/api/v1/destinate/${params.destinate_id}`,
    method: "delete",
    params,
  });
};
