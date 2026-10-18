import { withBase } from '../../../src/utils/paths.js';
import ProjectFigure from '../../../src/components/ProjectFigure.jsx';

export default function WeatherStationBody({ base = '/' }) {
  const rainGaugeImg = withBase('projects/weather-station/rain-gauge.jpg', base);

  return (
    <>
      <h2>Overview</h2>
      <p>
        An end-to-end embedded IoT system collecting environmental data (temperature, humidity, pressure, light intensity index)
        and visualizing it on a live web dashboard.
      </p>

      <h2>System Architecture</h2>
      <div className="arch-row">
        <ProjectFigure
          src={rainGaugeImg}
          alt="Rain gauge photo"
          caption="Rain gauge photo"
        />

        <div className="arch-box">
          <strong>STM32</strong>Sensor acquisition over analog inputs and digital pins, forwards data to ESP32 via UART
        </div>
        <div className="arch-box">
          <strong>ESP32-S3</strong>Wi-Fi bridge; publishes JSON payloads to MQTT broker (EMQX)
        </div>
      </div>
    </>
  );
}
