import { useMemo } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { useListElderlyAccountsQuery } from '../../../api/hooks/elderlyAccountHooks'

interface ElderlyOption {
  value: string
  label: string
  username: string
  realName: string
  mobile?: string
}

interface ElderlyAccountSelectProps extends Omit<SelectProps<string>, 'options' | 'loading'> {
  setMobile?: (value: string) => void;
  setRealName?: (value: string) => void;
}

export function ElderlyAccountSelect({ onChange, setMobile, setRealName, ...rest }: ElderlyAccountSelectProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListElderlyAccountsQuery({ pageSize: 30 })

  const options: ElderlyOption[] = useMemo(
    () => (data?.pages ?? []).flatMap(page =>
      ((page.data as { list?: Array<Record<string, unknown>> })?.list ?? []).map(item => ({
        value: item.id as string,
        label: `${item.realName ?? item.username ?? '-'} (${(item.id as string)?.slice(0, 8)})`,
        username: (item.username as string) ?? '',
        realName: (item.realName as string) ?? '',
        mobile: (item.mobile as string) ?? '',
      }))
    ),
    [data],
  )

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }

  const handleFilter: SelectProps<string>['filterOption'] = (input, option) => {
    if (!option) return false
    const opt = options.find(o => o.value === option.value)
    if (!opt) return false
    const keyword = input.toLowerCase()
    return (
      opt.value.toLowerCase().includes(keyword) ||
      opt.username.toLowerCase().includes(keyword) ||
      opt.realName.toLowerCase().includes(keyword)
    )
  }

  const handleChange = (value: string) => {
    const opt = options.find(o => o.value === value)
    if (opt && setRealName) {
      setRealName(opt.realName)
    }
    if (opt && setMobile) {
      setMobile(opt.mobile ?? '')
    }
    onChange?.(value)
  }

  return (
    <Select
      {...rest}
      showSearch
      placeholder="搜索老人（ID / 用户名 / 姓名）"
      loading={isLoading}
      options={options}
      filterOption={handleFilter}
      onPopupScroll={handlePopupScroll}
      notFoundContent={isLoading ? '加载中...' : '无匹配结果'}
      onChange={handleChange}
    />
  )
}
