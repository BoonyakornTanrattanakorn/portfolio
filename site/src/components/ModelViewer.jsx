import { useEffect, useState, useRef } from 'react';
import { withBase } from '../utils/paths.js';

let modelViewerPromise = null;

export async function initModelViewer(base = '/') {
  if (typeof window === 'undefined') return;
  if (!modelViewerPromise) {
    modelViewerPromise = (async () => {
      const decoderUrl = withBase('assets/vendor/meshopt_decoder.js', base);

      // Pre-configure global ModelViewerElement before module loads and element constructor runs
      self.ModelViewerElement = self.ModelViewerElement || {};
      self.ModelViewerElement.meshoptDecoderLocation = decoderUrl;

      try {
        const { MeshoptDecoder } = await import('meshoptimizer/decoder');
        await MeshoptDecoder.ready;
        window.MeshoptDecoder = MeshoptDecoder;
        self.MeshoptDecoder = MeshoptDecoder;
      } catch (err) {
        // Fallback to script load from decoderUrl
      }

      await import('@google/model-viewer');

      if (typeof window !== 'undefined' && window.customElements) {
        const ModelViewerElement = window.customElements.get('model-viewer') || window.ModelViewerElement;
        if (ModelViewerElement) {
          ModelViewerElement.meshoptDecoderLocation = decoderUrl;
        }
      }
    })();
  }
  return modelViewerPromise;
}

export function isWebGLAvailable() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl') ||
          canvas.getContext('webgl2'))
    );
  } catch (e) {
    return false;
  }
}

export function isReducedMotionPreferred() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function ModelViewer({
  src,
  alt,
  cameraControls = true,
  autoRotate = true,
  cameraOrbit,
  minCameraOrbit,
  maxCameraOrbit,
  shadowIntensity = 1,
  style = {},
  base = '/',
}) {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [shouldAutoRotate, setShouldAutoRotate] = useState(autoRotate);
  const [isViewerReady, setIsViewerReady] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => {
    // 1. Check WebGL support
    if (!isWebGLAvailable()) {
      setWebGLSupported(false);
      return;
    }

    // 2. Check reduced-motion preference
    if (isReducedMotionPreferred()) {
      setShouldAutoRotate(false);
    }

    // 3. Load model-viewer on-demand
    initModelViewer(base).then(() => {
      setIsViewerReady(true);
    });

    // 4. Attach error listener to model-viewer element
    const el = viewerRef.current;
    if (el) {
      const handleError = (e) => {
        console.warn('model-viewer failed to load asset:', src, e);
        setLoadError(true);
      };
      el.addEventListener('error', handleError);
      return () => {
        el.removeEventListener('error', handleError);
      };
    }
  }, [src, base]);

  const defaultStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '10px',
    background: 'var(--border)',
    margin: '16px 0 24px',
    display: 'block',
    ...style,
  };

  if (!webGLSupported) {
    return (
      <div className="model-fallback" role="region" aria-label={alt} style={defaultStyle}>
        <p>3D interactive viewer requires WebGL, which is disabled or unsupported in this browser.</p>
        <p>
          <a href={src} download className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            Download 3D Model (.glb)
          </a>
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="model-fallback model-error" role="alert" aria-label={alt} style={defaultStyle}>
        <p className="error-msg">Failed to load 3D model asset.</p>
        <p>
          <a href={src} download className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            Download 3D Model (.glb)
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="model-viewer-wrapper" style={{ position: 'relative', width: '100%' }}>
      <model-viewer
        ref={viewerRef}
        src={src}
        alt={alt}
        camera-controls={cameraControls ? '' : undefined}
        auto-rotate={shouldAutoRotate ? '' : undefined}
        camera-orbit={cameraOrbit}
        min-camera-orbit={minCameraOrbit}
        max-camera-orbit={maxCameraOrbit}
        shadow-intensity={shadowIntensity}
        style={defaultStyle}
      >
        <div slot="poster" className="model-poster-loading">
          <span className="loading-text" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            {isViewerReady ? 'Loading 3D model…' : 'Preparing 3D viewer…'}
          </span>
        </div>
      </model-viewer>
    </div>
  );
}
