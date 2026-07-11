import { useRef, useLayoutEffect } from "react";
import * as echarts from 'echarts'

export default function EChart({ option, height = 280 }: { option: echarts.EChartsCoreOption; height?: number }) {
    const ref = useRef<HTMLDivElement | null>(null)

    useLayoutEffect(() => {
        if (!ref.current) return

        const chart = echarts.init(ref.current)
        chart.setOption(option)

        const resizeObserver = new ResizeObserver(() => chart.resize())
        resizeObserver.observe(ref.current)

        return () => {
            resizeObserver.disconnect()
            chart.dispose()
        }
    }, [option])

    return <div ref={ref} style={{ height }} className="w-full" />
}