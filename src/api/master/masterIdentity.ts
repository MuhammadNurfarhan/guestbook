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
    data,
  });
};

export const updateIdentityAPI = (identitas_id: string, data: any) => {
  return request({
    url: `/api/v1/identitas/${identitas_id}`,
    method: "put",
    data
  });
};

export const deleteIdentityAPI = (identitas_id: string) => {
  return request({
    url: `/api/v1/identitas/${identitas_id}`,
    method: "delete",
  });
};
