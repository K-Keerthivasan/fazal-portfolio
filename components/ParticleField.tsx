"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  r: number;
  g: number;
  b: number;
  seed: number;
};

// Emerald / teal / mint palette so the field has subtle colour variety.
const PALETTE: [number, number, number][] = [
  [0.13, 0.92, 0.46],
  [0.1, 0.85, 0.68],
  [0.42, 1.0, 0.6],
  [0.06, 0.78, 0.5],
];

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasElement = canvas;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const gl = canvasElement.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;
    const webgl = gl;

    const vertexShader = compileShader(
      webgl,
      webgl.VERTEX_SHADER,
      `
        attribute vec2 a_position;
        attribute float a_size;
        attribute vec3 a_color;
        attribute float a_seed;
        uniform vec2 u_resolution;
        uniform float u_time;
        varying float v_alpha;
        varying vec3 v_color;

        void main() {
          vec2 zeroToOne = a_position / u_resolution;
          vec2 clipSpace = zeroToOne * 2.0 - 1.0;
          gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
          // Twinkle: gentle per-particle pulse (kept bright enough to stay visible).
          float tw = 0.78 + 0.22 * sin(u_time * 1.8 + a_seed * 6.2831);
          gl_PointSize = a_size * (1.1 + 0.3 * tw);
          v_alpha = clamp(a_size / 3.4, 0.45, 1.0) * tw;
          v_color = a_color;
        }
      `,
    );

    const fragmentShader = compileShader(
      webgl,
      webgl.FRAGMENT_SHADER,
      `
        precision mediump float;
        varying float v_alpha;
        varying vec3 v_color;

        void main() {
          vec2 p = gl_PointCoord - vec2(0.5);
          float d = length(p);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(v_color, glow * v_alpha);
        }
      `,
    );

    const program = createProgram(webgl, vertexShader, fragmentShader);
    const positionLocation = webgl.getAttribLocation(program, "a_position");
    const sizeLocation = webgl.getAttribLocation(program, "a_size");
    const colorLocation = webgl.getAttribLocation(program, "a_color");
    const seedLocation = webgl.getAttribLocation(program, "a_seed");
    const resolutionLocation = webgl.getUniformLocation(program, "u_resolution");
    const timeLocation = webgl.getUniformLocation(program, "u_time");

    const positionBuffer = webgl.createBuffer();
    const sizeBuffer = webgl.createBuffer();
    const colorBuffer = webgl.createBuffer();
    const seedBuffer = webgl.createBuffer();
    if (!positionBuffer || !sizeBuffer || !colorBuffer || !seedBuffer) return;

    // Scale particle density to the device for smooth performance everywhere.
    function targetCount() {
      const area = window.innerWidth * window.innerHeight;
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const base = isCoarse ? 0.9 : 1.5;
      return Math.round(Math.min(1500, Math.max(420, (area / 1100) * base)));
    }

    let particleCount = targetCount();
    let particles: Particle[] = [];
    let positions = new Float32Array(particleCount * 2);
    let sizes = new Float32Array(particleCount);
    let colors = new Float32Array(particleCount * 3);
    let seeds = new Float32Array(particleCount);

    const pointer = { x: -9999, y: -9999, force: 0, lastMove: -9999, inside: false };
    const ripples: { x: number; y: number; start: number }[] = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let last = performance.now();
    const startTime = performance.now();

    function buildParticles() {
      particleCount = targetCount();
      particles = [];
      positions = new Float32Array(particleCount * 2);
      sizes = new Float32Array(particleCount);
      colors = new Float32Array(particleCount * 3);
      seeds = new Float32Array(particleCount);

      const gridCols = Math.ceil(Math.sqrt(particleCount * 1.9));
      const gridRows = Math.ceil(particleCount / gridCols);
      const padX = width * 0.06;
      const padY = height * 0.1;
      const cellW = (width - padX * 2) / gridCols;
      const cellH = (height - padY * 2) / gridRows;

      for (let i = 0; i < particleCount; i += 1) {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const band = Math.sin(col * 0.36) * height * 0.07 + Math.cos(row * 0.42) * height * 0.035;
        const diagonal = (col / gridCols) * height * 0.18;
        const ox = padX + col * cellW + Math.random() * cellW * 0.85;
        const oy = padY + row * cellH + band - diagonal * 0.25 + Math.random() * cellH * 0.85;
        const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];

        particles.push({
          x: ox + (Math.random() - 0.5) * 90,
          y: oy + (Math.random() - 0.5) * 90,
          ox,
          oy,
          vx: 0,
          vy: 0,
          size: 1.1 + Math.random() * 2.6,
          phase: Math.random() * Math.PI * 2,
          r,
          g,
          b,
          seed: Math.random(),
        });

        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
        seeds[i] = particles[i].seed;
      }

      webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, colors, webgl.STATIC_DRAW);
      webgl.bindBuffer(webgl.ARRAY_BUFFER, seedBuffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, seeds, webgl.STATIC_DRAW);
    }

    function resize() {
      const rect = canvasElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvasElement.width = Math.floor(width * dpr);
      canvasElement.height = Math.floor(height * dpr);
      webgl.viewport(0, 0, canvasElement.width, canvasElement.height);
      buildParticles();
    }

    function setPointerFromEvent(clientX: number, clientY: number, force: number) {
      const rect = canvasElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < -40 || y < -40 || x > width + 40 || y > height + 40) {
        pointer.inside = false;
        return false;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.force = Math.max(pointer.force, force);
      pointer.lastMove = performance.now();
      pointer.inside = true;
      return true;
    }

    function onPointerMove(event: PointerEvent) {
      setPointerFromEvent(event.clientX, event.clientY, 0.85);
    }

    function onPointerDown(event: PointerEvent) {
      const rect = canvasElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > width || y > height) return;
      setPointerFromEvent(event.clientX, event.clientY, 2.4);
      ripples.push({ x, y, start: performance.now() });
      if (ripples.length > 4) ripples.shift();
    }

    function render(now: number) {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const time = (now - startTime) / 1000;
      pointer.force *= 0.93;

      // Ambient attractor: when idle (or no hover device), drift a soft focus
      // point so the field always feels alive and interactive on mobile too.
      const idle = now - pointer.lastMove > 2000;
      let px = pointer.x;
      let py = pointer.y;
      let pforce = pointer.force;
      if (idle) {
        px = width * (0.5 + 0.33 * Math.sin(now * 0.00038));
        py = height * (0.5 + 0.28 * Math.cos(now * 0.00052));
        pforce = 0.55;
      }

      const radius = 150 + pforce * 55;
      const radiusSq = radius * radius;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const driftX = Math.sin(now * 0.0007 + p.phase) * 8;
        const driftY = Math.cos(now * 0.0006 + p.phase) * 6;
        const homeX = p.ox + driftX;
        const homeY = p.oy + driftY;

        p.vx += (homeX - p.x) * 0.012 * dt;
        p.vy += (homeY - p.y) * 0.012 * dt;

        const dx = p.x - px;
        const dy = p.y - py;
        const distSq = dx * dx + dy * dy;
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq) || 1;
          const push = (1 - dist / radius) * (pforce + 0.8) * 2.7;
          p.vx += (dx / dist) * push * dt;
          p.vy += (dy / dist) * push * dt;
        }

        // Expanding tap/click shockwaves.
        for (let r = 0; r < ripples.length; r += 1) {
          const rip = ripples[r];
          const age = (now - rip.start) / 1000;
          if (age > 1) continue;
          const ringR = age * 760;
          const rdx = p.x - rip.x;
          const rdy = p.y - rip.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy) || 1;
          const band = Math.abs(rdist - ringR);
          if (band < 70) {
            const strength = (1 - band / 70) * (1 - age) * 6.5;
            p.vx += (rdx / rdist) * strength * dt;
            p.vy += (rdy / rdist) * strength * dt;
          }
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const scaleX = canvasElement.width / width;
        const scaleY = canvasElement.height / height;
        positions[i * 2] = p.x * scaleX;
        positions[i * 2 + 1] = p.y * scaleY;
        sizes[i] = p.size * scaleX * (1 + pforce * 0.06);
      }

      // Drop expired ripples.
      while (ripples.length && now - ripples[0].start > 1000) ripples.shift();

      webgl.clearColor(0, 0, 0, 0);
      webgl.clear(webgl.COLOR_BUFFER_BIT);
      webgl.useProgram(program);

      webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, positions, webgl.DYNAMIC_DRAW);
      webgl.enableVertexAttribArray(positionLocation);
      webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);

      webgl.bindBuffer(webgl.ARRAY_BUFFER, sizeBuffer);
      webgl.bufferData(webgl.ARRAY_BUFFER, sizes, webgl.DYNAMIC_DRAW);
      webgl.enableVertexAttribArray(sizeLocation);
      webgl.vertexAttribPointer(sizeLocation, 1, webgl.FLOAT, false, 0, 0);

      webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
      webgl.enableVertexAttribArray(colorLocation);
      webgl.vertexAttribPointer(colorLocation, 3, webgl.FLOAT, false, 0, 0);

      webgl.bindBuffer(webgl.ARRAY_BUFFER, seedBuffer);
      webgl.enableVertexAttribArray(seedLocation);
      webgl.vertexAttribPointer(seedLocation, 1, webgl.FLOAT, false, 0, 0);

      webgl.uniform2f(resolutionLocation, canvasElement.width, canvasElement.height);
      webgl.uniform1f(timeLocation, time);
      webgl.enable(webgl.BLEND);
      webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE);
      webgl.drawArrays(webgl.POINTS, 0, particles.length);

      animationFrame = requestAnimationFrame(render);
    }

    resize();
    // Listen on the window so the whole hero is interactive, even where the
    // text sits on top of the canvas.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
      webgl.deleteBuffer(positionBuffer);
      webgl.deleteBuffer(sizeBuffer);
      webgl.deleteBuffer(colorBuffer);
      webgl.deleteBuffer(seedBuffer);
      webgl.deleteProgram(program);
      webgl.deleteShader(vertexShader);
      webgl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-90 mix-blend-screen"
      aria-hidden="true"
    />
  );
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "WebGL shader compilation failed.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program.");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "WebGL program link failed.";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}
