import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorConrext";

import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData,completeAppoinment,cancelAppoinment } =
    useContext(DoctorContext);

  const { currency,slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);
  return (
    dashData && (
      <div className="mt-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-3 bg-white rounded p-4 min-w-52 border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 ">
                {currency} {dashData.earning}
              </p>
              <p className="text-gray-400">Earning</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded p-4 min-w-52 border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 ">
                {dashData.appoinments}
              </p>
              <p className="text-gray-400">Appoinments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white rounded p-4 min-w-52 border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600 ">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex item-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Booking</p>
          </div>
          <div className="pt-4 border border-t-0">
            {dashData.latestAppoinments.map((item, index) => (
              <div
                className="flex item-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                              <p className="text-red-400 text-sm font-medium">Cancelled</p>
                            ) : item.isCompleted ? (
                              <p className="text-green-500 text-sm font-medium">Completed</p>
                            ) : (
                              <div className="flex">
                                <img
                                  onClick={() => cancelAppoinment(item._id)}
                                  className="w-10 cursor-pointer"
                                  src={assets.cancel_icon}
                                  alt=""
                                />
                                <img
                                  onClick={() => completeAppoinment(item._id)}
                                  className="w-10 cursor-pointer"
                                  src={assets.tick_icon}
                                  alt=""
                                />
                              </div>
                            )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
