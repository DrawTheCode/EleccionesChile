export function percentValue(a, b) {
  return Number.parseFloat((parseInt(a) / parseInt(b)) * 100).toFixed(2);
}

function makeTrItem(valueA, valueB, valueC) {
  const tempFile = document.createElement('tr');
  tempFile.innerHTML = `<td>${valueA}</td><td>${valueB}</td><td>${valueC}</td>`;
  return tempFile;
}

function makeATable(divId, data, config = null) {
  const nuloEmitidos = data.nulo !== undefined ? parseInt(data.nulo) : 0;
  const blcoEmitidos = data.blco !== undefined ? parseInt(data.blco) : 0;
  const valiEmitidos = data.vali !== undefined ? parseInt(data.vali) : 0;
  const apruEmitidos = data.apru !== undefined ? parseInt(data.apru) : 0;
  const rchzEmitidos = data.rchz !== undefined ? parseInt(data.rchz) : 0;
  const selectDIV = document.getElementById(divId);
  if (
    nuloEmitidos &&
    blcoEmitidos &&
    valiEmitidos &&
    apruEmitidos &&
    rchzEmitidos
  ) {
    const validSumApReEmitidos = rchzEmitidos + apruEmitidos;
    const totalVotos = validSumApReEmitidos + blcoEmitidos + nuloEmitidos;
    if (config?.header !== undefined) {
      selectDIV.insertAdjacentHTML('beforeend', config.header);
    }
    let tabla = document.createElement('table');
    tabla.innerHTML =
      '<tr><th>Opción</th><th>Total vistas</th><th>Total Porcentaje</th></tr>';
    tabla.appendChild(
      makeTrItem(
        '',
        validSumApReEmitidos,
        `${percentValue(validSumApReEmitidos, valiEmitidos)}%`,
      ),
    );
    tabla.appendChild(
      makeTrItem(
        'A Favor',
        apruEmitidos,
        `${percentValue(apruEmitidos, valiEmitidos)}%`,
      ),
    );
    tabla.appendChild(
      makeTrItem(
        'En Contra',
        rchzEmitidos,
        `${percentValue(rchzEmitidos, valiEmitidos)}%`,
      ),
    );
    tabla.appendChild(
      makeTrItem(
        'Validamente Emitidos',
        valiEmitidos,
        `${percentValue(valiEmitidos, totalVotos)}%`,
      ),
    );
    tabla.appendChild(
      makeTrItem(
        'Votos Nulos',
        nuloEmitidos,
        `${percentValue(nuloEmitidos, totalVotos)}%`,
      ),
    );
    tabla.appendChild(
      makeTrItem(
        'Votos En Blanco',
        blcoEmitidos,
        `${percentValue(blcoEmitidos, totalVotos)}%`,
      ),
    );
    tabla.appendChild(
      makeTrItem(
        'Total de Votación',
        totalVotos,
        `${percentValue(totalVotos, totalVotos)}%`,
      ),
    );
    selectDIV.appendChild(tabla);
    if (config?.footer) {
      selectDIV.insertAdjacentHTML('beforeend', config.footer);
    }
  }
}

export function makeGenericStructure(divID, config, init = null, end = null) {
  if (init || end) {
    let info = {
      header: init,
      footer: end,
    };
    makeATable(divID, config, info);
  }
}

export const disclaimlText = `<ul>
                      <li>Porcentaje calculado sobre el total de votos válidamente emitidos, excluidos votos nulos y votos en blanco.</li>
                      <li>Resultados preliminares según artículo 185, Ley 18.700, tienen carácter meramente informativo y no constituyen escrutinio para efecto legal alguno</li>
                    </ul>`;

export const infoBarResults = (aFavor, enContra, emitidos) => {
  let percentIntValue = Math.trunc((aFavor / emitidos) * 100);
  return `<div class="bar">
            <div style="width:${percentIntValue}%;">
                <b>A favor (${percentValue(aFavor, emitidos)}%)</b>
            </div>
            <div style="width:${100 - percentIntValue}%;">
              <b>En Contra (${percentValue(enContra, emitidos)}%)</b>
            </div>
          </div>`;
};

export const infoVotaciones = (totalMesas, percent, hour) => {
  const firstLine =
    totalMesas && percent
      ? `<li>${
          totalMesas * (percent / 100)
        } mesas escrutadas de un total de ${totalMesas}, correspondiente al ${percent}%.</li>`
      : null;
  const secondLine = hour ? `<li>Versión: 07/12/2023 ${hour}</li>` : null;
  let result = '';
  if (firstLine || secondLine) {
    result = `<ul>
              ${firstLine ?? ''}
              ${secondLine ?? ''}
            </ul>
          `;
  }
  return result.length > 0 ? result : '';
};

export function makeResult(data, exclude = false) {
  if (data.length > 0) {
    let nuloEmitidos = 0;
    let blcoEmitidos = 0;
    let valiEmitidos = 0;
    let apruEmitidos = 0;
    let rchzEmitidos = 0;
    data.forEach(element => {
      if (!exclude || element.COD_ZONA !== exclude) {
        if (element.COD_AMBITO === '1' && element.AMBITO === '5') {
          nuloEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '1' && element.AMBITO === '6') {
          blcoEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '1' && element.AMBITO === '7') {
          valiEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '100001' && element.AMBITO === '4') {
          apruEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '100002' && element.AMBITO === '4') {
          rchzEmitidos += parseInt(element.VOTOS);
        }
      }
    });
    return {
      nulo: nuloEmitidos,
      blco: blcoEmitidos,
      vali: valiEmitidos,
      apru: apruEmitidos,
      rchz: rchzEmitidos,
    };
  }
}
