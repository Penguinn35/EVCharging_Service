package com.dacn.backend.service;

import com.dacn.backend.model.ChargingStation;
import com.dacn.backend.repository.ChargingStationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service
public class MqttMessageHandler {

    @Autowired
    private ChargingStationRepo repository;

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleMessage(Message<?> message) {
        String topic = message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC).toString();
        String payload = message.getPayload().toString();

        // Topic format: stations/STATION_001/stats -> Lấy STATION_001
        String stationId = topic.split("/")[1];

        try {
            // Giả sử payload là số lượng xe (dạng text đơn giản)
            Long currentCount = Long.parseLong(payload);

            ChargingStation station = repository.findById(stationId).orElse(null);
            if (station != null) {
                station.updateVehicleCount(currentCount); // Hàm logic bạn đã viết ở Entity
                repository.save(station);
                System.out.println("Updated station " + stationId + " to " + currentCount + " vehicles via MQTT");
            }
        } catch (NumberFormatException e) {
            System.err.println("Invalid payload: " + payload);
        }
    }
}
