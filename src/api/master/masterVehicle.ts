import request from "@/utils/request";

export const getVehicleAPI = () => {
  return request({
    url: "/api/v1/vehicle/list",
    method: "get",
  });
};

export const createVehicleAPI = (data: any) => {
  return request({
    url: "/api/v1/master/vehicle",
    method: "post",
    data,
  });
};

export const updateVehicleAPI = (data: any) => {
  return request({
    url: "/api/v1/master/vehicle",
    method: "put",
    data,
  });
};
