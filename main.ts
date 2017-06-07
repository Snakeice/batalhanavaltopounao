enum Stats {
    bomb = <any>"💣",
    skull = <any>"☠",
    wather = <any>"♒",
    fire = <any>"🔥"
}

enum Orientacao {
    HORIZONTAL,
    VERTICAL
}
/**
 * Controle de embarcação
 */
class Embarcacao {
    private _orientacao: Orientacao;
    private _tamanho: number;
    private _posini: String;
    private _corpo: String[];
    private _tiros: Number[];

    constructor(private orientacao: Orientacao, private tamanho: number, private posIni) {
        this._orientacao = orientacao;
        this._posini = posIni;
        this._tamanho = tamanho;
        this._corpo = [];
        this._tiros = [];
        for (var i = 0; i < tamanho; i++) {
            this._tiros[i] = 0;
        }
        this.init();
    }


    init() {
        var pos = this._posini.split(".", 2);
        for (var i = 0; i < this._tamanho; i++) {
            pos[0] = this._orientacao === Orientacao.HORIZONTAL ? pos[0] : (parseInt(pos[0]) + 1).toString();
            pos[1] = this._orientacao === Orientacao.VERTICAL ? pos[1] : (parseInt(pos[1]) + 1).toString();
            this._corpo[i] = pos[0] + "." + pos[1];
            //Geração do corpo da embarcação

        }

    }
    // Atualiza o tabuleiro com a embarcação
    public updateTabuleiro(_cells: Cell[][]) {
        for (var i = 0; i < this._tamanho; i++) {
            var pos = this._corpo[i].split(".", 2);
            //console.log(pos);
            _cells[pos[0]][pos[1]].setValue(Stats.bomb);
        }

    }

    public getCorpo() {
        return this._corpo;
    }

    getTamanho() {
        return this._tamanho;
    }
    public SetTiro(i) {
        this._tiros[i] = 1;
    }

    public validar() {
        var v: boolean;
        v = true;
        this._tiros.forEach(t => {
            if (t == 0) {
                v = false;
            }
        });
        return v;
    }
}
/**
 * Celula
 */
class Cell {
    private _value: Stats;
    private _pressed: Boolean;
    private _stat: Stats;
    constructor(private value: Stats) {
        this._value = value;
        this._pressed = false;
        this._stat = Stats.wather;
    }

    getStat():string {
        return this._stat.toString();
    }

    isPressed() {
        return this._pressed;
    }

    setValue(value: Stats) {
        this._value = value;
    }
    onPress() {
        this._pressed = true;
        this._stat = this._value;
    }
}
/**
 * Classe batalha
 */
class Batalha {
    private _campo;
    private _altura: number;
    private _largura: number;
    private _cells: Cell[][];
    private _embarcacoes: Embarcacao[];
    private _couter;
    private _clicks: number;
    private _minToVictory: number;
    /**
     * Construtor batt
     * @param campo Div tabuleiro
     * @param couter div contador
     * @param largura largura da tabela
     * @param altura altura da tabela
     * @param minToVictory minimo  derrubado para ganhar
     */
    constructor(private campo, private couter, private largura: number, private altura: number, private minToVictory: number) {
        this._campo = campo;
        this._altura = altura;
        this._largura = largura;
        this._couter = couter;
        this._cells = [];
        this._embarcacoes = [];
        this._clicks = 0;
        this._minToVictory = minToVictory;

        for (var j = 0; j < this._altura; j++) {
            this._cells[j] = [];
            for (var l = 0; l < this._largura; l++) {
                this._cells[j][l] = new Cell(Stats.skull);
            }
        }
        this.gerarEmbarcacoesAleatorias();
        this._embarcacoes.forEach(element => {
            console.log(element);
        });
    }
    /**
     * Reseta campo
     */
    reset() {
        for (var j = 0; j < this._altura; j++) {
            this._cells[j] = [];
            for (var l = 0; l < this._largura; l++) {
                this._cells[j][l] = new Cell(Stats.skull);
            }
        }
        this._clicks = 0;
        this.gerarEmbarcacoesAleatorias();
        this.render();
    }

    /**
     * Gera embarcações
     */
    private gerarEmbarcacoesAleatorias() {
        this._embarcacoes[0] = this.getEmbarcacaoAleatoria(5);
        this._embarcacoes[1] = this.getEmbarcacaoAleatoria(5);
        this._embarcacoes[2] = this.getEmbarcacaoAleatoria(4);
        this._embarcacoes[3] = this.getEmbarcacaoAleatoria(3);
        this._embarcacoes[4] = this.getEmbarcacaoAleatoria(2);
        this._embarcacoes[5] = this.getEmbarcacaoAleatoria(2);
        this._embarcacoes[6] = this.getEmbarcacaoAleatoria(1);
        this._embarcacoes[0].updateTabuleiro(this._cells);
        this._embarcacoes[1].updateTabuleiro(this._cells);
        this._embarcacoes[2].updateTabuleiro(this._cells);
        this._embarcacoes[3].updateTabuleiro(this._cells);
        this._embarcacoes[4].updateTabuleiro(this._cells);
        this._embarcacoes[5].updateTabuleiro(this._cells);
        this._embarcacoes[6].updateTabuleiro(this._cells);
    }

    /**
     * Gera embarcação
     */
    private getEmbarcacaoAleatoria(tamanho: number) {
        var dir, iniRow, iniCol;
        dir = Math.random() < .5 ? Orientacao.VERTICAL : Orientacao.HORIZONTAL;
        iniRow = Math.max(0, Math.round(Math.random() * this._altura));
        iniCol = Math.max(0, Math.round(Math.random() * this._largura));
        var x: Number = iniRow + tamanho;
        var y: Number = iniCol + tamanho
        if ((x >= this._largura) || (y >= this._altura)) {
            return this.getEmbarcacaoAleatoria(tamanho);
        } else {
            return new Embarcacao(dir, tamanho, iniRow + "." + iniCol);
        }
    }
    /**
     * Render do tabuleiro
     */
    render() {
        this._campo.innerHTML = "";
        var html: string = "<table cellspacing='0' cellpadding='0'>";
        for (var j = 0; j < this._altura; j++) {
            html += "<tr>";
            for (var l = 0; l < this._largura; l++) {
                html += "<th onClick='batalha.alertar(this.id)' id='" + j + "." + l + "'>" + this._cells[j][l].getStat() + "</th>";
            }
            html += "</tr>";
        }
        html += "</table>";
        this._campo.innerHTML = html;
        this._couter.innerHTML = this._clicks.toString();
    }
    /**
     * render da celula clicada
     * @param j linha
     * @param l coluna
     */
    onclickCampo(j, l) {
        this._cells[j][l].onPress();
        var xpto = j + '.' + l;
        this._couter.innerHTML = this._clicks.toString();
        this.atingiuAlvo(j, l);
        document.getElementById(xpto).innerText = this._cells[j][l].getStat();

    }

    /**
     * Notifica a celula para o click
     * @param id Posicao
     */
    alertar(id: String) {
        console.log(id);
        var pos = id.split(".", 2);
        if (!this._cells[pos[0]][pos[1]].isPressed()) this._clicks++;
        this.onclickCampo(pos[0], pos[1]);
        // this.render();
    }
    /**
     * Executa vitora (limpa tabuleiro)
     */
    public vitoria() {
        for (var j = 0; j < this._largura; j++) {
            for (var l = 0; l < this._altura; l++) {
                this._cells[j][l].onPress();
            }
        }
        this.render();
    }
    /**
     * Colision detect
     */
    atingiuAlvo(j, l) {
        var coutV : number;
        coutV = 0;
        this._embarcacoes.forEach((barco) => {
            barco.getCorpo().forEach((s, i) => {
                var sv = (j + '.' + l);
                if (j + '.' + l === s) {
                    barco.SetTiro(i);
                    console.log("Alvo atingido!");
                }
            });
            if(barco.validar()){
                coutV ++;
            }   
        });
        //Valida a qtd de vitorias
        if(coutV >= this._minToVictory){
             batalha.vitoria();
             this._couter.style.color = "red";
             this._couter.style.fontSize = "xx-large";
            this._couter.innerHTML = "Vitoriaaaaaaaaaaaaaaaaaaaaa!";
        }
    }
}

var campo = document.getElementById("campo");//Pega campo
var couter = document.getElementById("couter");//Pega contador
var batalha = new Batalha(campo,//Campo
                         couter,//Contador
                         15,//Largura
                         15,//Altura
                         2);//Numero de embarcações
batalha.render();
