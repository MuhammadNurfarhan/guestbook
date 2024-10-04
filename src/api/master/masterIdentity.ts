import request from "@/utils/request";

export const getIdentityAPI = () => {
  return request({
    url: "/api/v1/identitas/list",
    method: "get"
  });
};

export const createIdentityAPI = (data: any) => {
  return request({
    url: "/api/v1/identitas",
    method: "post",
    data
  });
};

export const updateIdentityAPI = (data: any) => {
  return request({
    url: `/api/v1/identitas/${data.identitas_id}`,
    method: "put",
    data
  });
};

export const deleteIdentityAPI = (params: any) => {
  return request({
    url: `/api/v1/identitas/${params.identitas_id}`,
    method: "delete",
    params,
  });
};
