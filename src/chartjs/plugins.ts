import type { Chart, TooltipItem } from 'chart.js';

export const crosshairPlugin = {
  id: 'crosshair',
  afterDraw: (chart: Chart<'line'>) => {
    if (chart.tooltip?.getActiveElements().length) {
      const ctx = chart.ctx;
      const activePoint = chart.tooltip.getActiveElements()[0];
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.stroke();
      ctx.restore();
    }
  },
};

export const legendConfig = {
  position: 'bottom' as const,
  labels: {
    color: '#A0AEC0',
    usePointStyle: true,
    pointStyle: 'rectRounded' as const,
    boxWidth: 10,
    boxHeight: 10,
  },
};

export const interactionConfig = {
  mode: 'index' as const,
  intersect: false,
};

export const lineTooltipConfig = {
  mode: 'index' as const,
  intersect: false,
  backgroundColor: 'rgba(0,0,0,0.8)',
  displayColors: true,
  usePointStyle: true,
  titleFont: {
    weight: 'bold' as const,
  },
  bodyFont: {
    size: 12,
  },
  callbacks: {
    title: (context: TooltipItem<'line'>[]) => {
      const date = new Date(context[0].parsed.x || '');
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    },
  },
};
