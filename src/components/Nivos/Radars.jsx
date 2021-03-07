import React from "react";
import PropTypes from "prop-types";
import { ResponsiveRadar } from "@nivo/radar";
import { useSize } from '../../reducers/Hooks';

/*let data = [
  {
    "taste": "fruity",
    "chardonay": 83,
    "carmenere": 73,
    "syrah": 65
  },
  {
    "taste": "bitter",
    "chardonay": 72,
    "carmenere": 110,
    "syrah": 84
  },
  {
    "taste": "heavy",
    "chardonay": 99,
    "carmenere": 101,
    "syrah": 27
  },
  {
    "taste": "strong",
    "chardonay": 60,
    "carmenere": 91,
    "syrah": 93
  },
  {
    "taste": "sunny",
    "chardonay": 39,
    "carmenere": 36,
    "syrah": 20
  }
]*/

const Radars = props => {
  const { data, index, keys, nbrGrid, isInteractive, onLegendClick, onPointClick, height } = props; //nbGrid est le nombre de cecle autour du centre
  let dt = data.map(d=>{
    let cluster = keys.reduce((acc,cur)=>{ acc[cur] = d[cur] || 0; return acc },{})
    return {...d,...cluster}
  })
  return (
    <div id="chartRadar" style={{ height }}>
      <ResponsiveRadar
        data={dt}
        keys={keys}
        indexBy={index}
        onClick={onPointClick}
        maxValue="auto"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'nivo' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        isInteractive={true}
        legends={[
            {   
                onClick: onLegendClick,
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
      />
    </div>
  );
};
Radars.propTypes = {
  data: PropTypes.array.isRequired,
  keys: PropTypes.array,
  nbrGrid: PropTypes.number,
  index: PropTypes.string,
  isInteractive: PropTypes.bool,
  onLegendClick: PropTypes.func,
  onPointClick: PropTypes.func,
  height: PropTypes.number
};
Radars.defaultProps = {
  nbrGrid: 5,
  keys:[],
  index: "taste",
  height: 400,
  onLegendClick: e=>console.log(e),
  onPointClick: e=>console.log(e)
  //keys: ["chardonay","carmenere","syrah"]
};
export default Radars;
