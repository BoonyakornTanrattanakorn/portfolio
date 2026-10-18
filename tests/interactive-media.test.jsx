import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import ModelViewer, { isWebGLAvailable, isReducedMotionPreferred } from '../site/src/components/ModelViewer.jsx';
import VideoEmbed from '../site/src/components/VideoEmbed.jsx';
import CursrIvBody from '../site/content/projects/cursr-iv/Body.jsx';
import AutomatedMeasuringEquipmentBody from '../site/content/projects/automated-measuring-equipment/Body.jsx';
import EmatchIgnitionModuleBody from '../site/content/projects/ematch-ignition-module/Body.jsx';
import FpgaVideoPlayerBody from '../site/content/projects/fpga-video-player/Body.jsx';
import SphSimulatorBody from '../site/content/projects/sph-simulator/Body.jsx';

describe('Interactive Media Components', () => {
  describe('ModelViewer Component', () => {
    it('renders model-viewer custom element with attributes and loading poster', () => {
      const html = renderToString(
        <ModelViewer
          src="/portfolio/projects/cursr-iv/FC.glb"
          alt="Flight computer 3D PCB"
          cameraControls={true}
          autoRotate={true}
          cameraOrbit="0deg 75deg 105%"
          minCameraOrbit="auto auto 10%"
          maxCameraOrbit="auto auto 300%"
          shadowIntensity={1}
          base="/portfolio/"
        />
      );

      expect(html).toContain('src="/portfolio/projects/cursr-iv/FC.glb"');
      expect(html).toContain('alt="Flight computer 3D PCB"');
      expect(html).toContain('camera-controls=""');
      expect(html).toContain('auto-rotate=""');
      expect(html).toContain('camera-orbit="0deg 75deg 105%"');
      expect(html).toContain('min-camera-orbit="auto auto 10%"');
      expect(html).toContain('max-camera-orbit="auto auto 300%"');
      expect(html).toContain('shadow-intensity="1"');
      expect(html).toContain('slot="poster"');
      expect(html).toContain('Preparing 3D viewer…');
    });

    it('detects WebGL availability and handles reduced motion gracefully in Node environment', () => {
      // In Node environment, window is undefined
      expect(isWebGLAvailable()).toBe(true);
      expect(isReducedMotionPreferred()).toBe(false);
    });
  });

  describe('VideoEmbed Component', () => {
    it('renders responsive iframe with title, allowFullScreen, demo-note, and watch link', () => {
      const html = renderToString(
        <VideoEmbed
          src="https://www.youtube.com/embed/p0MyfT0LiCs"
          title="FPGA Video Demo"
          explanatoryText="320x240 real-time playback."
          watchUrl="https://www.youtube.com/watch?v=p0MyfT0LiCs"
        />
      );

      expect(html).toContain('class="video-wrapper"');
      expect(html).toContain('src="https://www.youtube.com/embed/p0MyfT0LiCs"');
      expect(html).toContain('title="FPGA Video Demo"');
      expect(html).toContain('allowFullScreen=""');
      expect(html).toContain('class="demo-note"');
      expect(html).toContain('320x240 real-time playback.');
      expect(html).toContain('href="https://www.youtube.com/watch?v=p0MyfT0LiCs"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noopener noreferrer"');
    });
  });

  describe('Integration with Project Case Studies', () => {
    it('cursr-iv uses ModelViewer with FC.glb', () => {
      const html = renderToString(<CursrIvBody base="/portfolio/" />);
      expect(html).toContain('src="/portfolio/projects/cursr-iv/FC.glb"');
      expect(html).toContain('alt="CURSR-IV flight computer PCB"');
    });

    it('automated-measuring-equipment uses ModelViewer with ame.glb', () => {
      const html = renderToString(<AutomatedMeasuringEquipmentBody base="/portfolio/" />);
      expect(html).toContain('src="/portfolio/projects/automated-measuring-equipment/ame.glb"');
      expect(html).toContain('alt="AMIv2 instrumentation PCB"');
    });

    it('ematch-ignition-module uses ModelViewer with ignition_module.glb', () => {
      const html = renderToString(<EmatchIgnitionModuleBody base="/portfolio/" />);
      expect(html).toContain('src="/portfolio/projects/ematch-ignition-module/ignition_module.glb"');
      expect(html).toContain('alt="3D interactive model of the XSRT E-Match Ignition Module PCB"');
    });

    it('fpga-video-player uses VideoEmbed', () => {
      const html = renderToString(<FpgaVideoPlayerBody />);
      expect(html).toContain('src="https://www.youtube.com/embed/p0MyfT0LiCs"');
      expect(html).toContain('title="FPGA Video Demo"');
      expect(html).toContain('href="https://www.youtube.com/watch?v=p0MyfT0LiCs"');
    });

    it('ordinary non-model projects like sph-simulator do not render model-viewer', () => {
      const html = renderToString(<SphSimulatorBody />);
      expect(html).not.toContain('<model-viewer');
      expect(html).not.toContain('.glb');
    });
  });
});
