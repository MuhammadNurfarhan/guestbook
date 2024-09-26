import request from "@/utils/request";

export const getMasterVehicleAPI = (params: any) => {
  return request({
    url: "/api/v1/master/vehicle",
    method: "get",
    params,
  });
};

export const createMasterVehicleAPI = (data: any) => {
  return request({
    url: "/api/v1/master/vehicle",
    method: "post",
    data,
  });
};

export const updateMasterVehicleAPI = (data: any) => {
  return request({
    url: "/api/v1/master/vehicle",
    method: "put",
    data,
  });
};
