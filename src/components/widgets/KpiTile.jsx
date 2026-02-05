import { Tile } from '@carbon/react';
import { ArrowUp, ArrowDown } from '@carbon/icons-react';
import { formatCurrency, formatTrend } from '../../utils/formatCurrency';

function formatValue(data) {
  const { value, format, maxValue } = data;

  switch (format) {
    case 'percent':
      return `${value}%`;
    case 'score':
      return `${value} / ${maxValue || 100}`;
    case 'count':
      return String(value);
    case 'text':
      return value;
    case 'percentGrowth':
      return `+${value}% YoY`;
    default:
      return formatCurrency(value);
  }
}

function getTrendClass(status) {
  switch (status) {
    case 'positive':
      return 'kpi-tile__trend--positive';
    case 'warning':
      return 'kpi-tile__trend--warning';
    case 'critical':
      return 'kpi-tile__trend--negative';
    case 'neutral':
    default:
      return '';
  }
}

function getTrendColor(status) {
  switch (status) {
    case 'positive':
      return '#24a148';
    case 'warning':
      return '#f1c21b';
    case 'critical':
      return '#da1e28';
    case 'neutral':
    default:
      return '#0f62fe';
  }
}

export default function KpiTile({ data, onClick }) {
  const { label, trend, status, secondaryLabel } = data;
  const trendText = formatTrend(trend.direction, trend.percentage);
  const trendColor = getTrendColor(status);
  const trendClass = getTrendClass(status);

  const TrendIcon = trend.direction === 'up' ? ArrowUp : trend.direction === 'down' ? ArrowDown : null;

  return (
    <Tile className="kpi-tile" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="kpi-tile__label" style={{ fontSize: '0.875rem', color: '#525252' }}>
        {label}
      </div>

      <div className="kpi-tile__value">
        {formatValue(data)}
      </div>

      {secondaryLabel && (
        <div className="kpi-tile__secondary" style={{ fontSize: '0.875rem', color: '#6f6f6f', marginBottom: '0.25rem' }}>
          {secondaryLabel}
        </div>
      )}

      <div className={`kpi-tile__trend ${trendClass}`} style={{ color: trendColor }}>
        {TrendIcon && <TrendIcon size={16} />}
        <span>{trendText}</span>
        {trend.period && (
          <span style={{ color: '#6f6f6f', marginLeft: '0.25rem' }}>{trend.period}</span>
        )}
      </div>
    </Tile>
  );
}
