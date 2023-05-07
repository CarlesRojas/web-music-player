export const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));

export const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
