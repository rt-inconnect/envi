(function () {
  'use strict';

  angular
  .module('app.chart', ['n3-line-chart'])
  .factory('Chart', ['Xtranslate', ChartFactory]);

  function ChartFactory (Xtranslate) {
    var types = {
      "line": {nameRu: "Линия", nameEn: "Line", code: "line"},
      "area": {nameRu: "Площадь", nameEn: "Area", code: "area"},
      "column": {nameRu: "Столбики", nameEn: "Column", code: "column"}
    };
    var factory = {
      renderObj: renderObj,
      renderSector: renderSector,
      types: types
    };

    return factory;

    function renderObj (type, data, secondAxe) {

      var result = {
        options: {
          lineMode: "linear",
          drawLegend: true,
          drawDots: true,
          columnsHGap: 5,
          tension: 0.7,
          stacks: [],
          axes: {
            x: {
              key: "x",
              type: "linear",
              labelFunction: function (val) {return months[Xtranslate.lang.key][val];}
            },
            y: {type: "linear"}
          },
          //tooltip: { formatter: function(x, y, series) {return y;} },
          series: []
        },
        data: []
      };

      result.options.series.push({
        y: data.year,
        label: data['label' + Xtranslate.lang.key.capitalizeFirstLetter()],
        type: type,
        axis: "y",
        stripped: true,
        dotSize: 2,
        thickness: '1px'
      });
      if (!secondAxe) {
        result.options.series.push({
          y:'limit',
          type:'line',
          color: '#ff0039',
          thickness: '3px',
          label: limits[Xtranslate.lang.key]
        });
      } else {
        result.options.series.push({
          y: "secondAxe",
          label: secondAxe.label,
          type: type,
          axis: "y2",
          stripped: true,
          dotSize: 2,
          thickness: '1px'
        });
      }

      for (var m = 1; m < 13; m++) {
        var row = {x: m};
        row[data.year] = data['m'+m];
        if (!secondAxe) row.limit = data.limit || 0;
        else row.secondAxe = secondAxe['m'+m];
        result.data.push(row);
      };
      return result;
    };


    function renderSector (type, data, republics) {
      
      if (!data) return {};

      var keys = Object.keys(data);
      
      var result = {
        options: {
          lineMode: "linear",
          drawLegend: true,
          drawDots: true,
          columnsHGap: 5,
          tension: 0.7,
          stacks: [],
          axes: {
            x: {
              key: "x",
              type: "linear",
              max: keys[keys.length - 1],
              labelFunction: function (val) {return val;}
            },
            y: {type: "linear"}
          },
          //tooltip: { formatter: function(x, y, series) {return y;} },
          series: []
        },
        data: []
      };

      for(var key in data) {
        var row = {x: parseInt(key)};
        data[key].forEach(function (d) {
          row['r' + d.repId] = d.data;
        });
        result.data.push(row);
      }

      republics.forEach(function (r, i) {
        var row = {
          y: 'r' + r.id,
          label: r['name' + Xtranslate.lang.key.capitalizeFirstLetter()],
          type: type,
          axis: "y",
          stripped: true,
          dotSize: 2,
          thickness: '1px'
        };
        result.options.series.push(row);
      });

      return result;
    };    
  };

  var months = {
    en: {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec"
    },
    ru: {
      1: "Янв",
      2: "Фев",
      3: "Мар",
      4: "Апр",
      5: "Май",
      6: "Июн",
      7: "Июл",
      8: "Авг",
      9: "Сен",
      10: "Окт",
      11: "Ноя",
      12: "Дек"
    }
  };

  var limits = {
    en: "MPN",
    ru: "ПДН"
  };
})();