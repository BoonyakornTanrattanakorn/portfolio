import { withBase } from '../../../src/utils/paths.js';
import ProjectFigure from '../../../src/components/ProjectFigure.jsx';

export default function SphSimulatorBody({ base = '/' }) {
  const gifSrc = withBase('projects/sph-simulator/sph.gif', base);

  return (
    <>
      <ProjectFigure
        src={gifSrc}
        alt="Smoothed Particle Hydrodynamics animated fluid simulation demo"
        caption="Real-time 2D fluid simulation running on the GPU via GLSL compute shaders."
      />

      <h2>Overview</h2>
      <p>
        A real-time 2D fluid simulation built inside Godot 4 using the Smoothed Particle Hydrodynamics (SPH) method.
        All physics passes run on the GPU via GLSL compute shaders, enabling thousands of particles at interactive frame rates.
      </p>

      <h2>Physics</h2>
      <p>
        Each particle carries density ρ, pressure P, and velocity <strong>v</strong>. The simulation runs three compute passes per frame:
      </p>
      <ul>
        <li>
          <strong>Density pass</strong> — accumulates SPH kernel contributions from neighbours within radius <em>h</em>
        </li>
        <li>
          <strong>Force pass</strong> — computes pressure gradient and viscosity forces
        </li>
        <li>
          <strong>Integration pass</strong> — symplectic Euler, boundary collision response
        </li>
      </ul>

      <h2>GPU Architecture</h2>
      <ul>
        <li>Particle data stored in paired SSBOs (ping-pong), avoiding read-write hazards</li>
        <li>Spatial hashing grid accelerates neighbour search from O(n²) to near O(n)</li>
        <li>Rendering: instanced quads with per-particle colour mapped to speed magnitude</li>
      </ul>

      <h2>Github Repository</h2>
      <p>
        The source code for this project is available on{' '}
        <a
          href="https://github.com/BoonyakornTanrattanakorn/SmoothedParticleHydrodynamics"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </>
  );
}
