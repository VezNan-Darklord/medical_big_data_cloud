package csulzc.medical_big_data_cloud.common.result;

import lombok.Data;

import java.util.List;

@Data
public class PageResult<T> {
    private List<T> list;
    private int pageNo;
    private int pageSize;
    private long total;

    public PageResult() {}

    public PageResult(List<T> list, int pageNo, int pageSize, long total) {
        this.list = list;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.total = total;
    }
}
