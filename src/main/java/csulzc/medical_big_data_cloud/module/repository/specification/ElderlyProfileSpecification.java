package csulzc.medical_big_data_cloud.module.repository.specification;

import csulzc.medical_big_data_cloud.module.entity.ElderlyProfile;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ElderlyProfileSpecification {

    public static Specification<ElderlyProfile> search(String keyword, String gender,
                                                       String careLevel, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                Predicate nameLike = cb.like(root.get("name"), "%" + keyword + "%");
                Predicate phoneLike = cb.like(root.get("phone"), "%" + keyword + "%");
                Predicate addressLike = cb.like(root.get("address"), "%" + keyword + "%");
                predicates.add(cb.or(nameLike, phoneLike, addressLike));
            }

            if (StringUtils.hasText(gender)) {
                predicates.add(cb.equal(root.get("gender"), gender));
            }
            if (StringUtils.hasText(careLevel)) {
                predicates.add(cb.equal(root.get("careLevel"), careLevel));
            }
            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
