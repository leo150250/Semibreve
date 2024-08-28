//Elementos:
const wrapperPartitura = document.getElementById("wrapperPartitura");

//Variáveis:
var partitura = null;
var partes = [];

//Enums:
const Figuras = Object.freeze({
	breve:0,
	semibreve:"whole",
	minima:"half",
	seminima:"quarter",
	colcheia:"eighth",
	semicolcheia:5,
	fusa:6,
	semifusa:7,
	quadrifusa:8
});
const Alturas = Object.freeze({
	C:"C",
	D:"D",
	E:"E",
	F:"F",
	G:"G",
	A:"A",
	B:"B"
});
const Claves = Object.freeze({
	G:"G",
	F:"F",
	C:"C",
	Ritmo:"R"
});

//Classes:
class Nota {
	constructor(argCompasso) {
		this.altura = [Alturas.C,4];
		this.duracao = 4;
		this.tipo = Figuras.semibreve;
		this.elemento = document.createElement("img");
		this.elemento.classList.add("figura");
		this.elemento.src = "#";
		this.compasso = argCompasso;
	}
	xml() {
		let elementoXML = document.createElement("note");
		let elPitch = document.createElement("pitch");
		let elStep = document.createElement("step");
		elStep.innerText = this.altura[0];
		elPitch.appendChild(elStep);
		let elOctave = document.createElement("octave");
		elOctave.innerText = this.altura[1];
		elPitch.appendChild(elOctave);
		elementoXML.appendChild(elPitch);
		let elDuracao = document.createElement("duration");
		elDuracao.innerText = this.duracao;
		elementoXML.appendChild(elDuracao);
		let elTipo = document.createElement("type");
		elTipo.innerText = this.tipo;
		elementoXML.appendChild(elTipo);
		return elementoXML;
	}
	desenhar() {
		console.log("Desenhei nota!");
		this.compasso.elemento.appendChild(this.elemento);
	}
}
class AtributosCompasso {
	constructor() {
		this.divisoes = 1;
		this.armadura = 0;
		this.tempo = [4,4];
		this.clave = [Claves.G,2];
	}
	xml() {
		let elementoXML = document.createElement("attributes");
		let elDivisoes = document.createElement("divisions");
		elDivisoes.innerText = this.divisoes;
		elementoXML.appendChild(elDivisoes);
		let elAltura = document.createElement("key");
		let elQuintas = document.createElement("fifths");
		elQuintas.innerText = this.armadura;
		elAltura.appendChild(elQuintas);
		elementoXML.appendChild(elAltura);
		let elTempo = document.createElement("time");
		let elBeats = document.createElement("beats");
		elBeats.innerText = this.tempo[0];
		elTempo.appendChild(elBeats);
		let elBeatType = document.createElement("beat-type");
		elBeatType.innerText = this.tempo[1];
		elTempo.appendChild(elBeatType);
		elementoXML.appendChild(elTempo);
		let elClave = document.createElement("clef");
		let elSign = document.createElement("sign");
		elSign.innerText = this.clave[0];
		elClave.appendChild(elSign);
		let elLine = document.createElement("line");
		elLine.innerText = this.clave[1];
		elClave.appendChild(elLine);
		elementoXML.appendChild(elClave);
		return elementoXML;
	}
}
class Compasso {
	constructor(argNumero, argPauta) {
		this.numero = argNumero;
		this.atributos = new AtributosCompasso();
		this.notas = [new Nota(this)];
		this.elemento = document.createElement("div");
		this.elemento.classList.add("compasso");
		this.pauta = argPauta;
	}
	xml() {
		let elementoXML = document.createElement("measure");
		elementoXML.setAttribute("number",this.numero);
		elementoXML.appendChild(this.atributos.xml());
		for (let i = 0; i < this.notas.length; i++) {
			elementoXML.appendChild(this.notas[i].xml());
		}
		return elementoXML;
	}
	desenhar() {
		this.pauta.elemento.appendChild(this.elemento);
		for (let i = 0; i < this.notas.length; i++) {
			this.notas[i].desenhar();
		}
	}
}
class Pauta {
	constructor(argParte) {
		this.compassos = [new Compasso(1,this)];
		this.elemento = document.createElement("div");
		this.elemento.classList.add("pauta");
		this.parte = argParte;
	}
	xml() {
		let elementoXML = document.createElement("part");
		elementoXML.id = this.parte.id;
		for (let i = 0; i < this.compassos.length; i++) {
			elementoXML.appendChild(this.compassos[i].xml());
		}
		return elementoXML;
	}
	desenhar() {
		this.parte.elemento.appendChild(this.elemento);
		for (let i = 0; i < this.compassos.length; i++) {
			this.compassos[i].desenhar();
		}
	}
}
class Parte {
	constructor(argID="P1",argNome="Music") {
		this.id=argID;
		this.nome=argNome;
		this.pautas = [new Pauta(this)];
		partes.push(this);
		this.elemento = document.createElement("div");
		this.elemento.classList.add("parte");
	}
	xml(argPai) {
		for (let i = 0; i < this.pautas.length; i++) {
			argPai.appendChild(this.pautas[i].xml());
		}
	}
	desenhar() {
		wrapperPartitura.appendChild(this.elemento);
		for (let i = 0; i < this.pautas.length; i++) {
			this.pautas[i].desenhar();
		}
	}
}
class Partitura {
	constructor() {
		this.partes = [new Parte()];
		partes.length = 0;
		partitura = this;
	}
	xml() {
		let elementoXML = document.createElement("score-partwise");
		elementoXML.setAttribute("version","4.0");
		let listaPartes = document.createElement("part-list");
		elementoXML.appendChild(listaPartes);
		for (let i = 0; i < this.partes.length; i++) {
			const parte = this.partes[i];
			let parteListagem = document.createElement("score-part");
			parteListagem.id=parte.id;
			let parteNome = document.createElement("part-name");
			parteNome.innerText = parte.nome;
			parteListagem.appendChild(parteNome);
			listaPartes.appendChild(parteListagem);
			//elementoXML.appendChild(parte.xml());
			parte.xml(elementoXML);
		}
		return elementoXML;
	}
	desenhar() {
		for (let i = 0; i < this.partes.length; i++) {
			const parte = this.partes[i];
			parte.desenhar();
		}
	}
}

//Funções:
function exibirXML() {
	let XML = "";
	/*
	let headerXML = document.createElement("xml");
	headerXML.setAttribute("version","1.0");
	headerXML.setAttribute("encoding","UTF-8");
	headerXML.setAttribute("standalone","no");
	XML+=headerXML.outerHTML;
	let docTypeXML = document.implementation.createDocumentType("score-partwise","\"-//Recordare//DTD MusicXML 4.0 Partwise//EN\"","\"http://www.musicxml.org/dtds/partwise.dtd\"");
	*/
	XML+=partitura.xml().outerHTML;
	return XML;
}
function novaPartitura() {
	new Partitura();
}
function redesenharPartitura() {
	partitura.desenhar();
}

//Comandos:
novaPartitura();
console.log(exibirXML());
redesenharPartitura();