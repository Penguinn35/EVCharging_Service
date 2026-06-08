package com.dacn.backend.dto.response_from_externals;

import java.util.List;

public record CpoResponse(
        List<StationDto> data
) {}
