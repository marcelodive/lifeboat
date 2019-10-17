angular.module('lifeboat').component('statistics', {
  templateUrl: './js/app/component/statistics/statistics.html',
  bindings: {
    user: '@'
  },
  controller: StatisticsController
});

async function StatisticsController($scope, statisticsFactory, $timeout) {
  loadPivotTable();
  loadStatistics();

  async function loadPivotTable () {
    const {data: pivotTableData} = await statisticsFactory.getPivotTable();
    $scope.pivotTableData = pivotTableData.map(row => {
      row['presença'] = row.presente === 'true' ? 'Estava presente' : 'Faltou';
      row.aniversario_do_membro = row.aniversario_do_membro ? row.aniversario_do_membro : 'Sem data de aniversário';
      row.justificativa_de_desconexao = row.justificativa_de_desconexao ? row.justificativa_de_desconexao : '';
      row.membro_desconectado = row.membro_desconectado ? 'Membro desconectado' : '';
      row.membro_eh_da_igreja = row.membro_eh_da_igreja ? 'Membro da igreja' : 'Não é membro da igreja';
      row.membro_fez_discipulado = row.membro_fez_discipulado ? 'Fez discipulado' : 'Não fez discipulado';
      row.membro_fez_rhema = row.membro_fez_rhema ? 'Fez Rhema' : 'Não fez Rhema';
      row.membro_tem_departamento = row.membro_tem_departamento ? 'Está em departamento' : 'Não está em departamento';
      row.telefone_do_membro = row.telefone_do_membro ? row.telefone_do_membro : 'Sem telefone';
      delete row.presente;
      delete row.telefone_do_membro;
      [row.ano, row.mes, row.dia] = row.data_do_encontro.split('-');
      return row;
    });
    $timeout(() => $("#pivot-table").pivotUI($scope.pivotTableData, {
      renderers: $.extend(
        $.pivotUtilities.renderers,
        $.pivotUtilities.plotly_renderers
      ),
      aggregatorName: "Contagem",
      cols: ["ano", "mes"],
      rendererName: "Line Chart",
      rows: ["presença"],
      // onRefresh: (config) => console.log(config)
    }, null, 'pt'));
  }

  async function loadStatistics () {
    const {data: {boatStatistics, mostPresentMembers, randMinistrations, randPhoto}} = await statisticsFactory.getStatistics();
    $scope.boatStatistics = boatStatistics;
    $scope.mostPresentMembers = mostPresentMembers;
    $scope.randMinistrations = randMinistrations;
    $scope.randPhoto = randPhoto;
  }
}