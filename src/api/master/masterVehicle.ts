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

export const updateVehicleAPI = (vehicle_id: string, data: any) => {
  return request({
    url: `/api/v1/vehicle/${vehicle_id}`,
    method: "put",
    data,
  });
};

export const deleteVehicleAPI = (vehicle_id: string) => {
  return request({
    url: `/api/v1/vehicle/${vehicle_id}`,
    method: "delete",
  });
};
