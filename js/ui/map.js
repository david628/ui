class Map {
  constructor(el, opt) {
    if(!this.chart) {
      this.chart = echarts.init(this.getDom(el));
    }
  }
  getDom(el) {
    if(!el) return null;
    return el.get ? el.get(0) : (typeof el == "string" ? document.getElementById(el) : el);
  }
  getCoords(json) {
    let line = [], effect = [];
    for(let i = 0; i < json.length; i++) {
      line.push({
        "coords": [geoCoordMap[json[i]['source']['name']], geoCoordMap[json[i]['target']['name']]]
      });
      effect.push({
        "name": json[i]['source']['name'],
        "value": geoCoordMap[json[i]['source']['name']],
        "symbolSize": json[i]['source']['value'],
        "itemStyle": {
          "normal": {
            "color": "#FFD24D",
            "borderColor": "gold"
          }
        }
      });
      effect.push({
        "name": json[i]['target']['name'],
        "value": geoCoordMap[json[i]['target']['name']],
        "symbolSize": json[i]['target']['value'],
        "itemStyle": {
          "normal": {
            "color": "#FFD24D",
            "borderColor": "gold"
          }
        }
      });
    }
    return {
      line: line,
      effect: effect
    };
  }
  getOption(data) {
    let rs = this.getCoords(data);
    return {
      //backgroundColor:'#013769',
      geo: {
        //name: 'Enroll distribution',
        type: 'map',
        map: 'world',
        roam: true,
        label: {
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            //shadowBlur: 30,
            //shadowColor: 'rgba(0, 0, 0,0.8)',
            areaColor: '#022548',
            borderColor: '#0DABEA'
          },
          emphasis: {
            areaColor: '#011B34'
          }
        }
      },
      series: [{
        type: 'lines',
        zlevel: 2,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.1,
          color: '#FFB973',
          symbol: 'arrow',
          symbolSize: 5
        },
        lineStyle: {
          normal: {
            color: '#FFB973',
            width: 1,
            opacity: 0.2,
            curveness: 0.2
          }
        },
        data: rs.line
        //data: formtGCData(geoCoordMap, data, '南宁市')
      }, {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
          period: 4,
          scale: 4,
          brushType: 'stroke'
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: 5,
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: 'gold'
          }
        },
        data: rs.effect
        //data: formtVData(geoCoordMap, data, '南宁市')
      }]
    };
  }
  load(data) {
    this.chart.setOption(this.getOption(data));
  }
}