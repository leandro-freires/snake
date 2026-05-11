import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Tamanho do tabuleiro
  boardWidth = 20;
  boardHeight = 20;
  // Direção: 'cima', 'baixo', 'esquerda', 'direita'
  direcao: string = 'direita';
  // Corpo da cobra: array de posições {x, y}
  cobra: { x: number; y: number }[] = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  // Posição da comida
  comida: { x: number; y: number } = this.gerarComida();
  // Estado do jogo
  pontuacao: number = 0;
  jogoAtivo: boolean = false;
  intervalo: any;
  mensagem: string = '';

  ngOnInit() {
    // Inicia ouvindo teclas
    window.addEventListener('keydown', this.mudarDirecao.bind(this));
  }

  iniciarJogo() {
    this.cobra = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ];
    this.direcao = 'direita';
    this.comida = this.gerarComida();
    this.pontuacao = 0;
    this.jogoAtivo = true;
    this.mensagem = '';
    if (this.intervalo) clearInterval(this.intervalo);
    this.intervalo = setInterval(() => this.atualizarJogo(), 120);
  }

  pararJogo() {
    this.jogoAtivo = false;
    clearInterval(this.intervalo);
    this.mensagem = 'Fim de jogo! Pontuação: ' + this.pontuacao;
  }

  atualizarJogo() {
    if (!this.jogoAtivo) return;
    const cabeca = { ...this.cobra[0] };
    switch (this.direcao) {
      case 'cima':
        cabeca.y--;
        break;
      case 'baixo':
        cabeca.y++;
        break;
      case 'esquerda':
        cabeca.x--;
        break;
      case 'direita':
        cabeca.x++;
        break;
    }
    // Verifica colisão
    if (this.colidiu(cabeca)) {
      this.pararJogo();
      return;
    }
    // Adiciona nova cabeça
    this.cobra.unshift(cabeca);
    // Verifica se comeu comida
    if (cabeca.x === this.comida.x && cabeca.y === this.comida.y) {
      this.pontuacao++;
      this.comida = this.gerarComida();
    } else {
      this.cobra.pop(); // Remove o último segmento
    }
  }

  colidiu(pos: { x: number; y: number }) {
    // Fora do tabuleiro
    if (
      pos.x < 0 ||
      pos.x >= this.boardWidth ||
      pos.y < 0 ||
      pos.y >= this.boardHeight
    )
      return true;
    // Colidiu com o próprio corpo
    return this.cobra.some(
      (segmento, idx) =>
        idx !== 0 && segmento.x === pos.x && segmento.y === pos.y,
    );
  }

  gerarComida() {
    let pos: { x: number; y: number };
    do {
      pos = {
        x: Math.floor(Math.random() * this.boardWidth),
        y: Math.floor(Math.random() * this.boardHeight),
      };
    } while (
      this.cobra.some(
        (segmento) => segmento.x === pos.x && segmento.y === pos.y,
      )
    );
    return pos;
  }

  mudarDirecao(event: KeyboardEvent) {
    if (!this.jogoAtivo) return;
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (this.direcao !== 'baixo') this.direcao = 'cima';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (this.direcao !== 'cima') this.direcao = 'baixo';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (this.direcao !== 'direita') this.direcao = 'esquerda';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (this.direcao !== 'esquerda') this.direcao = 'direita';
        break;
    }
  }

  obterCelula(x: number, y: number) {
    if (this.cobra[0].x === x && this.cobra[0].y === y) return 'cabeca';
    if (
      this.cobra.some(
        (segmento, idx) => idx !== 0 && segmento.x === x && segmento.y === y,
      )
    )
      return 'corpo';
    if (this.comida.x === x && this.comida.y === y) return 'comida';
    return '';
  }
}
