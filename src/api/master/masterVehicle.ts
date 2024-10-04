import request from "@/utils/request";

export const getVehicleAPI = () => {
  return request({
    url: "/api/v1/vehicle/list",
    method: "get",
  });
};

export const createVehicleAPI = (data: any) => {
  return request({
    url: "/api/v1/vehicle",
    method: "post",
    data
  });
};

export const updateVehicleAPI = (data: any) => {
  return request({
    url: `/api/v1/vehicle/${data.vehicle_id}`,
    method: "put",
    data,
  });
};

export const deleteVehicleAPI = (params: any) => {
  return request({
    url: `/api/v1/vehicle/${params.vehicle_id}`,
    method: "delete",
    params,
  });
};
