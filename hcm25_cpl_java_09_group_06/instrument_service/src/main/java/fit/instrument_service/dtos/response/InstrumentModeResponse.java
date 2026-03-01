/*
 * @ {#} InstrumentModeResponse.java   1.0     02/12/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package fit.instrument_service.dtos.response;

import fit.instrument_service.enums.InstrumentMode;
import lombok.Getter;
import lombok.Setter;

/*
 * @description: Response DTO for instrument mode information.
 * @author: Tran Hien Vinh
 * @date:   02/12/2025
 * @version:    1.0
 */
@Getter
@Setter
public class InstrumentModeResponse {
    private String instrumentId;
    private InstrumentMode mode;
}
