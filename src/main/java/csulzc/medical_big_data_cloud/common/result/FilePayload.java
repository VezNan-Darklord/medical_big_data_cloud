package csulzc.medical_big_data_cloud.common.result;

public record FilePayload(String fileName, String contentType, byte[] content) {
}
