/**
 * DashboardStats Section
 * Displays key metrics: Total Athletes, Sports, Provinces, Medals
 */




interface DashboardStatsProps {
  totalAthletes: number;
  totalSports: number;
  totalProvinces: number;
  totalMedals: number;
  athleteChange?: number;
  sportsChange?: number;
  provincesChange?: number;
  medalsChange?: number;
}

export function DashboardStats({
  totalAthletes,
  totalSports,
  totalProvinces,
  totalMedals,
  athleteChange,
  sportsChange,
  provincesChange,
  medalsChange,
}: DashboardStatsProps) {
  return (
    <div className="kpi-grid w-full">
      <div className="kpi-col-3">
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Total Athletes</div>
            <div className="kpi-value">{totalAthletes.toLocaleString()}</div>
            {typeof athleteChange === 'number' && (
              <div className={`kpi-trend ${athleteChange > 0 ? 'kpi-up' : athleteChange < 0 ? 'kpi-down' : ''}`}>
                {athleteChange > 0 ? '+' : ''}{athleteChange}%
              </div>
            )}
          </div>
          <div className="kpi-icon"><span role="img" aria-label="athlete">🏃‍♂️</span></div>
        </div>
      </div>

      <div className="kpi-col-3">
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Total Sports</div>
            <div className="kpi-value">{totalSports.toLocaleString()}</div>
            {typeof sportsChange === 'number' && (
              <div className={`kpi-trend ${sportsChange > 0 ? 'kpi-up' : sportsChange < 0 ? 'kpi-down' : ''}`}>
                {sportsChange > 0 ? '+' : ''}{sportsChange}%
              </div>
            )}
          </div>
          <div className="kpi-icon"><span role="img" aria-label="sports">🏅</span></div>
        </div>
      </div>

      <div className="kpi-col-3">
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Total Provinces</div>
            <div className="kpi-value">{totalProvinces.toLocaleString()}</div>
            {typeof provincesChange === 'number' && (
              <div className={`kpi-trend ${provincesChange > 0 ? 'kpi-up' : provincesChange < 0 ? 'kpi-down' : ''}`}>
                {provincesChange > 0 ? '+' : ''}{provincesChange}%
              </div>
            )}
          </div>
          <div className="kpi-icon"><span role="img" aria-label="province">🏛️</span></div>
        </div>
      </div>

      <div className="kpi-col-3">
        <div className="kpi-card">
          <div className="kpi-content">
            <div className="kpi-label">Total Medals</div>
            <div className="kpi-value">{totalMedals.toLocaleString()}</div>
            {typeof medalsChange === 'number' && (
              <div className={`kpi-trend ${medalsChange > 0 ? 'kpi-up' : medalsChange < 0 ? 'kpi-down' : ''}`}>
                {medalsChange > 0 ? '+' : ''}{medalsChange}%
              </div>
            )}
          </div>
          <div className="kpi-icon"><span role="img" aria-label="medal">🥇</span></div>
        </div>
      </div>
    </div>
  );
}
