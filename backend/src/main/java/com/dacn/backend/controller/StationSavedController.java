package com.dacn.backend.controller;

import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.StationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users/save-stations")
@Tag(name = "API trạm sạc được lưu", description = "Danh sách api tương tác với trạm sạc đã được lưu bởi người dùng")
@ApiResponses(
        value = {
                @ApiResponse(responseCode = "500", description = "Lỗi database hoặc lỗi hệ thống")
        }
)
public class StationSavedController {

    @Autowired
    private StationService stationService;

    @PostMapping("")
    @Operation(
            summary = "API người dùng lưu trạm sạc",
            description = "Lưu vào 1 trạm sạc yêu thích"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "201", description = "Lưu thành công"),
                    @ApiResponse(responseCode = "404", description = "Không tìm thấy trạm sạc với tên đó")
            }
    )
    public ResponseEntity<ResponseObject<Boolean>> saveStation(
            @AuthenticationPrincipal UserPrincipal principal, @RequestParam String stationId
    ) {
        String userId = principal.getUserId();
        stationService.saveStation(userId, stationId);
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.CREATED, "Saved station successfully",
                true, 1), HttpStatus.CREATED);
    }

    @DeleteMapping("")
    @Operation(
            summary = "API xóa trạm sạc đã lưu cho người dùng",
            description = "Xóa 1 trạm sạc trong danh sách trạm sạc yêu thích"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "202", description = "Xóa trạm sạc thành công"),
                    @ApiResponse(responseCode = "404", description = "Không tìm thấy trạm sạc với tên đó")
            }
    )
    public ResponseEntity<ResponseObject<Boolean>> deleteSaveStation(
            @AuthenticationPrincipal UserPrincipal principal, @RequestParam String stationId
    ) {
        String userId = principal.getUserId();
        stationService.deleteSaveStation(userId, stationId);
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.ACCEPTED, "Delete station successfully",
                true, 1), HttpStatus.ACCEPTED);
    }
}
