import request from "@/utils/request";

export const getUserAPI = () => {
  return request({
    url: "/api/v1/user",
    method: "get",
  });
};

export const updateUserAPI = (data: any) => {
  return request({
    url: `/api/v1/user/${data.user_id}`,
    method: "put",
    data,
  });
};

export const createUserAPI = (data: any) => {
  return request({
    url: "/api/v1/user",
    method: "post",
    data,
  });
};

export const deleteUserAPI = (params: any) => {
  return request({
    url: `/api/v1/user/${params.user_id}`,
    method: "delete",
    params,
  });
};
