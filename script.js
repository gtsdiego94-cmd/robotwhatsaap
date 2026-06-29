const postos = ["G6", "G8", "G5", "R1", "R2", "G10", "G11", "G12", "G13", "G2", "G1"];

const escala = {
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
    G1: "Eric da Conceição",
    folgas: ["Eduardo Lima", "Dalton", "Wilson Ramos"]
  }
};

const diasDoMes = 31;

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

  titulo.textContent = `Escala do dia ${String(dia).padStart(2, "0")}/07/2026`;

  if (!escala[dia]) {
    resultado.innerHTML = `<p>Esse dia ainda não foi cadastrado.</p>`;
    return;
  }

  let html = `
    <table>
      <tr>
        <th>Posto</th>
        <th>Funcionário</th>
      </tr>
  `;

  postos.forEach(posto => {
    html += `
      <tr>
        <td class="${classePosto(posto)}">${posto}</td>
        <td>${escala[dia][posto] || "-"}</td>
      </tr>
    `;
  });

  html += `
    <tr>
      <td class="folga">Folga</td>
      <td>${escala[dia].folgas.join(", ")}</td>
    </tr>
  `;

  html += `</table>`;
  resultado.innerHTML = html;
}

function classePosto(posto) {
  if (posto === "R1" || posto === "R2") return "rendicao";
  if (posto === "G6" || posto === "G8" || posto === "G5") return "forte";
  return "maquina";
}

criarBotoesDias();
mostrarDia(1);
