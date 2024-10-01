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

export const updatePurposeAPI = (purpose_id: string, data: any) => {
  return request({
    url: `/api/v1/purpose/${purpose_id}`,
    method: "put",
    data
  });
};

export const deletePurposeAPI = (purpose_id: string) => {
  return request({
    url: `/api/v1/purpose/${purpose_id}`,
    method: "delete",
  });
};
