const funcionarios = [
  "Lucas Trindade",
  "Matheus Senhorinho",
  "Wilson Ramos",
  "Ricardo Lima",
  "Danilo Pereira",
  "Kauan Santos",
  "Dalton",
  "Pedro",
  "Eduardo Lima",
  "João Paulo",
  "Kauan Geraldo",
  "Erick",
  "Victor Costa"
];

const postos = ["G6", "G8", "G5", "G10", "G11", "G12", "G13", "G2", "G1", "R1", "R2", "F"];

const diasDoMes = 31;
let escala = {};

function gerarEscala() {
  for (let dia = 1; dia <= diasDoMes; dia++) {
    escala[dia] = {};

    funcionarios.forEach((nome, index) => {
      const posicao = (index + dia - 1) % postos.length;
      escala[dia][nome] = postos[posicao];
    });
  }
}

function criarBotoesDias() {
  const diasDiv = document.getElementById("dias");

  for (let dia = 1; dia <= diasDoMes; dia++) {
    const botao = document.createElement("button");
    botao.textContent = dia.toString().padStart(2, "0");
    botao.onclick = () => mostrarDia(dia);
    diasDiv.appendChild(botao);
  }
}

function mostrarDia(dia) {
  const resultado = document.getElementById("resultado");
  const titulo = document.getElementById("titulo-dia");

  titulo.textContent = `Escala do dia ${dia.toString().padStart(2, "0")}/07/2026`;

  let html = `
    <table>
      <tr>
        <th>Posto</th>
        <th>Funcionário</th>
      </tr>
  `;

  postos.forEach(posto => {
    const pessoa = funcionarios.find(nome => escala[dia][nome] === posto);

    html += `
      <tr>
        <td class="${classePosto(posto)}">${posto === "F" ? "Folga" : posto}</td>
        <td>${pessoa || "-"}</td>
      </tr>
    `;
  });

  resultado.innerHTML = html + "</table>";
}

function preencherFuncionarios() {
  const select = document.getElementById("funcionarioSelect");

  funcionarios.forEach(nome => {
    const option = document.createElement("option");
    option.value = nome;
    option.textContent = nome;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    mostrarFuncionario(select.value);
  });
}

function mostrarFuncionario(nome) {
  const div = document.getElementById("resultadoFuncionario");

  if (!nome) {
    div.innerHTML = "";
    return;
  }

  let html = `<div class="funcionario"><strong>${nome}</strong><br><br>`;

  for (let dia = 1; dia <= diasDoMes; dia++) {
    const posto = escala[dia][nome];
    html += `${dia.toString().padStart(2, "0")}/07 - <span class="${classePosto(posto)}">${posto === "F" ? "Folga" : posto}</span><br>`;
  }

  html += "</div>";
  div.innerHTML = html;
}

function classePosto(posto) {
  if (posto === "F") return "folga";
  if (posto === "R1" || posto === "R2") return "rendicao";
  return "maquina";
}

gerarEscala();
criarBotoesDias();
preencherFuncionarios();
mostrarDia(1);
