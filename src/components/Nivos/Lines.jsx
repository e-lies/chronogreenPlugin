import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { Line, ResponsiveLine } from '@nivo/line'

/*let data = [
  {
    "id": "japan",
    "color": "hsl(62, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 266
      },
      {
        "x": "helicopter",
        "y": 216
      },
      {
        "x": "boat",
        "y": 66
      },
      {
        "x": "train",
        "y": 140
      },
      {
        "x": "subway",
        "y": 3
      },
      {
        "x": "bus",
        "y": 154
      },
      {
        "x": "car",
        "y": 35
      },
      {
        "x": "moto",
        "y": 125
      },
      {
        "x": "bicycle",
        "y": 223
      },
      {
        "x": "others",
        "y": 215
      }
    ]
  },
  {
    "id": "france",
    "color": "hsl(87, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 284
      },
      {
        "x": "helicopter",
        "y": 15
      },
      {
        "x": "boat",
        "y": 39
      },
      {
        "x": "train",
        "y": 271
      },
      {
        "x": "subway",
        "y": 239
      },
      {
        "x": "bus",
        "y": 159
      },
      {
        "x": "car",
        "y": 6
      },
      {
        "x": "moto",
        "y": 26
      },
      {
        "x": "bicycle",
        "y": 56
      },
      {
        "x": "others",
        "y": 60
      }
    ]
  },
  {
    "id": "us",
    "color": "hsl(293, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 27
      },
      {
        "x": "helicopter",
        "y": 83
      },
      {
        "x": "boat",
        "y": 62
      },
      {
        "x": "train",
        "y": 249
      },
      {
        "x": "subway",
        "y": 251
      },
      {
        "x": "bus",
        "y": 161
      },
      {
        "x": "car",
        "y": 27
      },
      {
        "x": "moto",
        "y": 270
      },
      {
        "x": "bicycle",
        "y": 158
      },
      {
        "x": "others",
        "y": 58
      }
    ]
  },
  {
    "id": "germany",
    "color": "hsl(297, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 213
      },
      {
        "x": "helicopter",
        "y": 177
      },
      {
        "x": "boat",
        "y": 280
      },
      {
        "x": "train",
        "y": 99
      },
      {
        "x": "subway",
        "y": 25
      },
      {
        "x": "bus",
        "y": 299
      },
      {
        "x": "car",
        "y": 97
      },
      {
        "x": "moto",
        "y": 148
      },
      {
        "x": "bicycle",
        "y": 189
      },
      {
        "x": "others",
        "y": 38
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(28, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 45
      },
      {
        "x": "helicopter",
        "y": 171
      },
      {
        "x": "boat",
        "y": 83
      },
      {
        "x": "train",
        "y": 279
      },
      {
        "x": "subway",
        "y": 101
      },
      {
        "x": "bus",
        "y": 243
      },
      {
        "x": "car",
        "y": 110
      },
      {
        "x": "moto",
        "y": 270
      },
      {
        "x": "bicycle",
        "y": 172
      },
      {
        "x": "others",
        "y": 99
      }
    ]
  }
];*/
const mark = {axis: 'y',
              value: 0,
              lineStyle: {stroke: '#222',strokeWidth: 2}
            };
const Lines = props=>{
  const { data, markers, precision, interpolated, xLabel, yLabel, colorKey, tickValues, legend, onLegendClick, onPointClick, height, width } = props;
  const points = data.reduce((acc,cur)=>{ return acc + cur['data'].length},0);
  if(points < 201){
    let tv = tickValues || false
    let dates = data.reduce((acc,cur)=>{
      let a = [...acc]
      cur.data.forEach(c=>{ if(!acc.includes(c.x)){ a.push(c.x) } })
      return a
    },[])
    if(!tv){
      //let mx = data.reduce((acc,cur)=>{ return Math.max(acc,cur.data.length) },0)
      if(dates.length > 12){
        tv = 8
      }
      else{
        tv = dates.map(d=> new Date(d))
      }
    }
    let xft = {type:'point'};
      if(precision === "day") {
        xft = {type:'time',format:'%Y-%m-%d',representation:'%Y-%m-%d',precision}
      }
      else if(precision === "month"){
        xft = {type:'time',format:'%Y-%m-%d',representation:'%Y-%m',precision}
      }
      else if(precision === "year"){
        xft = {type:'time',format:'%Y-%m-%d',representation:'%Y',precision}
      }
      else if(precision === "hour"){
        xft = {type:'time',format:'%H:%M:%S',representation:'%H',precision}
      }
      else if(precision === "minute"){
        xft = {type:'time',format:'%H:%M:%S',representation:'%H:%M',precision}
      }
      else if(precision === "seconde"){
        xft = {type:'time',format:'%H:%M:%S',representation:'%H:%M:%S',precision}
      }
      const precisionFormat = {year:"%Y", month:"%Y-%m", day:"%Y-%m-%d",hour:"%Hh",minute:"%H:%M",seconde:"%H:%M:%S"}
      return(
        <div id="chartLine" style={{height, width}}><ResponsiveLine
          data={data}
          markers={[...markers,mark]}
          /*tooltip={(e)=>{ console.log(e)
          return ( <h5><span style={{color:e.color}}>{e.serieId}</span> {e.point.data.xFormatted} : {e.point.data.yFormatted}</h5> )
          }}*/
          curve={interpolated ? "monotoneX" : "linear"}
          xScale={xft}
          xFormat={xft.format && xft.type+":"+xft.representation}
          yScale={{
            type: 'linear',
          }}
          axisBottom={{
            format: precisionFormat[precision],
            tickValues: tv, //[new Date("2018-01-04"),new Date("2018-01-10"),new Date("2018-02-05")], //`every 1 ${precision}`,
            legend: xLabel,
            legendOffset: -12,
            orient: "bottom",
            tickRotation:45
          }}
          axisLeft={{
            legend: yLabel,
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legendPosition: "middle"
          }}
          enablePointLabel={points < 61}
          pointSize={16}
          pointBorderWidth={1}
          pointBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.3]],
          }}
          useMesh={true}
          colors={colorKey ? data.map(d => d.color)  : { scheme: "set1" } }
          colorBy="index"
          lineWidth={3}
          dotSize={12}
          dotColor="inherit:darker(0)"
          dotBorderWidth={4}
          dotBorderColor="inherit:brighter(1.4)"
          dotLabel="y"
          dotLabelYOffset={10}
          enableArea={true}
          areaOpacity={0.05}
          animate={true}
          motionStiffness={180}
          motionDamping={17}
          margin={{
            "top": 54,
            "right": 104,
            "bottom": 54,
            "left": 53
          }}
          legends={legend ? [
            {
                "anchor": "bottom-right",
                "onClick": onLegendClick,
                "direction": "column",
                "justify": false,
                "translateX": 59,
                "translateY": -14,
                "itemWidth": 41,
                "itemHeight": 22,
                "itemsSpacing": 9,
                "symbolSize": 17,
                "symbolShape": "circle",
                "itemDirection": "left-to-right",
                "itemTextColor": "#777",
                "effects": [
                  {
                    "on": "hover",
                    "style": {
                        "itemBackground": "rgba(0, 0, 0, .03)",
                        "itemOpacity": 0.5
                    },
                  }
                ]
            }
        ] : undefined}
        onClick={onPointClick}
    /></div>
      )
    /*return(
      <div id="chartLine" style= {{height:'400px'}}>
      <ResponsiveLine
          data={[
            {
                id: 'fake corp. A',
                data: [
                    { x: '2018-01-01', y: 7 },
                    { x: '2018-01-02', y: 5 },
                    { x: '2018-01-03', y: 11 },
                    { x: '2018-01-04', y: 9 },
                    { x: '2018-01-05', y: 12 },
                    { x: '2018-01-06', y: 16 },
                    { x: '2018-01-07', y: 13 },
                    { x: '2018-01-08', y: 13 },
                ],
            },
            {
                id: 'fake corp. B',
                data: [
                    { x: '2018-01-04', y: 14 },
                    { x: '2018-01-05', y: 14 },
                    { x: '2018-01-06', y: 15 },
                    { x: '2018-01-07', y: 11 },
                    { x: '2018-01-08', y: 10 },
                    { x: '2018-01-09', y: 12 },
                    { x: '2018-01-10', y: 9 },
                    { x: '2018-01-11', y: 7 },
                ],
            },
        ]}
          //{data}
          curve={interpolated ? "cardinal" : "linear"}
          margin={{
              "top": 50,
              "right": 104,
              "bottom": 44,
              "left": 53
          }}
          //https://nivo.rocks/storybook/?knob-curve=step&selectedKind=Line&selectedStory=time%20x%20scale&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybooks%2Fstorybook-addon-knobs
          xScale={xFormat} //exp dates et heures: {type: 'time',format: '%Y-%m-%d',precision: 'day'}
          xFormat="time:%Y-%m-%d"
          yScale={{
              "type": 'linear',
              "stacked": false,
              "min": -3,
              "max": "auto"
          }}
          /*axisTop={{
              "orient": "top",
              "tickSize": 3,
              "tickPadding": 15,
              "tickRotation": 45,
              "legend": "",
              "legendOffset": 15
          }}
          axisRight={null}
          axisBottom={{
              "orient": "bottom",
              "tickSize": 6,
              "tickPadding": 2,
              "tickRotation": 0,
              "legend": "transportation",
              "legendOffset": 36,
              "legendPosition": "middle"
          }}
          axisLeft={{
              "orient": "left",
              "tickSize": 5,
              "tickPadding": 5,
              "tickRotation": 0,
              "legend": "count",
              "legendOffset": -40,
              "legendPosition": "middle"
          }}
          markers={[...markers,mark]}
          colors="set1"
          lineWidth={3}
          dotSize={12}
          dotColor="inherit:darker(0)"
          dotBorderWidth={4}
          dotBorderColor="inherit:brighter(1.4)"
          dotLabel="y"
          dotLabelYOffset={10}
          enableArea={true}
          areaOpacity={0.05}
          animate={true}
          motionStiffness={180}
          motionDamping={17}
          legends={[
              {
                  "anchor": "bottom-right",
                  "direction": "column",
                  "justify": false,
                  "translateX": 59,
                  "translateY": -14,
                  "itemWidth": 41,
                  "itemHeight": 22,
                  "itemsSpacing": 9,
                  "symbolSize": 17,
                  "symbolShape": "circle",
                  "itemDirection": "left-to-right",
                  "itemTextColor": "#777",
                  "effects": [
                      {
                          "on": "hover",
                          "style": {
                              "itemBackground": "rgba(0, 0, 0, .03)",
                              "itemOpacity": 1
                          }
                      }
                  ]
              }
          ]}
      /></div>)*/
  }
  else{
    return (<h4> Trop de points à représenter !! </h4>)
  }
}
Lines.propTypes = {
  data: PropTypes.array.isRequired,
  precision: PropTypes.string,
  type: PropTypes.string,
  markers: PropTypes.array,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  /**
   * Est-ce que la légende doit aparaitre
   */
  legend: PropTypes.bool,
  /**
   * Evénement à éxecuter quand on clique sur élément Legend
   */
  onLegendClick: PropTypes.func,
  /**
   * Evénement à éxecuter quand on clique sur un point du graphe
   */
  onPointClick: PropTypes.func
}
Lines.defaultProps = {
    markers: [],
    type:"linear",
    precision:"day",
    xLabel: "",
    yLabel: "",
    legend: true,
    width: '100%',
    height: 400,
    onLegendClick: e=>console.log(e),
    onPointClick: e=>console.log(e)
 };
export default Lines;