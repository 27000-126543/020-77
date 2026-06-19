import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { cn } from '@/lib/utils';
import { PLATFORMS } from '@/data/dictionaries';

type ChartType = 'line' | 'pie' | 'bar';

interface LineChartData {
  hours?: string[];
  values?: number[];
}

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartData {
  name: string;
  value: number;
}

interface TrendChartProps {
  type: ChartType;
  lineData?: LineChartData;
  pieData?: PieChartData[];
  barData?: BarChartData[];
  height?: number | string;
  className?: string;
}

const defaultLineData: Required<LineChartData> = {
  hours: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
  values: [8, 5, 3, 2, 2, 4, 8, 15, 22, 28, 32, 35, 38, 42, 45, 48, 52, 55, 50, 45, 38, 28, 18, 12],
};

const defaultPieData: PieChartData[] = PLATFORMS.map((p, idx) => ({
  name: p.label,
  value: [42, 28, 18, 12][idx] || 10,
  color: p.color,
}));

const defaultBarData: BarChartData[] = [
  { name: '东城区', value: 128 },
  { name: '西城区', value: 96 },
  { name: '朝阳区', value: 185 },
  { name: '海淀区', value: 152 },
  { name: '丰台区', value: 78 },
  { name: '石景山区', value: 52 },
  { name: '通州区', value: 68 },
];

function getLineOption(data: Required<LineChartData>): EChartsOption {
  return {
    backgroundColor: 'transparent',
    grid: {
      left: 40,
      right: 16,
      top: 24,
      bottom: 32,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#475569',
      borderWidth: 1,
      textStyle: {
        color: '#E2E8F0',
        fontSize: 12,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#3B82F6',
          opacity: 0.5,
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.hours,
      axisLine: {
        lineStyle: { color: '#334155' },
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748B',
        fontSize: 10,
        interval: 2,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748B',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
      },
      splitLine: {
        lineStyle: {
          color: '#334155',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'line',
        data: data.values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: '#3B82F6',
        },
        itemStyle: {
          color: '#3B82F6',
          borderColor: '#1E293B',
          borderWidth: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ]),
        },
        emphasis: {
          focus: 'series',
          scale: true,
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(59, 130, 246, 0.5)',
          },
        },
      },
    ],
  };
}

function getPieOption(data: PieChartData[]): EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#475569',
      borderWidth: 1,
      textStyle: {
        color: '#E2E8F0',
        fontSize: 12,
      },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 16,
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
      textStyle: {
        color: '#94A3B8',
        fontSize: 12,
      },
      formatter: (name: string) => {
        const item = data.find((d) => d.name === name);
        if (item) {
          return `${name}  ${item.value}`;
        }
        return name;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['32%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#1E293B',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: data.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color,
          },
        })),
      },
    ],
  };
}

function getBarOption(data: BarChartData[]): EChartsOption {
  const maxValue = Math.max(...data.map((d) => d.value));
  return {
    backgroundColor: 'transparent',
    grid: {
      left: 60,
      right: 24,
      top: 20,
      bottom: 24,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderColor: '#475569',
      borderWidth: 1,
      textStyle: {
        color: '#E2E8F0',
        fontSize: 12,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(59, 130, 246, 0.08)',
        },
      },
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#64748B',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, Consolas, monospace',
      },
      splitLine: {
        lineStyle: {
          color: '#334155',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: data.map((d) => d.name).reverse(),
      axisLine: {
        lineStyle: { color: '#334155' },
      },
      axisTick: { show: false },
      axisLabel: {
        color: '#94A3B8',
        fontSize: 11,
      },
      splitLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: [...data].reverse().map((item) => ({
          value: item.value,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color:
                  item.value / maxValue > 0.7
                    ? 'rgba(239, 68, 68, 0.8)'
                    : item.value / maxValue > 0.4
                      ? 'rgba(251, 191, 36, 0.8)'
                      : 'rgba(59, 130, 246, 0.8)',
              },
              {
                offset: 1,
                color:
                  item.value / maxValue > 0.7
                    ? 'rgba(239, 68, 68, 0.3)'
                    : item.value / maxValue > 0.4
                      ? 'rgba(251, 191, 36, 0.3)'
                      : 'rgba(59, 130, 246, 0.3)',
              },
            ]),
          },
        })),
        barWidth: 14,
        label: {
          show: true,
          position: 'right',
          color: '#94A3B8',
          fontSize: 11,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(59, 130, 246, 0.3)',
          },
        },
      },
    ],
  };
}

export default function TrendChart({
  type,
  lineData,
  pieData,
  barData,
  height = 320,
  className,
}: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    instanceRef.current = chart;

    let option: EChartsOption;
    switch (type) {
      case 'line':
        option = getLineOption({
          hours: lineData?.hours || defaultLineData.hours,
          values: lineData?.values || defaultLineData.values,
        });
        break;
      case 'pie':
        option = getPieOption(pieData?.length ? pieData : defaultPieData);
        break;
      case 'bar':
        option = getBarOption(barData?.length ? barData : defaultBarData);
        break;
    }

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, [type, lineData, pieData, barData]);

  return (
    <div
      ref={chartRef}
      className={cn('w-full', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  );
}
