/*
 * @ (#) InstrumentMapper.java    1.0    29/10/2025
 * Copyright (c) 2025 IUH. All rights reserved.
 */
package fit.warehouse_service.mappers;/*
 * @description:
 * @author: Bao Thong
 * @date: 29/10/2025
 * @version: 1.0
 */

import fit.warehouse_service.client.InstrumentFeignClient;
import fit.warehouse_service.client.dtos.InstrumentMode;
import fit.warehouse_service.client.dtos.InstrumentModeResponse;
import fit.warehouse_service.dtos.response.ApiResponse;
import fit.warehouse_service.dtos.response.InstrumentResponse;
import fit.warehouse_service.entities.ConfigurationSetting;
import fit.warehouse_service.entities.Instrument;
import fit.warehouse_service.entities.ReagentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class InstrumentMapper {

    private final InstrumentFeignClient instrumentFeignClient;

    public InstrumentResponse toResponse(Instrument instrument) {
        InstrumentMode safeMode = InstrumentMode.UNKNOWN;

        try {
            ApiResponse<InstrumentModeResponse> modeRes =
                    instrumentFeignClient.getInstrumentMode(instrument.getId());

            if (modeRes != null && modeRes.getData() != null) {
                String raw = String.valueOf(modeRes.getData().getMode());

                if (raw != null && !raw.isBlank()) {
                    try {
                        safeMode = InstrumentMode.valueOf(raw);
                    } catch (IllegalArgumentException e) {
                        log.warn("[InstrumentMapper] Invalid mode '{}' for instrument {} → fallback UNKNOWN",
                                raw, instrument.getId());
                        safeMode = InstrumentMode.UNKNOWN;
                    }
                }
            }

        } catch (Exception e) {
            log.error("[InstrumentMapper] Cannot fetch mode for instrument {}: {}",
                    instrument.getId(), e.getMessage());
        }

        return InstrumentResponse.builder()
                .id(instrument.getId())
                .name(instrument.getName())
                .status(instrument.getStatus())
                .mode(safeMode) // Set mode fetched from instrument-service
                .isActive(instrument.isActive())
                .createdAt(instrument.getCreatedAt())
                .createdByUserId(instrument.getCreatedByUserId())
                .ipAddress(instrument.getIpAddress())
                .port(instrument.getPort())
                .protocolType(instrument.getProtocolType())
                .compatibleReagentIds(
                        instrument.getCompatibleReagents() != null ?
                                instrument.getCompatibleReagents().stream()
                                        .map(ReagentType::getId)
                                        .collect(Collectors.toSet()) : null // Handle null collections gracefully
                )
                .configurationSettingIds( // Renamed for clarity to match DTO field name
                        instrument.getConfigurations() != null ?
                                instrument.getConfigurations().stream()
                                        .map(ConfigurationSetting::getId)
                                        .collect(Collectors.toSet()) : null // Handle null collections gracefully
                )
                .updatedAt(instrument.getUpdatedAt())
                .updatedByUserId(instrument.getUpdatedByUserId())
                .deletedAt(instrument.getDeletedAt())
                .isDeleted(instrument.isDeleted())
                .build();
    }
}
