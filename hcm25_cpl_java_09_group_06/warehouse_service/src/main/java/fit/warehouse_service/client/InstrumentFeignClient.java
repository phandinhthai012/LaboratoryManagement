/*
 * @ {#} InstrumentFeignClient.java   1.0     02/12/2025
 *
 * Copyright (c) 2025 IUH. All rights reserved.
 */

package fit.warehouse_service.client;

import fit.warehouse_service.client.dtos.InstrumentModeResponse;
import fit.warehouse_service.configs.FeignClientConfig;
import fit.warehouse_service.dtos.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/*
 * @description: Feign client for communicating with the Instrument Service.
 * @author: Tran Hien Vinh
 * @date:   02/12/2025
 * @version:    1.0
 */
@FeignClient(name = "instrument-service", configuration = FeignClientConfig.class)
public interface InstrumentFeignClient {
    @GetMapping("/api/v1/instruments/internal/{id}")
    ApiResponse<InstrumentModeResponse> getInstrumentMode(@PathVariable("id") String id);
}
