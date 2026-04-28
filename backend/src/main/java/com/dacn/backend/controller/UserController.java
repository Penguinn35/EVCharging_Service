package com.dacn.backend.controller;

import com.dacn.backend.dto.SuggestionRequestDTO;
import com.dacn.backend.dto.UserDetailDTO;
import com.dacn.backend.dto.UserStationCategoriesRequestDTO;
import com.dacn.backend.dto.search_by_keyword.StationResponseDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.model.type.Coordinate;
import com.dacn.backend.object.ResponseObject;
import com.dacn.backend.service.StationService;
import com.dacn.backend.service.UserAccountService;
import com.dacn.backend.service.UserService;
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
@RequestMapping("api/users")
@Tag(name = "API dành cho người dùng", description = "Dành cho việc truy vấn thông tin cá nhân của người dùng")
public class UserController {
    @Autowired
    private UserAccountService userAccountService;
    @Autowired
    private UserService userService;
    @Autowired
    private StationService stationService;

    @GetMapping("detail")
    @Operation(
            summary = "API lấy thông tin người dùng",
            description = "Trả về thông tin chi tiết của người dùng hiện tại đó"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công thông tin người dùng"),
                    @ApiResponse(responseCode = "404", description = "Không tìm thấy thông tin với id đó")
            }
    )
    public ResponseEntity<ResponseObject<UserDetailDTO>> getCurrentUserInfo(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String userId = principal.getUserId();
        UserDetailDTO userDetail = userAccountService.getUserDetail(userId);
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Returned user detail", userDetail
        ), HttpStatus.OK);
    }

    @GetMapping("suggested-station")
    @Operation(
            summary = "API gợi ý trạm sạc",
            description = "Trả về 1 trạm sạc phù hợp với loại đầu sạc thường được sử dụng và vị trí hiện tại gần nhất của người dùng.\n cableType: 0 = CCS2, 1 = TYPE 2, 2 = CHAdeMO, 3 = TESLA"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Trả về thành công thông tin trạm sạc được gợi ý"),
                    @ApiResponse(responseCode = "404", description = "Không có trạm sạc phù hợp với yêu cầu của bạn, vui lòng kiểm tra input")
            }
    )
    public ResponseEntity<ResponseObject<StationResponseDTO>> suggestStation(
            @RequestParam int cableType,
            @RequestParam Double longitude,
            @RequestParam Double latitude
    ) {
        StationResponseDTO response = stationService.getSuggestedStation(
                new UserStationCategoriesRequestDTO(cableType, new Coordinate(longitude, latitude))
        );
        if (response == null) {
            return new ResponseEntity<>(new ResponseObject<>(HttpStatus.NOT_FOUND, "Cannot find the suggested station"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ResponseObject<>(HttpStatus.OK, "Successfully returned the suggested station", response), HttpStatus.OK);
    }

    @PostMapping("suggestion")
    public ResponseEntity<ResponseObject<Boolean>> suggestStation(
            @RequestBody SuggestionRequestDTO suggestionDTO,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        String userId = principal.getUserId();
        return new ResponseEntity<>(new ResponseObject<>(
                HttpStatus.OK, "Suggestion sent", userService.suggestStation(suggestionDTO, userId)
        ), HttpStatus.OK);
    }
}
