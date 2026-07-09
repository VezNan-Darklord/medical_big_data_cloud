package csulzc.medical_big_data_cloud.module.repository.specification;

import csulzc.medical_big_data_cloud.module.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> search(String keyword, String roleCode, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 关键词：匹配 username / realName / mobile
            if (StringUtils.hasText(keyword)) {
                Predicate usernameLike = cb.like(root.get("username"), "%" + keyword + "%");
                Predicate realNameLike = cb.like(root.get("realName"), "%" + keyword + "%");
                Predicate mobileLike = cb.like(root.get("mobile"), "%" + keyword + "%");
                predicates.add(cb.or(usernameLike, realNameLike, mobileLike));
            }

            if (StringUtils.hasText(roleCode)) {
                predicates.add(cb.equal(root.get("roleCode"), roleCode));
            }

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
