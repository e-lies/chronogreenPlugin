import React from "react";
import PropTypes from "prop-types";
import { render } from "react-dom";
import { ResponsivePie } from "@nivo/pie";

/*let data = [
  {
    "id": "javascript",
    "label": "javascript",
    "value": 417,
    "color": "hsl(192, 70%, 50%)"
  },
  {
    "id": "sass",
    "label": "sass",
    "value": 101,
    "color": "hsl(66, 70%, 50%)"
  },
  {
    "id": "erlang",
    "label": "erlang",
    "value": 177,
    "color": "hsl(170, 70%, 50%)"
  },
  {
    "id": "c",
    "label": "c",
    "value": 66,
    "color": "hsl(2, 70%, 50%)"
  },
  {
    "id": "make",
    "label": "make",
    "value": 445,
    "color": "hsl(199, 70%, 50%)"
  }
];*/
const Pies = props => {
  const { data, colorKey, onLegendClick, onPointClick, height } = props;
  const clr =
    colorKey
      ? { colors: data.map(d => d.color), colorBy: "index" }
      : { colors: { scheme: "set1" } };
  return (
    <div id="chartPie" style={{ height }}>
      <ResponsivePie
        {...clr}
        data={data}
        margin={{
          top: 40,
          right: 80,
          bottom: 80,
          left: 80
        }}
        innerRadius={0.2}
        borderColor="inherit:darker(0.5)"
        radialLabelsSkipAngle={7}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: "color", modifiers: [] }}
        slicesLabelsSkipAngle={7}
        slicesLabelsTextColor="inherit"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        /*  defs={[
            {
                "id": "dots",
                "type": "patternDots",
                "background": "inherit",
                "color": "rgba(255, 255, 255, 0.3)",
                "size": 4,
                "padding": 1,
                "stagger": true
            },
            {
                "id": "lines",
                "type": "patternLines",
                "background": "inherit",
                "color": "rgba(255, 255, 255, 0.3)",
                "rotation": -45,
                "lineWidth": 6,
                "spacing": 10
            }
        ]} 
        fill={[
            {
                "match": {
                    "id": "ruby"
                },
                "id": "dots"
            },
            {
                "match": {
                    "id": "c"
                },
                "id": "dots"
            },
            {
                "match": {
                    "id": "go"
                },
                "id": "dots"
            },
            {
                "match": {
                    "id": "python"
                },
                "id": "dots"
            },
            {
                "match": {
                    "id": "scala"
                },
                "id": "lines"
            },
            {
                "match": {
                    "id": "lisp"
                },
                "id": "lines"
            },
            {
                "match": {
                    "id": "elixir"
                },
                "id": "lines"
            },
            {
                "match": {
                    "id": "javascript"
                },
                "id": "lines"
            }
        ]} */
        onClick={onPointClick}
        legends={[
          {
            onClick: onLegendClick,
            anchor:
              document.getElementById("chartPie") !== null &&
              document.getElementById("chartPie").offsetWidth > 799
                ? "right"
                : "bottom",
            direction: "column",
            translateY: 25,
            itemWidth: 100,
            itemHeight: 24,
            itemTextColor: "inherit",
            symbolSize: 18,
            symbolShape: "circle",
            translateX: 230,
            effects: [
              {
                on: "hover",
                style: {
                  itemWidth: 150,
                  itemHeight: 32
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
};
Pies.propTypes = {
  // data: PropTypes.array.isRequired,
  height: PropTypes.number,
  colorKey: PropTypes.string,
  onLegendClick: PropTypes.func,
  onPointClick: PropTypes.func,
};
Pies.defaultProps = {
  height: 400,
  onLegendClick: e=>console.log(e),
  onPointClick: e=>console.log(e)
};
export default Pies;
