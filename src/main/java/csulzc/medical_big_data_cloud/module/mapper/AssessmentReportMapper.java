package csulzc.medical_big_data_cloud.module.mapper;

import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.entity.AssessmentReport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AssessmentReportMapper {

    AssessmentReportResponse toResponse(AssessmentReport entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "assessorId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "reviewStatus", ignore = true)
    @Mapping(target = "reviewerId", ignore = true)
    @Mapping(target = "reviewedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    AssessmentReport toEntity(AssessmentReportCreateRequest request);
}
