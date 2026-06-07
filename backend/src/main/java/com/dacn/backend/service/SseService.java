package com.dacn.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    // Map lưu trữ: Key là stationId, Value là danh sách các Emitter đang subscribe vào trạm đó
    private final Map<String, List<SseEmitter>> stationEmitters = new ConcurrentHashMap<>();

    public SseEmitter subscribeToStation(String stationId) {
        // Đặt timeout (VD: 15 phút). Hết hạn client sẽ tự reconnect.
        SseEmitter emitter = new SseEmitter(15 * 60 * 1000L);

        stationEmitters.computeIfAbsent(stationId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        // Xử lý dọn dẹp bộ nhớ khi kết nối ngắt
        emitter.onCompletion(() -> removeEmitter(stationId, emitter));
        emitter.onTimeout(() -> removeEmitter(stationId, emitter));
        emitter.onError((e) -> removeEmitter(stationId, emitter));

        // Gửi ngay 1 event connection thành công (tùy chọn, giúp debug frontend dễ hơn)
        try {
            emitter.send(SseEmitter.event().name("CONNECTED").data("Subscribed to station: " + stationId));
        } catch (IOException e) {
            removeEmitter(stationId, emitter);
        }

        return emitter;
    }

    public void broadcastStationUpdate(String stationId, Object updateData) {
        List<SseEmitter> emitters = stationEmitters.get(stationId);
        if (emitters != null) {
            for (SseEmitter emitter : emitters) {
                try {
                    // Tên event là 'station-update', Next.js sẽ lắng nghe tên này
                    emitter.send(SseEmitter.event()
                            .name("station-update")
                            .data(updateData));
                } catch (IOException e) {
                    emitter.complete();
                    removeEmitter(stationId, emitter);
                }
            }
        }
    }

    private void removeEmitter(String stationId, SseEmitter emitter) {
        List<SseEmitter> emitters = stationEmitters.get(stationId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) {
                stationEmitters.remove(stationId);
            }
        }
    }
}
