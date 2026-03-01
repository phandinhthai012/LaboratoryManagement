package fit.warehouse_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "fit.warehouse_service.client")
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableScheduling
public class WarehouseServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(WarehouseServiceApplication.class, args);
	}

}
