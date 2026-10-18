import ProjectLayout from '../components/ProjectLayout.jsx';
import { withBase } from '../utils/paths.js';

import XsrtRocketTestBenchBody from '../../content/projects/xsrt-rocket-test-bench/Body.jsx';
import EmatchIgnitionModuleBody from '../../content/projects/ematch-ignition-module/Body.jsx';
import EngineeringInternshipBody from '../../content/projects/engineering-internship/Body.jsx';
import CursrIvBody from '../../content/projects/cursr-iv/Body.jsx';
import FpgaVideoPlayerBody from '../../content/projects/fpga-video-player/Body.jsx';
import WeatherStationBody from '../../content/projects/weather-station/Body.jsx';
import SphSimulatorBody from '../../content/projects/sph-simulator/Body.jsx';
import ThamroiBody from '../../content/projects/thamroi/Body.jsx';
import AutomatedMeasuringEquipmentBody from '../../content/projects/automated-measuring-equipment/Body.jsx';

export const PROJECT_BODIES = {
  'xsrt-rocket-test-bench': XsrtRocketTestBenchBody,
  'ematch-ignition-module': EmatchIgnitionModuleBody,
  'engineering-internship': EngineeringInternshipBody,
  'cursr-iv': CursrIvBody,
  'fpga-video-player': FpgaVideoPlayerBody,
  'weather-station': WeatherStationBody,
  'sph-simulator': SphSimulatorBody,
  'thamroi': ThamroiBody,
  'automated-measuring-equipment': AutomatedMeasuringEquipmentBody,
};

export default function ProjectDetailPage({
  slug,
  title,
  summary,
  date,
  organization,
  role,
  tags = [],
  thumbnail,
  base = '/',
}) {
  const BodyComponent = PROJECT_BODIES[slug];

  let resolvedThumbnail = thumbnail;
  if (
    thumbnail &&
    typeof thumbnail === 'string' &&
    thumbnail.trim() !== '' &&
    !thumbnail.startsWith('http://') &&
    !thumbnail.startsWith('https://') &&
    !thumbnail.startsWith('data:') &&
    !thumbnail.startsWith('/')
  ) {
    resolvedThumbnail = withBase(`projects/${slug}/${thumbnail.trim()}`, base);
  }

  return (
    <ProjectLayout
      title={title || slug}
      summary={summary}
      date={date}
      organization={organization}
      role={role}
      tags={tags}
      thumbnail={resolvedThumbnail}
      base={base}
    >
      {BodyComponent ? (
        <BodyComponent base={base} slug={slug} />
      ) : (
        <p>Project details for {slug}.</p>
      )}
    </ProjectLayout>
  );
}
