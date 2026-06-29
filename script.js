const funcionarios = [
  "Lucas Trindade",
  "Matheus Senhorinho",
  "Wilson Ramos",
  "Ricardo Lima",
  "Danilo Pereira dos Santos",
  "Khauan Santos",
  "Dalton",
  "Pedro",
  "Eduardo Lima",
  "João Paulo",
  "Kauã Geraldo dos Santos",
  "Eric da Conceição",
  "Vitor Costa"
];

const postosNormais = ["G6", "G8", "G5", "R1", "R2", "G10", "G11", "G1", "G13", "G2", "G12"];

const postosTAAG = ["G6", "G8", "G5", "G2", "R1", "R2", "G10", "G11", "G1", "G13", "G12"];

const postos = postosNormais;

const fortes = ["G6", "G8", "G5"];
const folgasPorDia = {
  1: ["Eduardo Lima", "Dalton", "Wilson Ramos"],
  2: ["Khauan Santos", "João Paulo"],
  3: ["Lucas Trindade", "Danilo Pereira dos Santos", "Eric da Conceição"],
  4: ["Ricardo Lima", "Dalton", "Pedro", "Eduardo Lima", "Kauã Geraldo dos Santos", "Vitor Costa"],
  5: ["Wilson Ramos", "Ricardo Lima", "Dalton", "Pedro", "Eduardo Lima", "Kauã Geraldo dos Santos", "Vitor Costa"],
  6: ["Matheus Senhorinho", "João Paulo", "Eric da Conceição"],
  7: ["Khauan Santos", "Pedro"],
  8: ["Danilo Pereira dos Santos", "Dalton", "Vitor Costa"],
  9: ["Lucas Trindade", "Ricardo Lima", "Kauã Geraldo dos Santos"],
  10: ["Lucas Trindade", "Wilson Ramos", "João Paulo"],
  11: ["Matheus Senhorinho", "Wilson Ramos", "Khauan Santos", "Eduardo Lima"],
  12: ["Matheus Senhorinho", "Wilson Ramos", "Danilo Pereira dos Santos", "Khauan Santos", "Eduardo Lima", "Eric da Conceição"],
  13: ["Danilo Pereira dos Santos", "Pedro", "Eric da Conceição"],
  14: ["Lucas Trindade", "Dalton", "Eric da Conceição"],
  15: ["Ricardo Lima", "João Paulo", "Kauã Geraldo dos Santos", "Vitor Costa"],
  16: ["Wilson Ramos", "Eduardo Lima"],
  17: ["Matheus Senhorinho", "Khauan Santos"],
  18: ["Lucas Trindade", "Dalton", "Pedro", "João Paulo"],
  19: ["Lucas Trindade", "Danilo Pereira dos Santos", "Dalton", "Pedro", "João Paulo"],
  20: ["Danilo Pereira dos Santos", "Eduardo Lima", "Kauã Geraldo dos Santos"],
  21: ["Matheus Senhorinho", "Ricardo Lima", "Eric da Conceição", "Vitor Costa"],
  22: ["Wilson Ramos", "Pedro"],
  23: ["Khauan Santos", "Dalton", "Eduardo Lima"],
  24: ["Lucas Trindade", "Danilo Pereira dos Santos", "João Paulo"],
  25: ["Matheus Senhorinho", "Ricardo Lima", "Khauan Santos", "Kauã Geraldo dos Santos", "Vitor Costa"],
  26: ["Matheus Senhorinho", "Ricardo Lima", "Khauan Santos", "Kauã Geraldo dos Santos", "Vitor Costa"],
  27: ["Pedro", "Eric da Conceição"],
  28: ["Wilson Ramos", "Eric da Conceição"],
  29: ["Dalton", "Eduardo Lima"],
  30: ["Lucas Trindade", "Danilo Pereira dos Santos", "João Paulo"],
  31: ["João Paulo"]
};

const escalaManual = {
  1: {
    G6: "Lucas Trindade",
    G8: "Matheus Senhorinho",
    G5: "Ricardo Lima",
    R1: "Danilo Pereira dos Santos",
    R2: "Khauan Santos",
    G10: "Pedro",
    G11: "João Paulo",
    G12: "Kauã Geraldo dos Santos",
    G13: "Fechada",
    G2: "Vitor Costa",
    G1: "Eric da Conceição"
  }
};

let escala = {};
function ehDiaTAAG(dia) {
  const data = new Date(2026, 6, dia);
  const semana = data.getDay();

  return semana === 0 || semana === 1 || semana === 3 || semana === 5;
}

function postosDoDia(dia) {
  return ehDiaTAAG(dia) ? postosTAAG : postosNormais;
}

function fortesDoDia(dia) {
  return ehDiaTAAG(dia) ? ["G6", "G8", "G5", "G2"] : ["G6", "G8", "G5"];
}
let contagem = {};

function iniciarContagem() {
  funcionarios.forEach(nome => {
    contagem[nome] = {};
    postos.forEach(posto => contagem[nome][posto] = 0);
    contagem[nome].fortes = 0;
    contagem[nome].total = 0;
  });
}

function gerarEscala() {
  iniciarContagem();

  for (let dia = 1; dia <= 31; dia++) {
    escala[dia] = {};
    const folgas = folgasPorDia[dia] || [];

    if (escalaManual[dia]) {
      escala[dia] = { ...escalaManual[dia], folgas };
      registrarContagem(dia);
      continue;
    }

    let disponiveis = funcionarios.filter(nome => !folgas.includes(nome));

    postos.forEach(posto => {
      if (disponiveis.length === 0) {
        escala[dia][posto] = "SEM COBERTURA";
        return;
      }

      const escolhido = escolherMelhorFuncionario(disponiveis, posto);
      escala[dia][posto] = escolhido;

      contagem[escolhido][posto]++;
      contagem[escolhido].total++;

      if (fortes.includes(posto)) {
        contagem[escolhido].fortes++;
      }

      disponiveis = disponiveis.filter(nome => nome !== escolhido);
    });

    escala[dia].folgas = folgas;
  }
}

function escolherMelhorFuncionario(lista, posto) {
  return lista.sort((a, b) => {
    if (contagem[a][posto] !== contagem[b][posto]) {
      return contagem[a][posto] - contagem[b][posto];
    }

    if (fortes.includes(posto)) {
      if (contagem[a].fortes !== contagem[b].fortes) {
        return contagem[a].fortes - contagem[b].fortes;
      }
    }

    return contagem[a].total - contagem[b].total;
  })[0];
}

function registrarContagem(dia) {
  postos.forEach(posto => {
    const nome = escala[dia][posto];

    if (funcionarios.includes(nome)) {
      contagem[nome][posto]++;
      contagem[nome].total++;

      if (fortes.includes(posto)) {
        contagem[nome].fortes++;
      }
    }
  });
}

function criarBotoesDias() {
  const diasDiv = document.getElementById("dias");
  diasDiv.innerHTML = "";

  for (let dia = 1; dia <= 31; dia++) {
    const botao = document.createElement("button");
    botao.textContent = String(dia).padStart(2, "0");
    botao.onclick = () => mostrarDia(dia);
    diasDiv.appendChild(botao);
  }
}

function mostrarDia(dia) {
  const resultado = document.getElementById("resultado");
  const titulo = document.getElementById("titulo-dia");

  titulo.textContent = `Escala do dia ${String(dia).padStart(2, "0")}/07/2026`;

  const grupos = {
    "🔥 Máquinas fortes": ["G6", "G8", "G5"],
    "🟢 Rendição": ["R1", "R2"],
    "🔵 Máquinas principais": ["G10", "G11", "G1"],
    "🟡 Máquinas extras": ["G13", "G2", "G12"]
  };

  let html = `<div class="painel-dia">`;

  Object.keys(grupos).forEach(tituloGrupo => {
    html += `<h3>${tituloGrupo}</h3><div class="cards-grid">`;

    grupos[tituloGrupo].forEach(posto => {
      const pessoa = escala[dia][posto] || "SEM COBERTURA";
      const fechada = pessoa === "SEM COBERTURA" || pessoa === "Fechada";

      html += `
        <div class="posto-card ${classePosto(posto)} ${fechada ? "fechada" : ""}">
          <div class="posto-nome">${posto}</div>
          <div class="posto-pessoa">${fechada ? "FECHADA / SEM COBERTURA" : pessoa}</div>
        </div>
      `;
    });

    html += `</div>`;
  });

  html += `
    <h3>🏖️ Folgas</h3>
    <div class="folgas-box">
      ${escala[dia].folgas.length ? escala[dia].folgas.map(nome => `<span>${nome}</span>`).join("") : "<span>Ninguém de folga</span>"}
    </div>
  `;

  html += `</div>`;
  resultado.innerHTML = html;
}

function preencherFuncionarios() {
  const select = document.getElementById("funcionarioSelect");
  select.innerHTML = `<option value="">Selecione o funcionário</option>`;

  funcionarios.forEach(nome => {
    const option = document.createElement("option");
    option.value = nome;
    option.textContent = nome;
    select.appendChild(option);
  });

  select.addEventListener("change", () => mostrarFuncionario(select.value));
}

function mostrarFuncionario(nome) {
  const div = document.getElementById("resultadoFuncionario");

  if (!nome) {
    div.innerHTML = "";
    return;
  }

  let html = `<div class="funcionario"><strong>${nome}</strong><br><br>`;

  for (let dia = 1; dia <= 31; dia++) {
    let postoDoFuncionario = "Folga";

    if (!escala[dia].folgas.includes(nome)) {
      postoDoFuncionario = postos.find(posto => escala[dia][posto] === nome) || "Apoio";
    }

    html += `${String(dia).padStart(2, "0")}/07 - <span class="${classePosto(postoDoFuncionario)}">${postoDoFuncionario}</span><br>`;
  }

  html += "</div>";
  div.innerHTML = html;
}

function mostrarResumoFolgas() {
  const main = document.querySelector("main");

  let html = `
    <section class="card">
      <h2>Resumo do mês</h2>
      <table>
        <tr>
          <th>Funcionário</th>
          <th>Trabalhados</th>
          <th>Folgas</th>
        </tr>
  `;

  funcionarios.forEach(nome => {
    let folgas = 0;
    let trabalhados = 0;

    for (let dia = 1; dia <= 31; dia++) {
      if (escala[dia].folgas.includes(nome)) folgas++;
      else trabalhados++;
    }

    html += `
      <tr>
        <td>${nome}</td>
        <td>${trabalhados}</td>
        <td class="folga">${folgas}</td>
      </tr>
    `;
  });

  html += `</table></section>`;
  main.insertAdjacentHTML("beforeend", html);
}

function mostrarResumoMaquinas() {
  const main = document.querySelector("main");

  let html = `
    <section class="card">
      <h2>Quantidade por máquina</h2>
      <table>
        <tr>
          <th>Funcionário</th>
  `;

  postos.forEach(posto => {
    html += `<th>${posto}</th>`;
  });

  html += `<th>Fortes</th></tr>`;

  funcionarios.forEach(nome => {
    html += `<tr><td>${nome}</td>`;

    postos.forEach(posto => {
      let qtd = 0;

      for (let dia = 1; dia <= 31; dia++) {
        if (escala[dia][posto] === nome) qtd++;
      }

      html += `<td>${qtd}</td>`;
    });

    let totalFortes = 0;
    for (let dia = 1; dia <= 31; dia++) {
      fortes.forEach(posto => {
        if (escala[dia][posto] === nome) totalFortes++;
      });
    }

    html += `<td class="forte">${totalFortes}</td></tr>`;
  });

  html += `</table></section>`;
  main.insertAdjacentHTML("beforeend", html);
}

function classePosto(posto) {
  if (posto === "Folga" || posto === "F") return "folga";
  if (posto === "R1" || posto === "R2") return "rendicao";
  if (posto === "G6" || posto === "G8" || posto === "G5") return "forte";
  return "maquina";
}

gerarEscala();
criarBotoesDias();
preencherFuncionarios();
mostrarDia(1);
mostrarResumoFolgas();
mostrarResumoMaquinas();
