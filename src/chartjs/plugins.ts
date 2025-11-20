import type { Chart } from 'chart.js';

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
