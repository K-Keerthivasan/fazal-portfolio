"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 1300;

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
};

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
        uniform vec2 u_resolution;
        varying float v_alpha;

        void main() {
          vec2 zeroToOne = a_position / u_resolution;
          vec2 clipSpace = zeroToOne * 2.0 - 1.0;
          gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
          gl_PointSize = a_size;
          v_alpha = clamp(a_size / 4.0, 0.32, 0.9);
        }
      `,
    );

    const fragmentShader = compileShader(
      webgl,
      webgl.FRAGMENT_SHADER,
      `
        precision mediump float;
        varying float v_alpha;

        void main() {
          vec2 p = gl_PointCoord - vec2(0.5);
          float d = length(p);
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(0.16, 1.0, 0.48, glow * v_alpha);
        }
      `,
    );

    const program = createProgram(webgl, vertexShader, fragmentShader);
    const positionLocation = webgl.getAttribLocation(program, "a_position");
    const sizeLocation = webgl.getAttribLocation(program, "a_size");
    const resolutionLocation = webgl.getUniformLocation(program, "u_resolution");
    const positionBuffer = webgl.createBuffer();
    const sizeBuffer = webgl.createBuffer();

    if (!positionBuffer || !sizeBuffer) return;

    const particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, force: 0 };
    const positions = new Float32Array(PARTICLE_COUNT * 2);
    const sizes = new Float32Array(PARTICLE_COUNT);
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let last = performance.now();

    function buildParticles() {
      particles.length = 0;
      const gridCols = Math.ceil(Math.sqrt(PARTICLE_COUNT * 1.9));
      const gridRows = Math.ceil(PARTICLE_COUNT / gridCols);
      const padX = width * 0.08;
      const padY = height * 0.12;
      const cellW = (width - padX * 2) / gridCols;
      const cellH = (height - padY * 2) / gridRows;

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const band = Math.sin(col * 0.36) * height * 0.07 + Math.cos(row * 0.42) * height * 0.035;
        const diagonal = (col / gridCols) * height * 0.18;
        const ox = padX + col * cellW + Math.random() * cellW * 0.8;
        const oy = padY + row * cellH + band - diagonal * 0.25 + Math.random() * cellH * 0.8;

        particles.push({
          x: ox + (Math.random() - 0.5) * 80,
          y: oy + (Math.random() - 0.5) * 80,
          ox,
          oy,
          vx: 0,
          vy: 0,
          size: 1.2 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
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

    function disturb(x: number, y: number, force = 1) {
      pointer.x = x;
      pointer.y = y;
      pointer.force = Math.max(pointer.force, force);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvasElement.getBoundingClientRect();
      disturb(event.clientX - rect.left, event.clientY - rect.top, 0.85);
    }

    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.force = 0;
    }

    function onPointerDown(event: PointerEvent) {
      const rect = canvasElement.getBoundingClientRect();
      disturb(event.clientX - rect.left, event.clientY - rect.top, 2.5);
    }

    function render(now: number) {
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      pointer.force *= 0.94;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const driftX = Math.sin(now * 0.0007 + p.phase) * 7;
        const driftY = Math.cos(now * 0.0006 + p.phase) * 5;
        const homeX = p.ox + driftX;
        const homeY = p.oy + driftY;
        const toHomeX = homeX - p.x;
        const toHomeY = homeY - p.y;

        p.vx += toHomeX * 0.012 * dt;
        p.vy += toHomeY * 0.012 * dt;

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        const radius = 145 + pointer.force * 45;

        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq) || 1;
          const push = (1 - dist / radius) * (pointer.force + 0.8) * 2.6;
          p.vx += (dx / dist) * push * dt;
          p.vy += (dy / dist) * push * dt;
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        positions[i * 2] = p.x * (canvasElement.width / width);
        positions[i * 2 + 1] = p.y * (canvasElement.height / height);
        sizes[i] = p.size * (canvasElement.width / width) * (1 + pointer.force * 0.05);
      }

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

      webgl.uniform2f(resolutionLocation, canvasElement.width, canvasElement.height);
      webgl.enable(webgl.BLEND);
      webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE);
      webgl.drawArrays(webgl.POINTS, 0, particles.length);

      animationFrame = requestAnimationFrame(render);
    }

    resize();
    canvasElement.addEventListener("pointermove", onPointerMove);
    canvasElement.addEventListener("pointerleave", onPointerLeave);
    canvasElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvasElement.removeEventListener("pointermove", onPointerMove);
      canvasElement.removeEventListener("pointerleave", onPointerLeave);
      canvasElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", resize);
      webgl.deleteBuffer(positionBuffer);
      webgl.deleteBuffer(sizeBuffer);
      webgl.deleteProgram(program);
      webgl.deleteShader(vertexShader);
      webgl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] h-full w-full opacity-70 mix-blend-screen"
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
