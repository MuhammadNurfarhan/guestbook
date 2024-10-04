import request from "@/utils/request";

export const getPurposeAPI = () => {
  return request({
    url: "/api/v1/purpose/list",
    method: "get",
  });
};

export const createPurposeAPI = (data: any) => {
  return request({
    url: "/api/v1/purpose",
    method: "post",
    data
  });
};

export const updatePurposeAPI = (data: any) => {
  return request({
    url: `/api/v1/purpose/${data.purpose_id}`,
    method: "put",
    data
  });
};

export const deletePurposeAPI = (params: any) => {
  return request({
    url: `/api/v1/purpose/${params.purpose_id}`,
    method: "delete",
    params,
  });
};
