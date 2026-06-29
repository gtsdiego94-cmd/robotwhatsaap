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

const diasDoMes = 31;

const postosPrioridade = [
  "G6", "G8", "G5",
  "R1", "R2",
  "G10", "G11", "G12", "G13", "G2", "G1"
];

let escala = {};

function gerarEscala() {
  for (let dia = 1; dia <= diasDoMes; dia++) {
    escala[dia] = {};
  }

  distribuirFolgas();
  distribuirPostos();
}

function distribuirFolgas() {
  funcionarios.forEach((nome, index) => {
    let totalFolgas = folgasPorFuncionario[nome];
    let folgasMarcadas = 0;
    let dia = 1 + (index % 4);

    while (folgasMarcadas < totalFolgas && dia <= diasDoMes) {
      escala[dia][nome] = "F";
      folgasMarcadas++;
      dia += 4;
    }

    dia = 1;

    while (folgasMarcadas < totalFolgas && dia <= diasDoMes) {
      if (escala[dia][nome] !== "F") {
        escala[dia][nome] = "F";
        folgasMarcadas++;
      }
      dia++;
    }
  });
}

function distribuirPostos() {
  for (let dia = 1; dia <= diasDoMes; dia++) {
    const trabalhando = funcionarios.filter(nome => escala[dia][nome] !== "F");

    const deslocamento = (dia - 1) % trabalhando.length;
    const ordenados = trabalhando.slice(deslocamento).concat(trabalhando.slice(0, deslocamento));

    ordenados.forEach((nome, index) => {
      escala[dia][nome] = postosPrioridade[index] || "Apoio";
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

  postosPrioridade.forEach(posto => {
    const pessoa = funcionarios.find(nome => escala[dia][nome] === posto);

    html += `
      <tr>
        <td class="${classePosto(posto)}">${posto}</td>
        <td>${pessoa || "SEM COBERTURA"}</td>
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
    let trabalhados = 0;
    let folgas = 0;

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

function mostrarResumoMaquinas() {
  const main = document.querySelector("main");

  const antigo = document.getElementById("resumoMaquinas");
  if (antigo) antigo.remove();

  let html = `
    <section class="card" id="resumoMaquinas">
      <h2>Quantidade por máquina</h2>
      <table>
        <tr>
          <th>Funcionário</th>
  `;

  postosPrioridade.forEach(posto => {
    html += `<th>${posto}</th>`;
  });

  html += `</tr>`;

  funcionarios.forEach(nome => {
    html += `<tr><td>${nome}</td>`;

    postosPrioridade.forEach(posto => {
      let quantidade = 0;

      for (let dia = 1; dia <= diasDoMes; dia++) {
        if (escala[dia][nome] === posto) {
          quantidade++;
        }
      }

      html += `<td>${quantidade}</td>`;
    });

    html += `</tr>`;
  });

  html += `
      </table>
    </section>
  `;

  main.insertAdjacentHTML("beforeend", html);
}

function classePosto(posto) {
  if (posto === "F") return "folga";
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
