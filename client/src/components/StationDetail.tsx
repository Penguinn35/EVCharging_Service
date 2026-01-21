import React from "react";
import { ChargingStation } from "@/models/station";
import { BsFillLightningChargeFill } from "react-icons/bs";

type StationDetailProps = {
  station: ChargingStation;
  onClose: () => void;
  handleRouting: () => void;
};

const statusColor = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  maintenance: "bg-orange-100 text-orange-700",
};

const StationDetail = ({ station, onClose, handleRouting }: StationDetailProps) => {

  return (
    <div className="fixed bottom-0 left-0  z-[1000] h-[86%] w-sm rounded-tr-xl bg-white  shadow-xl flex flex-col ">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-400 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{station.name}</h2>
          <p className="text-sm text-gray-500">{station.addressInfor}</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
      <div className=" overflow-y-auto">
        <div>
          <img
            src={station.img ? station.img[0] ?? undefined : undefined}
            alt=""
          />
        </div>

        {/* <div className="px-4 py-3 flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColor["active"] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {station.status.toUpperCase()}
          </span>

          <span className="text-sm text-gray-600">
            {station.totalPoints} điểm sạc
          </span>
        </div> */}

        {/* Charging points list */}
        <div className="flex-1  px-4 space-y-3 ">
          <div className="py-3 flex items-center gap-3 mb-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusColor["active"] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              CÓ SẴN
            </span>

            <span className="text-sm text-gray-600">
              {station.totalPoints} điểm sạc
            </span>
          </div>
          {station.chargingPoints.map((point) =>
            point.id <= 303 ? (
              <div
                key={point.id}
                className=" shadow-md/30 shadow-green-500 rounded-2xl p-3 flex flex-row items-center "
              >
                <BsFillLightningChargeFill className="text-green-500 mr-[8px]" />

                {/* Connectors */}
                <div className="space-y-2 w-full">
                  {point.Connectors.map((connector) => (
                    <div
                      key={connector.id}
                      className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">{connector.type}</p>
                        <p className="text-gray-500">
                          {connector.voltageV} V · {connector.maxPowerKW} kW
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}

          <div className="py-3 flex items-center gap-3 mb-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusColor["maintenance"] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              ĐANG BẬN
            </span>

            <span className="text-sm text-gray-600">
              {station.totalPoints} điểm sạc
            </span>
          </div>
        </div>
        {station.chargingPoints.map((point) =>
          point.id >= 303 ? (
            <div
              key={point.id}
              className=" shadow-md/30 shadow-orange-500 rounded-2xl p-3 flex flex-row items-center "
            >
              <BsFillLightningChargeFill className="text-orange-500 mr-[8px]" />

              {/* Connectors */}
              <div className="space-y-2 w-full">
                {point.Connectors.map((connector) => (
                  <div
                    key={connector.id}
                    className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="font-medium">{connector.type}</p>
                      <p className="text-gray-500">
                        {connector.voltageV} V · {connector.maxPowerKW} kW
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
        <div></div>
      </div>

      {/* Actions */}
      <div className="border-t border-green-400 px-4 py-3 flex gap-3">
        <button className="flex-1 h-11 rounded-xl border border-stone-300 font-medium"></button>
        <button
          className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-medium cursor-pointer hover:bg-blue-500"
          onClick={() => handleRouting()}
        >
          Dẫn đường
        </button>
      </div>
    </div>
  );
};

export default StationDetail;
