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
  "Erick da Conceição",
  "Victor Costa"
];

const folgasPorFuncionario = {
  "Lucas Trindade": 8,
  "Matheus Senhorinho": 7,
  "Wilson Ramos": 8,
  "Ricardo Lima": 7,
  "Danilo Pereira": 8,
  "Kauan Santos": 8,
  "Dalton": 9,
  "Pedro": 8,
  "Eduardo Lima": 9,
  "João Paulo": 9,
  "Kauan Geraldo": 7,
  "Erick da Conceição": 8,
  "Victor Costa": 7
};

const postosTrabalho = [
  "G6", "G8", "G5", "G10", "G11", "G12", "G13", "G2", "G1", "R1", "R2"
];

const diasDoMes = 31;
let escala = {};

function gerarEscala() {
  for (let dia = 1; dia <= diasDoMes; dia++) {
    escala[dia] = {};
  }

  funcionarios.forEach((nome, index) => {
    let totalFolgas = folgasPorFuncionario[nome];
    let intervalo = Math.floor(diasDoMes / totalFolgas);
    let contadorFolgas = 0;

    for (let dia = 1; dia <= diasDoMes; dia++) {
      let deveFolgar = ((dia + index) % intervalo === 0) && contadorFolgas < totalFolgas;

      if (deveFolgar) {
        escala[dia][nome] = "F";
        contadorFolgas++;
      }
    }

    let diaExtra = 1;
    while (contadorFolgas < totalFolgas) {
      if (!escala[diaExtra][nome]) {
        escala[diaExtra][nome] = "F";
        contadorFolgas++;
      }
      diaExtra++;
    }
  });

  for (let dia = 1; dia <= diasDoMes; dia++) {
    let funcionariosTrabalhando = funcionarios.filter(nome => escala[dia][nome] !== "F");

    funcionariosTrabalhando.forEach((nome, index) => {
      const posto = postosTrabalho[index % postosTrabalho.length];
      escala[dia][nome] = posto;
    });
  }
}

function criarBotoesDias() {
  const diasDiv = document.getElementById("dias");
  diasDiv.innerHTML = "";

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

  postosTrabalho.forEach(posto => {
    const pessoa = funcionarios.find(nome => escala[dia][nome] === posto);

    html += `
      <tr>
        <td class="${classePosto(posto)}">${posto}</td>
        <td>${pessoa || "-"}</td>
      </tr>
    `;
  });

  const folgas = funcionarios.filter(nome => escala[dia][nome] === "F");

  html += `
    <tr>
      <td class="folga">Folga</td>
      <td>${folgas.join(", ") || "-"}</td>
    </tr>
  `;

  html += "</table>";

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

function mostrarResumoFolgas() {
  const main = document.querySelector("main");

  const resumoAntigo = document.getElementById("resumoFolgas");
  if (resumoAntigo) resumoAntigo.remove();

  let html = `
    <section class="card" id="resumoFolgas">
      <h2>Resumo do mês</h2>
      <table>
        <tr>
          <th>Funcionário</th>
          <th>Trabalhados</th>
          <th>Folgas</th>
        </tr>
  `;

  let totalTrabalhados = 0;
  let totalFolgas = 0;

  funcionarios.forEach(nome => {
    let folgas = 0;
    let trabalhados = 0;

    for (let dia = 1; dia <= diasDoMes; dia++) {
      if (escala[dia][nome] === "F") {
        folgas++;
      } else {
        trabalhados++;
      }
    }

    totalTrabalhados += trabalhados;
    totalFolgas += folgas;

    html += `
      <tr>
        <td>${nome}</td>
        <td>${trabalhados}</td>
        <td class="folga">${folgas}</td>
      </tr>
    `;
  });

  html += `
      </table>
      <br>
      <p><strong>Total de dias trabalhados:</strong> ${totalTrabalhados}</p>
      <p><strong>Total de folgas:</strong> ${totalFolgas}</p>
    </section>
  `;

  main.insertAdjacentHTML("beforeend", html);
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
mostrarResumoFolgas();
