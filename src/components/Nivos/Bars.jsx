import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import { ResponsiveBar } from '@nivo/bar'

 /*let infos=[
  {
    "country": "AD",
    "hot dog": 59,
    "hot dogColor": "hsl(275, 70%, 50%)",
    "burger": 172,
    "burgerColor": "hsl(108, 70%, 50%)",
    "sandwich": 151,
    "sandwichColor": "hsl(79, 70%, 50%)",
    "kebab": 173,
    "kebabColor": "hsl(158, 70%, 50%)",
    "fries": 17,
    "friesColor": "hsl(135, 70%, 50%)",
    "donut": 48,
    "donutColor": "hsl(87, 70%, 50%)"
  },
  {
    "country": "AE",
    "spécial" : 83,
    "hot dog": 74,
    "hot dogColor": "hsl(31, 70%, 50%)",
    "burger": 195,
    "burgerColor": "hsl(59, 70%, 50%)",
    "sandwich": 3,
    "sandwich Color": "hsl(349, 70%, 50%)",
    "kebab": 59,
    "kebabColor": "hsl(106, 70%, 50%)",
    "fries": 151,
    //"fries Color": "hsl(144, 70%, 50%)",
    "donut": 99,
    "donutColor": "hsl(158, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 113,
    "hot dogColor": "hsl(308, 70%, 50%)",
    "burger": 129,
    "burgerColor": "hsl(279, 70%, 50%)",
    "sandwich": 186,
    "sandwichColor": "hsl(299, 70%, 50%)",
    "kebab": 159,
    "kebabColor": "hsl(172, 70%, 50%)",
    "fries": 18,
    "friesColor": "hsl(347, 70%, 50%)",
    "donut": 15,
    "donutColor": "hsl(159, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 39,
    "hot dogColor": "hsl(222, 70%, 50%)",
    "burger": 158,
    "burgerColor": "hsl(235, 70%, 50%)",
    "sandwich": 52,
    "sandwichColor": "hsl(31, 70%, 50%)",
    "kebab": 41,
    "spécial" : 60,
    "kebabColor": "hsl(86, 70%, 50%)",
    "fries": 116,
    "friesColor": "hsl(280, 70%, 50%)",
    "donut": 94,
    "donutColor": "hsl(220, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 178,
    "hot dogColor": "hsl(175, 70%, 50%)",
    "burger": 102,
    "burgerColor": "hsl(48, 70%, 50%)",
    "sandwich": 135,
    "sandwichColor": "hsl(133, 70%, 50%)",
    "kebab": 30,
    "kebabColor": "hsl(217, 70%, 50%)",
    "fries": 86,
    "friesColor": "hsl(334, 70%, 50%)",
    "donut": 133,
    "donutColor": "hsl(56, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": -148,
    "hot dogColor": "hsl(16, 70%, 50%)",
    "burger": 12,
    "burgerColor": "hsl(12, 70%, 50%)",
    "sandwich": 11,
    "sandwichColor": "hsl(27, 70%, 50%)",
    "kebab": 46,
    "kebabColor": "hsl(89, 70%, 50%)",
    "fries": 11,
    "friesColor": "hsl(212, 70%, 50%)",
    "donut": 28,
    "donutColor": "hsl(6, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 160,
    "hot dogColor": "hsl(93, 70%, 50%)",
    "burger": 162,
    "burgerColor": "hsl(125, 70%, 50%)",
    "sandwich": -161,
    "sandwichColor": "hsl(329, 70%, 50%)",
    "kebab": 139,
    "kebabColor": "hsl(202, 70%, 50%)",
    "fries": 20,
    "friesColor": "hsl(51, 70%, 50%)",
    "donut": 37,
    "donutColor": "hsl(87, 70%, 50%)"
  }
]; 
const click = e => {console.log(e)}
const markers= [];
const x = "Type";
const y = "Quantité";
const group = "stacked";
const index = "country";
const keys =  ["hot dog", "burger", "sandwich", "spécial", "kebab", "fries", "donut"]*/
const mark = {axis: 'y',
              value: 0,
              lineStyle: {stroke: '#222',strokeWidth: 2}
            };
const Bars = props=>{
    const { data, grouped, keys, X, Y, markers, legend, onLegendClick, onPointClick, height, width } = props;
    const points = data.reduce((acc,cur)=>{ return acc + Object.keys(cur).length },0);
    if(points < 61){
        return(
          <div id="chartBar" style= {{ height, width }}>
            <ResponsiveBar 
            data={data}
            onClick={onPointClick} 
            groupMode={grouped ? "grouped" : "stacked"}   //grouped/stacked
            keys={keys}
            enableGridX={true}
            indexBy={X}
            margin={{
                "top": 50,
                "right": 130,
                "bottom": 50,
                "left": 60
            }}
            padding={0.3}
            colors={{ scheme: 'set1' }}
           // colorBy="id"
            /*defs={[
                {
                    "id": "dots",
                    "type": "patternDots",
                    "background": "inherit",
                    "color": "#38bcb2",
                    "size": 4,
                    "padding": 1,
                    "stagger": true
                },
                {
                    "id": "lines",
                    "type": "patternLines",
                    "background": "inherit",
                    "color": "#eed312",
                    "rotation": -45,
                    "lineWidth": 6,
                    "spacing": 10
                }
            ]}*/
            markers={[...markers,mark]}
        /*    fill={[
                {
                    "match": {
                        "id": "fries"
                    },
                    "id": "dots"
                },
                {
                    "match": {
                        "id": "sandwich"
                    },
                    "id": "lines"
                }
            ]} */
            borderColor="inherit:darker(1.6)"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                "tickSize": 5,
                "tickPadding": 5,
                "tickRotation": 0,
                "legend": X,
                "legendPosition": "middle",
                "legendOffset": 32
            }}
            axisLeft={{
                "tickSize": 5,
                "tickPadding": 5,
                "tickRotation": 0,
                "legend": Y,
                "legendPosition": "middle",
                "legendOffset": -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={10}
            labelTextColor="inherit:darker(1.6)"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            legends={[
              {
                  dataFrom: 'keys',
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 150,
                  translateY: 0,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemsSpacing: 0,
                  symbolSize: 20,
                  itemDirection: 'left-to-right'
              }
          ]}
        /></div>            
    )
  }
  else{
    return (<h4> Trop d'information à représenter !! </h4>)
  }
}
Bars.propTypes = {
  data: PropTypes.array.isRequired,
  X: PropTypes.string.isRequired,
  Y: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  keys: PropTypes.array.isRequired,
  markers: PropTypes.array,
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
Bars.defaultProps = {
    onClick : e => {console.log(e)},
    markers: [],
    grouped: true,
    legend: true,
    height: 400,
    width: '85%',
    onLegendClick: e=>console.log(e),
    onPointClick: e=>console.log(e)
//    x:"Type",
 //   y: "Quantité",
 //   index :"country",
 };
export default Bars;