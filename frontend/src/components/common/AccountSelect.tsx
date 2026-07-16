import { useMemo, useState, useCallback, useRef } from 'react'
import { Select } from 'antd'
import type { SelectProps } from 'antd'
import { useListElderlyAccountsQuery } from '../../../api/hooks/elderlyAccountHooks'
import { useListDoctorAccountsQuery } from '../../../api/hooks/doctorAccountHooks'

interface ElderlyOption {
  value: string
  label: string
  username: string
  realName: string
  mobile?: string
}

interface ElderlyAccountSelectProps extends Omit<SelectProps<string>, 'options' | 'loading'> {
  setMobile?: (value: string) => void
  setRealName?: (value: string) => void
  roleCode?: 'doctor'
}

export function AccountSelect({ onChange, setMobile, setRealName, roleCode, ...rest }: ElderlyAccountSelectProps) {
  const isDoctor = roleCode === 'doctor'
  const [keyword, setKeyword] = useState<string | undefined>(undefined)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    data: elderlyData,
    fetchNextPage: fetchNextElderly,
    hasNextPage: hasNextElderly,
    isFetchingNextPage: isFetchingNextElderly,
    isLoading: isLoadingElderly,
  } = useListElderlyAccountsQuery({ pageSize: 30, keyword })

  const {
    data: doctorData,
    fetchNextPage: fetchNextDoctor,
    hasNextPage: hasNextDoctor,
    isFetchingNextPage: isFetchingNextDoctor,
    isLoading: isLoadingDoctor,
  } = useListDoctorAccountsQuery({ pageSize: 30 })

  const data = isDoctor ? doctorData : elderlyData;
  const fetchNextPage = isDoctor ? fetchNextDoctor : fetchNextElderly;
  const hasNextPage = isDoctor ? hasNextDoctor : hasNextElderly;
  const isFetchingNextPage = isDoctor ? isFetchingNextDoctor : isFetchingNextElderly;
  const isLoading = isDoctor ? isLoadingDoctor : isLoadingElderly;

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

  const handleSearch = useCallback((value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setKeyword(value || undefined)
    }, 300)
  }, [])

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
    const kw = input.toLowerCase()
    return (
      opt.value.toLowerCase().includes(kw) ||
      opt.username.toLowerCase().includes(kw) ||
      opt.realName.toLowerCase().includes(kw)
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
      placeholder={isDoctor ? '搜索医生（ID / 用户名 / 姓名）' : '搜索老人（ID / 用户名 / 姓名）'}
      loading={isLoading}
      options={options}
      filterOption={handleFilter}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      notFoundContent={isLoading ? '加载中...' : '无匹配结果'}
      onChange={handleChange}
      aria-autocomplete="none"
    />
  )
}
