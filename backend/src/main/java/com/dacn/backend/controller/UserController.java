package com.dacn.backend.controller;

import com.dacn.backend.dto.SuggestionRequestDTO;
import com.dacn.backend.dto.UserDetailDTO;
import com.dacn.backend.model.UserPrincipal;
import com.dacn.backend.object.ResponseObject;
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
