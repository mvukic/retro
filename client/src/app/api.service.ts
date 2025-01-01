import { Injectable } from '@angular/core';
import { RequestType } from './types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  #ws: WebSocket | null = null;

  connect() {
    this.#ws = new WebSocket('ws://localhost:8080');
  }

  onOpen(fn: () => void) {
    this.#ws?.addEventListener('open', fn);
  }

  onMessage(fn: (event: MessageEvent) => void) {
    this.#ws?.addEventListener('message', fn);
  }

  onClose(fn: () => void) {
    this.#ws?.addEventListener('close', fn);
  }

  send(request: RequestType) {
    this.#ws?.send(JSON.stringify(request));
  }
}
