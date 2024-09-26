import request from "@/utils/request";

export const getUserSettingAPI = (params: any) => {
  return request({
    url: "/api/v1/setting/user",
    method: "get",
    params,
  });
};

export const updateUserSettingAPI = (data: any) => {
  return request({
    url: "/api/v1/setting/user",
    method: "put",
    data,
  });
};
