import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

const traceExporter = new OTLPTraceExporter({
	url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/traces",
});

export const otelSDK = new NodeSDK({
	resource: new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: "inventory-backend",
		[SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
	}),
	traceExporter,
	instrumentations: [getNodeAutoInstrumentations()],
});

// Initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
export function initializeTracing() {
	otelSDK.start();

	// Gracefully shut down the SDK on process exit
	process.on("SIGTERM", () => {
		otelSDK
			.shutdown()
			.then(() => console.log("Tracing terminated"))
			.catch((error) => console.log("Error terminating tracing", error))
			.finally(() => process.exit(0));
	});
}
