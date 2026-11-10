// Test de ejemplo de la API: arranca la app en un puerto libre aleatorio (puerto 0)
// y le hace una petición real con fetch (incluido en Node, sin librerías extra).
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app';

let server: Server;
let baseUrl: string;

beforeAll(() => {
  server = createApp().listen(0);
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://localhost:${port}`;
});

afterAll(() => {
  server.close();
});

describe('GET /health', () => {
  it('responde 200 con status ok', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok', app: 'APPersonal' });
  });
});
